export class Touchhold {
  constructor (el, {
    ms = 375,
    distance = 10,
  }={})
  {
    this.el = el;
    this.ms = ms;
    this.distance = distance;
    this.distanceSq = distance * distance;
    this.startX = null;
    this.startY = null;
    this.startScrollX = null;
    this.startScrollY = null;
    this.timer = null;

    this.touchdown();
    this.touchmove();
    this.touchend();
  }

  touchdown ()
  {
    $('body').on('touchstart mousedown', (e) => {
      clearTimeout(this.timer);
      let data;
      if (e.touches)
      {
        if (e.touches.length > 1)
        {
          return;
        }
        data = e.touches[0];
      }
      else
      {
        if (e.which != 1) return;
        data = e;
      }

      this.startX = data.clientX;
      this.startY = data.clientY;
      this.startScrollX = window.scrollX || document.documentElement.scrollLeft;
      this.startScrollY = window.scrollY || document.documentElement.scrollTop;
      this.timer = setTimeout(() => this.emitTouchhold(e), this.ms);
    });
  }

  touchmove ()
  {
    $(document).on('touchmove mousemove', (e) => {
      let data;
      if (e.touches)
      {
        if (e.touches.length > 1)
        {
          clearTimeout(this.timer);
          return;
        }
        data = e.touches[0];
      }
      else
      {
        data = e;
      }

      let {clientX: x, clientY: y} = data;
      let dx = x - this.startX;
      let dy = y - this.startY;
      let distanceSq = dx*dx + dy*dy;
      if (distanceSq > this.distanceSq)
      {
        clearTimeout(this.timer);
      }
    });
  }

  touchend ()
  {
    $(document).on('touchend touchcancel mouseup', (e) => {
      clearTimeout(this.timer);
    });
  }

  emitTouchhold (e)
  {
    e.type = 'touchhold';
    $(this.el).trigger(e);
  }
}
