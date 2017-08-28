// Source {{{

  const src  = {toString: ()=>'src'};
  src.js     = `${src}/js`;
  src.css    = `${src}/css`;

// }}}
// Build {{{

  const build = {toString: ()=>'build'};
  build.js    = `${build}/js`;
  build.css   = `${build}/css`;

// }}}
// Dist {{{

  const dist  = 'dist';

// }}}
// Default {{{

  export default async function (task)
  {
    await task.parallel(['js', 'css']);
  }

// }}}
// Watch {{{

  export async function watch (task)
  {
    task.start('default');
    await task.watch(`${src.js}/**/*.js`, ['js'])
    await task.watch(`${src.css}/**/*.css`, ['css'])
  }

// }}}
// Javascript {{{

  export async function js (task)
  {
    await task.serial(['babel', 'bundle', 'uglify'])
  }

  export async function babel (task)
  {
    await task.source(`${src.js}/**/*.js`)
      .babel({
        presets: [
          ['env', {
            useBuiltins: true,
          }]
        ],
        sourceMap: 'inline',
      })
      .target(build.js)
  }

  export async function bundle (task)
  {
    await task.source(`${build.js}/index.js`)
      .run({
        every: true,
        *func (file)
        {
          let p = require('path');
          let browserify = require('browserify');

          this._.files[0].data = yield new Promise((res, rej) => {
            let result = '';
            let bundle = browserify(p.format(file), {
              debug: true,
              standalone: 'Marker',
            }).bundle();

            bundle.on('data', (chunk) => {
                result += chunk.toString();
              })
              .on('end', () => {
                res(result);
              })
              .on('error', rej)
          });
        }
      })
      .concat('marker.js')
      .target(dist)
  }

  export async function uglify (task)
  {
    await task.source(`${dist}/**/*.js`, {
      ignore: '**/*.min.js',
    })
    .uglify({
      compress: {
        drop_console: true,
        join_vars: true,
      },
      ie8: true,
    })
    .run({
      every: true,
      *func (file)
      {
        file.base = file.base.replace(/\.js$/, '.min.js');
      }
    })
    .target(dist)
  }

// }}}
// CSS {{{

  export async function css (task)
  {
    await task.serial(['postcss', 'cssnano'])
  }

  export async function postcss (task)
  {
    await task.source(`${src.css}/index.css`)
      .postcss({
        plugins: [
          require('postcss-import', {
            path: [src.css],
          }),
          require('postcss-simple-vars'),
          require('postcss-color-function'),
          require('postcss-cssnext')({
            features: {
              nesting: false,
              colorFunction: false,
            },
          }),
          require('postcss-math'),
          require('postcss-extend'),
          require('postcss-nested'),
          require('postcss-remove-root'),
        ],
        from: `${src.css}/index.css`,
        map: true,
      })
      .concat('marker.css')
      .target(dist)
  }

  export async function cssnano (task)
  {
    await task.source(`${dist}/**/*.css`, {
      ignore: '**/*.min.css',
    })
    .postcss({
      plugins: [
        require('cssnano'),
      ],
      map: false,
    })
    .run({
      every: true,
      *func (file)
      {
        file.base = file.base.replace(/\.css$/, '.min.css');
      }
    })
    .target(dist)
  }

// }}}
// Clean {{{

  export async function clean (task)
  {
    await task.clear(['build', 'dist'])
  }

// }}}
