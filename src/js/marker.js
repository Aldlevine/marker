import {
  getCoords,
  getClosestElement,
  getElementInLine,
  getElementInSpray,
  walkElements
} from './utils';

import {Magnifier} from './magnifier.js';
import {Styler} from './styler.js';
import {Touchhold} from './touchhold.js';

export class Marker
{
  constructor (el, {
    colors={0: '#f2f2f2', 1: '#8af58a', 2: '#ff8080'},
  }={})
  {
    $(el).addClass('marker');
    $(el).attr('data-is-highlighting', false);
    this.el = $(el);
    this.colors = colors;
    this.color = 0;
    this.currentHMark = null;
    this.start = null;
    this.startX = null;
    this.startY = null;
    this.end = null;
    this.endX = null;
    this.endY = null;
    this.isHeld = false;
    this.touchhold = new Touchhold('body');
    this.magnifier = new Magnifier(this);
    this.styler = new Styler();
    this.embedStyles();
    this.wrapWords();
    this.registerEvents();
  }

  embedStyles ()
  {
    for (let key in this.colors) {
      this.styler.set({
        '.marker': {
          [`[data-mark="${key}"]`]: {
            background: this.colors[key],
          },
          [`&[data-is-highlighting="false"][data-is-touching="false"][data-mark="${key}"]
          .mark-word:hover`]: {
            background: this.colors[key],
          },
        },
        [`.magnifier[data-mark="${key}"] .magnifier-text`]: {
          background: this.colors[key],
        }
      });
    }
  }

  wrapWords ()
  {
    let $els = $(this.el).find('*');
    let $el;

    walkElements($els[0], $els.last()[0], true, (el, dir) => {
      if (el.nodeType == 3) {
        let words = el.textContent.split(/\s+/);
        let wrapped = [];
        let $newEl = el;

        for (let word of words)
        {
          if (word.length)
          {
            $newEl = $(`<span class="mark-word">${word}</span>`);
            wrapped.push($newEl);
          }
        }

        if ($newEl !== el)
        {
          $(el).replaceWith(wrapped);
        }

        return $newEl;
      }
      else if (($el = $(el)).is(':empty') && !$el.is('br,hr'))
      {
        return $el.wrap($('<span class="mark-word mark-atom">'));
      }
    });
  }

  highlightWords ($words)
  {
    let first = $words[0];
    let $wrapper = $(`<span data-mark="${this.color}"/>`);
    $(first).before($wrapper);
    $wrapper.append($words);
    this.currentMark = (this.currentMark || $()).add($wrapper);
    return $wrapper;
  }

  startHighlight (from)
  {
    $(this.el).attr('data-is-highlighting', true);
    this.start = from;
    this.end = from;
    this.currentMark = $();
    this.highlight(from, from);
  }

  cancelHighlight ()
  {
    $(this.el).attr('data-is-highlighting', false);
    this.start = null;
    this.end = null;
    this.currentMark = null;
  }

  moveHighlight (to)
  {
    this.highlight(this.start, this.end = to);
  }

  endHighlight ()
  {
    $(this.el).attr('data-is-highlighting', false);
    this.start = null;
    this.currentMark = null;
    this.normalizeHighlights();
  }

  highlight (from, to)
  {
    if (this.currentMark)
    {
      this.removeHighlight(this.currentMark);
      this.currentMark = $();
    }

    let $els = $();
    walkElements(from, to, false, (el, dir) => {
      if (dir && $els.length)
      {
        let wrapper = this.highlightWords($els)[0];
        $els = $();
        return wrapper;
      }

      if ($(el).is('.mark-word'))
      {
        $els = $els.add(el);
      }
    });

    if ($els.length) {
      this.highlightWords($els);
    }
  }

  removeHighlight ($mark)
  {
    $mark.each(function () {
      let $this = $(this);
      $this.replaceWith($this.contents());
    });
  }

  clearHighlights ()
  {
    $(this.el).find('[data-mark]').not(this).each(function () {
      $(this).replaceWith($(this).contents());
    });
  }

  normalizeHighlights ()
  {
    // Empty
    $(this.el).find('[data-mark]').not(this).filter(':empty').remove();

    // Nested
    $(this.el).find('[data-mark]').not(this).children('[data-mark]').each(function () {
      let $this = $(this);
      let $parent = $this.parent();

      if ($this.attr('data-mark') == $parent.attr('data-mark'))
      {
        $this.replaceWith($this.contents());
        return;
      }

      let $leftWords = $parent.children().first().nextUntil(this).addBack();
      let $rightWords = $this.nextAll();

      if ($leftWords.length)
      {
        $parent.before($($parent[0].cloneNode()).append($leftWords));
      }

      if ($rightWords.length)
      {
        $parent.after($($parent[0].cloneNode()).append($rightWords));
      }

      $parent.replaceWith($this);
    });

    // Erased
    $(this.el).find('[data-mark="0"]').not(this).each(function () {
      let $this = $(this);
      $this.replaceWith($this.contents());
    });

    // Empty... again
    $(this.el).find('[data-mark]').not(this).filter(':empty').remove();

    // Adjacent
    $(this.el).find('[data-mark]').not(this).next('[data-mark]').each(function () {
      let $this = $(this);
      let $prev = $this.prev();

      if ($this.attr('data-mark') == $prev.attr('data-mark'))
      {
        $prev.append($this.contents());
        $this.remove();
      }
    });
  }

  setColor (color)
  {
    this.color = color;
    $(this.el).attr('data-mark', color);
  }

  registerEvents ()
  {
    $('body').on('touchhold mousedown', (e) => this.startEvent(e))
             .on('touchmove mousemove', (e) => this.moveEvent(e))
             .on('touchend touchcancel mouseup', (e) => this.endEvent(e))
             ;

    this.el.find('.mark-word').on('click', (e) => this.clickEvent(e));

    this.touchswap();
  }

  startEvent (e)
  {
    if (e.type == 'mousedown' && e.which != 1) return;
    if ($(this.el).has(e.target).length == 0) return;
    if (e.type == 'touchhold')
    {
      this.isHeld = true;
    }

    let {x, y} = getCoords(e);
    let el = getClosestElement(x, y, '.mark-word');

    if (el)
    {
      this.startHighlight(el);

      if (this.isHeld)
      {
        this.magnifier.show(el, x);
      }
      this.startX = x;
      this.startY = y;
      this.endX = x;
      this.endY = y;
    }
  }

  moveEvent (e)
  {
    if (this.start)
    {
      if (e.type == 'touchmove' && !this.isHeld) {
        this.cancelHighlight();
        return;
      }
      e.preventDefault();

      let {x, y} = getCoords(e);
      let el = getClosestElement(x, y, '.mark-word', 16, 6);
      if (!el)
      {
        // el = getElementInLine(x, y, this.startX, this.startY, '.mark-word');
        el = getElementInSpray(x, y, this.startX, this.startY, '.mark-word');
      }

      if (el)
      {
        this.moveHighlight(el);

        if (this.isHeld)
        {
          this.magnifier.show(el, x);
        }
        this.endX = x;
        this.endY = y;
      }
    }
  }

  endEvent (e)
  {
    this.endHighlight();
    this.magnifier.hide();
    this.isHeld = false;
  }

  clickEvent (e)
  {
    this.highlight(e.target, e.target);
  }

  touchswap ()
  {
    this.el.attr('data-is-touching', false);
    $(window).on('touchstart touchend', () => {
      this.el.attr('data-is-touching', true);
    });
  }
}

