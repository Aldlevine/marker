export class Magnifier
{
  constructor (marker)
  {
    this.marker  = marker;
    this.element = $('<div>').addClass('magnifier');
    this.text    = $('<div>').addClass('magnifier-text')
                   .appendTo(this.element);
    this.pointer = $('<div>').addClass('magnifier-pointer')
                   .appendTo(this.element);
    $('body').append(this.element);
  }

  show (el, x)
  {
    x = x + (window.scrollX || document.documentElement.scrollLeft);
    let $el = $(el);
    let pos = $el.position();
    let bodyWidth = $('html').outerWidth();
    this.text.html($el.html());

    this.element.attr('data-mark', this.marker.color);
    this.element.attr('data-mark-first', $el.is(':first-child'));
    this.element.attr('data-mark-last', $el.is(':last-child'));

    let magWidth = this.element.outerWidth();
    let leftOffset = Math.min(Math.max((x - magWidth/2), 0), bodyWidth - magWidth);
    leftOffset = Math.max(Math.min(pos.left + $el.width() - magWidth/2, leftOffset), pos.left - magWidth/2);
    let topOffset = pos.top - this.element.height();

    this.element.css({
      left: leftOffset,
      top: topOffset,
    });

    this.pointer.css({
      left: Math.min(Math.max(x - leftOffset, 20), this.element.outerWidth() - 22, ($el.width() + pos.left) - leftOffset),
    });

    this.element.addClass('show');
  }

  hide ()
  {
    this.element.removeClass('show');
  }
}
