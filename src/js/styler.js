export class Styler
{
  constructor (rules={})
  {
    this.element = document.createElement('style');
    $('body').append(this.element);
    this.sheet = this.element.sheet;
    this.rules = {};
    this.set(rules);
  }

  set (sel, props)
  {
    if (sel && typeof sel === 'object')
    {
      let rules = sel;
      for (let sel in rules)
      {
        this.set(sel, rules[sel]);
      }
      return;
    }

    sel = sel.replace(/\s+/g, ' ');
    let rule = this.rules[sel];
    if (rule)
    {
      for (let key in props)
      {
        if (props[key] && typeof props[key] === 'object')
        {
          this.set(this.joinSelectors(sel, key, props[key]));
        }
        else
        {
          rule.style[key] = props[key];
        }
      }
    }
    else
    {
      let styleStr = '';
      for (let key in props)
      {
        if (props[key] && typeof props[key] === 'object')
        {
          this.set(this.joinSelectors(sel, key), props[key]);
        }
        else
        {
          styleStr += `${key}:${props[key]};`;
        }
      }
      if (styleStr.length)
      {
        this.rules[sel] = this.sheet.cssRules[
          this.sheet.insertRule(`${sel}{${styleStr}}`, this.sheet.cssRules.length)
        ];
      }
    }
  }

  joinSelectors (parent, child)
  {
    if (/&/.test(child))
    {
      return child.replace(/&/g, parent);
    }
    return `${parent} ${child}`;
  }
}
