(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Marker = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _marker = require('./marker.js');

module.exports = _marker.Marker;

},{"./marker.js":3}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Magnifier = exports.Magnifier = function () {
  function Magnifier(marker) {
    _classCallCheck(this, Magnifier);

    this.marker = marker;
    this.element = $('<div>').addClass('magnifier');
    this.text = $('<div>').addClass('magnifier-text').appendTo(this.element);
    this.pointer = $('<div>').addClass('magnifier-pointer').appendTo(this.element);
    $('body').append(this.element);
  }

  _createClass(Magnifier, [{
    key: 'show',
    value: function show(el, x) {
      var $el = $(el);
      var pos = $el.position();
      var $body = $('body');
      var bodyWidth = $body.width();
      var bodyOuterWidth = $body.outerWidth();
      var bodyPos = $body.position();
      x = x + (window.scrollX || document.documentElement.scrollLeft);
      x = x - (bodyOuterWidth - bodyWidth) / 2;
      this.text.html($el.html());

      this.element.attr('data-mark', this.marker.color);
      this.element.attr('data-mark-first', $el.is(':first-child'));
      this.element.attr('data-mark-last', $el.is(':last-child'));

      var magWidth = this.element.outerWidth();
      var leftOffset = Math.min(Math.max(x - magWidth / 2, 0 - bodyPos.left), bodyOuterWidth + bodyPos.left - magWidth);
      leftOffset = Math.max(Math.min(pos.left + $el.width() - magWidth / 2, leftOffset), pos.left - magWidth / 2);
      var topOffset = pos.top - this.element.height();

      this.element.css({
        left: leftOffset,
        top: topOffset
      });

      this.pointer.css({
        left: Math.min(Math.max(x - leftOffset, 20), this.element.outerWidth() - 22, $el.width() + pos.left - leftOffset)
      });

      this.element.addClass('show');
    }
  }, {
    key: 'hide',
    value: function hide() {
      this.element.removeClass('show');
    }
  }]);

  return Magnifier;
}();

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Marker = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('./utils');

var _magnifier = require('./magnifier.js');

var _styler = require('./styler.js');

var _touchhold = require('./touchhold.js');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Marker = exports.Marker = function () {
  function Marker(el) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$colors = _ref.colors,
        colors = _ref$colors === undefined ? { 0: '#f2f2f2', 1: '#8af58a', 2: '#ff8080' } : _ref$colors;

    _classCallCheck(this, Marker);

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
    this.touchhold = new _touchhold.Touchhold('body');
    this.magnifier = new _magnifier.Magnifier(this);
    this.styler = new _styler.Styler();
    this.embedStyles();
    this.wrapWords();
    this.registerEvents();
  }

  _createClass(Marker, [{
    key: 'embedStyles',
    value: function embedStyles() {
      for (var key in this.colors) {
        var _marker;

        this.styler.set(_defineProperty({
          '.marker': (_marker = {}, _defineProperty(_marker, '[data-mark="' + key + '"]', {
            background: this.colors[key]
          }), _defineProperty(_marker, '&[data-is-highlighting="false"][data-is-touching="false"][data-mark="' + key + '"]\n          .mark-word:hover', {
            background: this.colors[key]
          }), _marker)
        }, '.magnifier[data-mark="' + key + '"] .magnifier-text', {
          background: this.colors[key]
        }));
      }
    }
  }, {
    key: 'wrapWords',
    value: function wrapWords() {
      var $els = $(this.el).find('*');
      var $el = void 0;

      (0, _utils.walkElements)($els[0], $els.last()[0], true, function (el, dir) {
        if (el.nodeType == 3) {
          var words = el.textContent.split(/\s+/);
          var wrapped = [];
          var $newEl = el;

          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = words[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var word = _step.value;

              if (word.length) {
                $newEl = $('<span class="mark-word">' + word + '</span>');
                wrapped.push($newEl);
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          if ($newEl !== el) {
            $(el).replaceWith(wrapped);
          }

          return $newEl;
        } else if (($el = $(el)).is(':empty') && !$el.is('br,hr')) {
          return $el.wrap($('<span class="mark-word mark-atom">'));
        }
      });
    }
  }, {
    key: 'highlightWords',
    value: function highlightWords($words) {
      var first = $words[0];
      var $wrapper = $('<span data-mark="' + this.color + '"/>');
      $(first).before($wrapper);
      $wrapper.append($words);
      this.currentMark = (this.currentMark || $()).add($wrapper);
      return $wrapper;
    }
  }, {
    key: 'startHighlight',
    value: function startHighlight(from) {
      $(this.el).attr('data-is-highlighting', true);
      this.start = from;
      this.end = from;
      this.currentMark = $();
      this.highlight(from, from);
    }
  }, {
    key: 'cancelHighlight',
    value: function cancelHighlight() {
      $(this.el).attr('data-is-highlighting', false);
      this.start = null;
      this.end = null;
      this.currentMark = null;
    }
  }, {
    key: 'moveHighlight',
    value: function moveHighlight(to) {
      this.end = to;
      this.highlight(this.start, this.end = to);
    }
  }, {
    key: 'endHighlight',
    value: function endHighlight() {
      $(this.el).attr('data-is-highlighting', false);
      this.start = null;
      this.currentMark = null;
      this.normalizeHighlights();
    }
  }, {
    key: 'highlight',
    value: function highlight(from, to) {
      var _this = this;

      if (this.currentMark) {
        this.removeHighlight(this.currentMark);
        this.currentMark = $();
      }

      var $els = $();
      (0, _utils.walkElements)(from, to, false, function (el, dir) {
        if (dir && $els.length) {
          var wrapper = _this.highlightWords($els)[0];
          $els = $();
          return wrapper;
        }

        if ($(el).is('.mark-word')) {
          $els = $els.add(el);
        }
      });

      if ($els.length) {
        this.highlightWords($els);
      }
    }
  }, {
    key: 'removeHighlight',
    value: function removeHighlight($mark) {
      $mark.each(function () {
        var $this = $(this);
        $this.replaceWith($this.contents());
      });
    }
  }, {
    key: 'clearHighlights',
    value: function clearHighlights() {
      $(this.el).find('[data-mark]').not(this).each(function () {
        $(this).replaceWith($(this).contents());
      });
    }
  }, {
    key: 'normalizeHighlights',
    value: function normalizeHighlights() {
      // Empty
      $(this.el).find('[data-mark]').not(this).filter(':empty').remove();

      // Nested
      $(this.el).find('[data-mark]').not(this).children('[data-mark]').each(function () {
        var $this = $(this);
        var $parent = $this.parent();

        if ($this.attr('data-mark') == $parent.attr('data-mark')) {
          $this.replaceWith($this.contents());
          return;
        }

        var $leftWords = $parent.children().first().nextUntil(this).addBack();
        var $rightWords = $this.nextAll();

        if ($leftWords.length) {
          $parent.before($($parent[0].cloneNode()).append($leftWords));
        }

        if ($rightWords.length) {
          $parent.after($($parent[0].cloneNode()).append($rightWords));
        }

        $parent.replaceWith($this);
      });

      // Erased
      $(this.el).find('[data-mark="0"]').not(this).each(function () {
        var $this = $(this);
        $this.replaceWith($this.contents());
      });

      // Empty... again
      $(this.el).find('[data-mark]').not(this).filter(':empty').remove();

      // Adjacent
      $(this.el).find('[data-mark]').not(this).next('[data-mark]').each(function () {
        var $this = $(this);
        var $prev = $this.prev();

        if ($this.attr('data-mark') == $prev.attr('data-mark')) {
          $prev.append($this.contents());
          $this.remove();
        }
      });
    }
  }, {
    key: 'setColor',
    value: function setColor(color) {
      this.color = color;
      $(this.el).attr('data-mark', color);
    }
  }, {
    key: 'registerEvents',
    value: function registerEvents() {
      var _this2 = this;

      $('body').on('touchhold mousedown', function (e) {
        return _this2.startEvent(e);
      }).on('touchmove mousemove', function (e) {
        return _this2.moveEvent(e);
      }).on('touchend touchcancel mouseup', function (e) {
        return _this2.endEvent(e);
      });

      this.el.find('.mark-word').on('click', function (e) {
        return _this2.clickEvent(e);
      });

      this.touchswap();
    }
  }, {
    key: 'startEvent',
    value: function startEvent(e) {
      if (e.type == 'mousedown' && e.which != 1) return;
      if ($(this.el).has(e.target).length == 0) return;
      if (e.type == 'touchhold') {
        this.isHeld = true;
      }

      var _getCoords = (0, _utils.getCoords)(e),
          x = _getCoords.x,
          y = _getCoords.y;

      var el = (0, _utils.getClosestElement)(x, y, '.mark-word');

      if (el) {
        this.startHighlight(el);

        if (this.isHeld) {
          this.magnifier.show(el, x);
        }
        this.startX = x;
        this.startY = y;
        this.endX = x;
        this.endY = y;
      }
    }
  }, {
    key: 'moveEvent',
    value: function moveEvent(e) {
      if (this.start) {
        if (e.type == 'touchmove' && !this.isHeld) {
          this.cancelHighlight();
          return;
        }
        e.preventDefault();

        var _getCoords2 = (0, _utils.getCoords)(e),
            x = _getCoords2.x,
            y = _getCoords2.y;

        var el = (0, _utils.getClosestElement)(x, y, '.mark-word', 16, 6);
        if (!el) {
          // el = getElementInLine(x, y, this.startX, this.startY, '.mark-word');
          el = (0, _utils.getElementInSpray)(x, y, this.endX, this.endY, '.mark-word');
        }

        if (el) {
          this.moveHighlight(el);

          if (this.isHeld) {
            this.magnifier.show(el, x);
          }
          this.endX = x;
          this.endY = y;
        }
      }
    }
  }, {
    key: 'endEvent',
    value: function endEvent(e) {
      this.endHighlight();
      this.magnifier.hide();
      this.isHeld = false;
    }
  }, {
    key: 'clickEvent',
    value: function clickEvent(e) {
      this.highlight(e.target, e.target);
    }
  }, {
    key: 'touchswap',
    value: function touchswap() {
      var _this3 = this;

      this.el.attr('data-is-touching', false);
      $(window).on('touchstart touchend', function () {
        _this3.el.attr('data-is-touching', true);
      });
    }
  }]);

  return Marker;
}();

},{"./magnifier.js":2,"./styler.js":4,"./touchhold.js":5,"./utils":10}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Styler = exports.Styler = function () {
  function Styler() {
    var rules = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Styler);

    this.element = document.createElement('style');
    $('body').append(this.element);
    this.sheet = this.element.sheet;
    this.rules = {};
    this.set(rules);
  }

  _createClass(Styler, [{
    key: 'set',
    value: function set(sel, props) {
      if (sel && (typeof sel === 'undefined' ? 'undefined' : _typeof(sel)) === 'object') {
        var rules = sel;
        for (var _sel in rules) {
          this.set(_sel, rules[_sel]);
        }
        return;
      }

      sel = sel.replace(/\s+/g, ' ');
      var rule = this.rules[sel];
      if (rule) {
        for (var key in props) {
          if (props[key] && _typeof(props[key]) === 'object') {
            this.set(this.joinSelectors(sel, key, props[key]));
          } else {
            rule.style[key] = props[key];
          }
        }
      } else {
        var styleStr = '';
        for (var _key in props) {
          if (props[_key] && _typeof(props[_key]) === 'object') {
            this.set(this.joinSelectors(sel, _key), props[_key]);
          } else {
            styleStr += _key + ':' + props[_key] + ';';
          }
        }
        if (styleStr.length) {
          this.rules[sel] = this.sheet.cssRules[this.sheet.insertRule(sel + '{' + styleStr + '}', this.sheet.cssRules.length)];
        }
      }
    }
  }, {
    key: 'joinSelectors',
    value: function joinSelectors(parent, child) {
      if (/&/.test(child)) {
        return child.replace(/&/g, parent);
      }
      return parent + ' ' + child;
    }
  }]);

  return Styler;
}();

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Touchhold = exports.Touchhold = function () {
  function Touchhold(el) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$ms = _ref.ms,
        ms = _ref$ms === undefined ? 375 : _ref$ms,
        _ref$distance = _ref.distance,
        distance = _ref$distance === undefined ? 10 : _ref$distance;

    _classCallCheck(this, Touchhold);

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

  _createClass(Touchhold, [{
    key: 'touchdown',
    value: function touchdown() {
      var _this = this;

      $('body').on('touchstart mousedown', function (e) {
        clearTimeout(_this.timer);
        var data = void 0;
        if (e.touches) {
          if (e.touches.length > 1) {
            return;
          }
          data = e.touches[0];
        } else {
          if (e.which != 1) return;
          data = e;
        }

        _this.startX = data.clientX;
        _this.startY = data.clientY;
        _this.startScrollX = window.scrollX || document.documentElement.scrollLeft;
        _this.startScrollY = window.scrollY || document.documentElement.scrollTop;
        _this.timer = setTimeout(function () {
          return _this.emitTouchhold(e);
        }, _this.ms);
      });
    }
  }, {
    key: 'touchmove',
    value: function touchmove() {
      var _this2 = this;

      $(document).on('touchmove mousemove', function (e) {
        var data = void 0;
        if (e.touches) {
          if (e.touches.length > 1) {
            clearTimeout(_this2.timer);
            return;
          }
          data = e.touches[0];
        } else {
          data = e;
        }

        var _data = data,
            x = _data.clientX,
            y = _data.clientY;

        var dx = x - _this2.startX;
        var dy = y - _this2.startY;
        var distanceSq = dx * dx + dy * dy;
        if (distanceSq > _this2.distanceSq) {
          clearTimeout(_this2.timer);
        }
      });
    }
  }, {
    key: 'touchend',
    value: function touchend() {
      var _this3 = this;

      $(document).on('touchend touchcancel mouseup', function (e) {
        clearTimeout(_this3.timer);
      });
    }
  }, {
    key: 'emitTouchhold',
    value: function emitTouchhold(e) {
      e.type = 'touchhold';
      $(this.el).trigger(e);
    }
  }]);

  return Touchhold;
}();

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getClosestElement = getClosestElement;
function getClosestElement(x, y, sel) {
  var radius = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 16;
  var points = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 9;

  // try center
  var el = document.elementFromPoint(x, y);
  if (el && (!sel || $(el).is(sel))) {
    return el;
  }

  // try circle around
  var angle = Math.PI * 2 / points;
  var xr = void 0;
  var yr = void 0;
  for (var i = 0; i < points; i++) {
    xr = Math.cos(angle * i);
    yr = Math.sin(angle * i);
    el = document.elementFromPoint(x + xr * radius, y + yr * radius);
    if (el && (!sel || $(el).is(sel))) {
      return el;
    }
  }
}

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCoords = getCoords;
function getCoords(e) {
  var x = void 0,
      y = void 0;
  if (e.touches) {
    var touch = e.touches[0];
    x = touch.clientX;
    y = touch.clientY;
  } else {
    x = e.clientX;
    y = e.clientY;
  }
  return { x: x, y: y };
}

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getElementInLine = getElementInLine;
function getElementInLine(fx, fy, tx, ty, sel) {
  var step = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 16;

  var dx = tx - fx;
  var dy = ty - fy;
  var magnitude = Math.sqrt(dx * dx + dy * dy);
  var nx = dx / magnitude;
  var ny = dy / magnitude;
  var sx = nx * step;
  var sy = ny * step;

  // try center
  var el = document.elementFromPoint(fx, fy);
  if (el && (!sel || $(el).is(sel))) {
    return el;
  }

  // try along line
  for (var i = 0, ii = magnitude / step; i < ii; i++) {
    el = document.elementFromPoint(fx + sx * i, fy + sy * i);
    if (el && (!sel || $(el).is(sel))) {
      return el;
    }
  }
}

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getElementInSpray = getElementInSpray;
function getElementInSpray(fx, fy, tx, ty, sel) {
  var step = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 16;
  var angle = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : Math.PI / 4;
  var points = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 3;

  var dx = tx - fx;
  var dy = ty - fy;
  var magnitude = Math.sqrt(dx * dx + dy * dy);
  var nx = dx / magnitude;
  var ny = dy / magnitude;
  var sx = nx * step;
  var sy = ny * step;
  var sprayAngle = Math.atan2(ny, nx);
  var startAngle = sprayAngle - angle * points / 2;

  // try center
  var el = document.elementFromPoint(fx, fy);
  if (el && (!sel || $(el).is(sel))) {
    return el;
  }

  // try along spray
  var xr = void 0;
  var yr = void 0;
  for (var i = 0, ii = magnitude / step; i < ii; i++) {
    for (var j = 0; j < points; j++) {
      xr = Math.cos(startAngle + angle * j);
      yr = Math.sin(startAngle + angle * j);
      el = document.elementFromPoint(fx + xr * step * i /*sx*i*/, fy + yr * step * i /*sy*i*/);
      if (el && (!sel || $(el).is(sel))) {
        return el;
      }
    }
  }
}

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getClosestElement = require('./get-closest-element.js');

Object.keys(_getClosestElement).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _getClosestElement[key];
    }
  });
});

var _getCoords = require('./get-coords.js');

Object.keys(_getCoords).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _getCoords[key];
    }
  });
});

var _getElementInLine = require('./get-element-in-line.js');

Object.keys(_getElementInLine).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _getElementInLine[key];
    }
  });
});

var _getElementInSpray = require('./get-element-in-spray.js');

Object.keys(_getElementInSpray).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _getElementInSpray[key];
    }
  });
});

var _walkElements = require('./walk-elements.js');

Object.keys(_walkElements).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _walkElements[key];
    }
  });
});

},{"./get-closest-element.js":6,"./get-coords.js":7,"./get-element-in-line.js":8,"./get-element-in-spray.js":9,"./walk-elements.js":11}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.walkElements = walkElements;
function walkElements(from, to, includeText, fn) {
  // to is before from
  if (from.compareDocumentPosition(to) & Node.DOCUMENT_POSITION_PRECEDING) {
    var tmp = from;
    from = to;
    to = tmp;
  }

  var SIBLING = 0;
  var CHILD = 1;
  var PARENT = -1;

  var $from = $(from);
  var $to = $(to);

  var $el = $from;
  var $children = void 0;
  var next = void 0;
  var direction = SIBLING;
  var newEl = void 0;
  var foundTo = false;
  var childrenFn = includeText ? 'contents' : 'children';
  while (true) {
    newEl = fn($el[0], direction);
    direction = SIBLING;

    // Fn returned new el
    if (newEl) {
      $el = $(newEl);
    }

    // Found to
    if ($el.is(to)) {
      foundTo = true;
    }

    // Found element with children
    if (($children = $el[childrenFn]()).length && !newEl) {
      $el = $children.first();
      direction = CHILD;
      continue;
    }

    // End of element
    while (!(next = $el[0].nextSibling)) {
      $el = $el.parent();
      direction = PARENT;
    }
    if (direction == PARENT) {
      if (foundTo) {
        break;
      }
      $el = $(next);
      continue;
    }

    if (foundTo) {
      break;
    }

    $el = $(next);
  }
}

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC9qcy9pbmRleC5qcyIsImJ1aWxkL2pzL21hZ25pZmllci5qcyIsImJ1aWxkL2pzL21hcmtlci5qcyIsImJ1aWxkL2pzL3N0eWxlci5qcyIsImJ1aWxkL2pzL3RvdWNoaG9sZC5qcyIsImJ1aWxkL2pzL3V0aWxzL2dldC1jbG9zZXN0LWVsZW1lbnQuanMiLCJidWlsZC9qcy91dGlscy9nZXQtY29vcmRzLmpzIiwiYnVpbGQvanMvdXRpbHMvZ2V0LWVsZW1lbnQtaW4tbGluZS5qcyIsImJ1aWxkL2pzL3V0aWxzL2dldC1lbGVtZW50LWluLXNwcmF5LmpzIiwiYnVpbGQvanMvdXRpbHMvaW5kZXguanMiLCJidWlsZC9qcy91dGlscy93YWxrLWVsZW1lbnRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7QUFDQSxPQUFPLE9BQVA7Ozs7Ozs7Ozs7Ozs7SUNEYSxTLFdBQUEsUztBQUVYLHFCQUFhLE1BQWIsRUFDQTtBQUFBOztBQUNFLFNBQUssTUFBTCxHQUFlLE1BQWY7QUFDQSxTQUFLLE9BQUwsR0FBZSxFQUFFLE9BQUYsRUFBVyxRQUFYLENBQW9CLFdBQXBCLENBQWY7QUFDQSxTQUFLLElBQUwsR0FBZSxFQUFFLE9BQUYsRUFBVyxRQUFYLENBQW9CLGdCQUFwQixFQUNDLFFBREQsQ0FDVSxLQUFLLE9BRGYsQ0FBZjtBQUVBLFNBQUssT0FBTCxHQUFlLEVBQUUsT0FBRixFQUFXLFFBQVgsQ0FBb0IsbUJBQXBCLEVBQ0MsUUFERCxDQUNVLEtBQUssT0FEZixDQUFmO0FBRUEsTUFBRSxNQUFGLEVBQVUsTUFBVixDQUFpQixLQUFLLE9BQXRCO0FBQ0Q7Ozs7eUJBRUssRSxFQUFJLEMsRUFDVjtBQUNFLFVBQUksTUFBTSxFQUFFLEVBQUYsQ0FBVjtBQUNBLFVBQUksTUFBTSxJQUFJLFFBQUosRUFBVjtBQUNBLFVBQUksUUFBUSxFQUFFLE1BQUYsQ0FBWjtB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QU47QUFDQSxrQkFBWSxNQUFaO0FBQ0Q7QUFDRCxRQUFJLGFBQWEsTUFBakIsRUFDQTtBQUNFLFVBQUksT0FBSixFQUNBO0FBQ0U7QUFDRDtBQUNELFlBQU0sRUFBRSxJQUFGLENBQU47QUFDQTtBQUNEOztBQUVELFFBQUksT0FBSixFQUNBO0FBQ0U7QUFDRDs7QUFFRCxVQUFNLEVBQUUsSUFBRixDQUFOO0FBQ0Q7QUFDRiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQge01hcmtlcn0gZnJvbSAnLi9tYXJrZXIuanMnO1xubW9kdWxlLmV4cG9ydHMgPSBNYXJrZXI7XG4iLCJleHBvcnQgY2xhc3MgTWFnbmlmaWVyXG57XG4gIGNvbnN0cnVjdG9yIChtYXJrZXIpXG4gIHtcbiAgICB0aGlzLm1hcmtlciAgPSBtYXJrZXI7XG4gICAgdGhpcy5lbGVtZW50ID0gJCgnPGRpdj4nKS5hZGRDbGFzcygnbWFnbmlmaWVyJyk7XG4gICAgdGhpcy50ZXh0ICAgID0gJCgnPGRpdj4nKS5hZGRDbGFzcygnbWFnbmlmaWVyLXRleHQnKVxuICAgICAgICAgICAgICAgICAgIC5hcHBlbmRUbyh0aGlzLmVsZW1lbnQpO1xuICAgIHRoaXMucG9pbnRlciA9ICQoJzxkaXY+JykuYWRkQ2xhc3MoJ21hZ25pZmllci1wb2ludGVyJylcbiAgICAgICAgICAgICAgICAgICAuYXBwZW5kVG8odGhpcy5lbGVtZW50KTtcbiAgICAkKCdib2R5JykuYXBwZW5kKHRoaXMuZWxlbWVudCk7XG4gIH1cblxuICBzaG93IChlbCwgeClcbiAge1xuICAgIGxldCAkZWwgPSAkKGVsKTtcbiAgICBsZXQgcG9zID0gJGVsLnBvc2l0aW9uKCk7XG4gICAgbGV0ICRib2R5ID0gJCgnYm9keScpO1xuICAgIGxldCBib2R5V2lkdGggPSAkYm9keS53aWR0aCgpO1xuICAgIGxldCBib2R5T3V0ZXJXaWR0aCA9ICRib2R5Lm91dGVyV2lkdGgoKTtcbiAgICBsZXQgYm9keVBvcyA9ICRib2R5LnBvc2l0aW9uKCk7XG4gICAgeCA9IHggKyAod2luZG93LnNjcm9sbFggfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQpO1xuICAgIHggPSB4IC0gKGJvZHlPdXRlcldpZHRoIC0gYm9keVdpZHRoKS8yO1xuICAgIHRoaXMudGV4dC5odG1sKCRlbC5odG1sKCkpO1xuXG4gICAgdGhpcy5lbGVtZW50LmF0dHIoJ2RhdGEtbWFyaycsIHRoaXMubWFya2VyLmNvbG9yKTtcbiAgICB0aGlzLmVsZW1lbnQuYXR0cignZGF0YS1tYXJrLWZpcnN0JywgJGVsLmlzKCc6Zmlyc3QtY2hpbGQnKSk7XG4gICAgdGhpcy5lbGVtZW50LmF0dHIoJ2RhdGEtbWFyay1sYXN0JywgJGVsLmlzKCc6bGFzdC1jaGlsZCcpKTtcblxuICAgIGxldCBtYWdXaWR0aCA9IHRoaXMuZWxlbWVudC5vdXRlcldpZHRoKCk7XG4gICAgbGV0IGxlZnRPZmZzZXQgPSBNYXRoLm1pbihNYXRoLm1heCgoeCAtIG1hZ1dpZHRoLzIpLCAwIC0gYm9keVBvcy5sZWZ0KSwgYm9keU91dGVyV2lkdGggKyBib2R5UG9zLmxlZnQgLSBtYWdXaWR0aCk7XG4gICAgbGVmdE9mZnNldCA9IE1hdGgubWF4KE1hdGgubWluKHBvcy5sZWZ0ICsgJGVsLndpZHRoKCkgLSBtYWdXaWR0aC8yLCBsZWZ0T2Zmc2V0KSwgcG9zLmxlZnQgLSBtYWdXaWR0aC8yKTtcbiAgICBsZXQgdG9wT2Zmc2V0ID0gcG9zLnRvcCAtIHRoaXMuZWxlbWVudC5oZWlnaHQoKTtcblxuICAgIHRoaXMuZWxlbWVudC5jc3Moe1xuICAgICAgbGVmdDogbGVmdE9mZnNldCxcbiAgICAgIHRvcDogdG9wT2Zmc2V0LFxuICAgIH0pO1xuXG4gICAgdGhpcy5wb2ludGVyLmNzcyh7XG4gICAgICBsZWZ0OiBNYXRoLm1pbihNYXRoLm1heCh4IC0gbGVmdE9mZnNldCwgMjApLCB0aGlzLmVsZW1lbnQub3V0ZXJXaWR0aCgpIC0gMjIsICgkZWwud2lkdGgoKSArIHBvcy5sZWZ0KSAtIGxlZnRPZmZzZXQpLFxuICAgIH0pO1xuXG4gICAgdGhpcy5lbGVtZW50LmFkZENsYXNzKCdzaG93Jyk7XG4gIH1cblxuICBoaWRlICgpXG4gIHtcbiAgICB0aGlzLmVsZW1lbnQucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcbiAgfVxufVxuIiwiaW1wb3J0IHtcbiAgZ2V0Q29vcmRzLFxuICBnZXRDbG9zZXN0RWxlbWVudCxcbiAgZ2V0RWxlbWVudEluTGluZSxcbiAgZ2V0RWxlbWVudEluU3ByYXksXG4gIHdhbGtFbGVtZW50c1xufSBmcm9tICcuL3V0aWxzJztcblxuaW1wb3J0IHtNYWduaWZpZXJ9IGZyb20gJy4vbWFnbmlmaWVyLmpzJztcbmltcG9ydCB7U3R5bGVyfSBmcm9tICcuL3N0eWxlci5qcyc7XG5pbXBvcnQge1RvdWNoaG9sZH0gZnJvbSAnLi90b3VjaGhvbGQuanMnO1xuXG5leHBvcnQgY2xhc3MgTWFya2VyXG57XG4gIGNvbnN0cnVjdG9yIChlbCwge1xuICAgIGNvbG9ycz17MDogJyNmMmYyZjInLCAxOiAnIzhhZjU4YScsIDI6ICcjZmY4MDgwJ30sXG4gIH09e30pXG4gIHtcbiAgICAkKGVsKS5hZGRDbGFzcygnbWFya2VyJyk7XG4gICAgJChlbCkuYXR0cignZGF0YS1pcy1oaWdobGlnaHRpbmcnLCBmYWxzZSk7XG4gICAgdGhpcy5lbCA9ICQoZWwpO1xuICAgIHRoaXMuY29sb3JzID0gY29sb3JzO1xuICAgIHRoaXMuY29sb3IgPSAwO1xuICAgIHRoaXMuY3VycmVudEhNYXJrID0gbnVsbDtcbiAgICB0aGlzLnN0YXJ0ID0gbnVsbDtcbiAgICB0aGlzLnN0YXJ0WCA9IG51bGw7XG4gICAgdGhpcy5zdGFydFkgPSBudWxsO1xuICAgIHRoaXMuZW5kID0gbnVsbDtcbiAgICB0aGlzLmVuZFggPSBudWxsO1xuICAgIHRoaXMuZW5kWSA9IG51bGw7XG4gICAgdGhpcy5pc0hlbGQgPSBmYWxzZTtcbiAgICB0aGlzLnRvdWNoaG9sZCA9IG5ldyBUb3VjaGhvbGQoJ2JvZHknKTtcbiAgICB0aGlzLm1hZ25pZmllciA9IG5ldyBNYWduaWZpZXIodGhpcyk7XG4gICAgdGhpcy5zdHlsZXIgPSBuZXcgU3R5bGVyKCk7XG4gICAgdGhpcy5lbWJlZFN0eWxlcygpO1xuICAgIHRoaXMud3JhcFdvcmRzKCk7XG4gICAgdGhpcy5yZWdpc3RlckV2ZW50cygpO1xuICB9XG5cbiAgZW1iZWRTdHlsZXMgKClcbiAge1xuICAgIGZvciAobGV0IGtleSBpbiB0aGlzLmNvbG9ycykge1xuICAgICAgdGhpcy5zdHlsZXIuc2V0KHtcbiAgICAgICAgJy5tYXJrZXInOiB7XG4gICAgICAgICAgW2BbZGF0YS1tYXJrPVwiJHtrZXl9XCJdYF06IHtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IHRoaXMuY29sb3JzW2tleV0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBbYCZbZGF0YS1pcy1oaWdobGlnaHRpbmc9XCJmYWxzZVwiXVtkYXRhLWlzLXRvdWNoaW5nPVwiZmFsc2VcIl1bZGF0YS1tYXJrPVwiJHtrZXl9XCJdXG4gICAgICAgICAgLm1hcmstd29yZDpob3ZlcmBdOiB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiB0aGlzLmNvbG9yc1trZXldLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIFtgLm1hZ25pZmllcltkYXRhLW1hcms9XCIke2tleX1cIl0gLm1hZ25pZmllci10ZXh0YF06IHtcbiAgICAgICAgICBiYWNrZ3JvdW5kOiB0aGlzLmNvbG9yc1trZXldLFxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICB3cmFwV29yZHMgKClcbiAge1xuICAgIGxldCAkZWxzID0gJCh0aGlzLmVsKS5maW5kKCcqJyk7XG4gICAgbGV0ICRlbDtcblxuICAgIHdhbGtFbGVtZW50cygkZWxzWzBdLCAkZWxzLmxhc3QoKVswXSwgdHJ1ZSwgKGVsLCBkaXIpID0+IHtcbiAgICAgIGlmIChlbC5ub2RlVHlwZSA9PSAzKSB7XG4gICAgICAgIGxldCB3b3JkcyA9IGVsLnRleHRDb250ZW50LnNwbGl0KC9cXHMrLyk7XG4gICAgICAgIGxldCB3cmFwcGVkID0gW107XG4gICAgICAgIGxldCAkbmV3RWwgPSBlbDtcblxuICAgICAgICBmb3IgKGxldCB3b3JkIG9mIHdvcmRzKVxuICAgICAgICB7XG4gICAgICAgICAgaWYgKHdvcmQubGVuZ3RoKVxuICAgICAgICAgIHtcbiAgICAgICAgICAgICRuZXdFbCA9ICQoYDxzcGFuIGNsYXNzPVwibWFyay13b3JkXCI+JHt3b3JkfTwvc3Bhbj5gKTtcbiAgICAgICAgICAgIHdyYXBwZWQucHVzaCgkbmV3RWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgkbmV3RWwgIT09IGVsKVxuICAgICAgICB7XG4gICAgICAgICAgJChlbCkucmVwbGFjZVdpdGgod3JhcHBlZCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gJG5ld0VsO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoKCRlbCA9ICQoZWwpKS5pcygnOmVtcHR5JykgJiYgISRlbC5pcygnYnIsaHInKSlcbiAgICAgIHtcbiAgICAgICAgcmV0dXJuICRlbC53cmFwKCQoJzxzcGFuIGNsYXNzPVwibWFyay13b3JkIG1hcmstYXRvbVwiPicpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGhpZ2hsaWdodFdvcmRzICgkd29yZHMpXG4gIHtcbiAgICBsZXQgZmlyc3QgPSAkd29yZHNbMF07XG4gICAgbGV0ICR3cmFwcGVyID0gJChgPHNwYW4gZGF0YS1tYXJrPVwiJHt0aGlzLmNvbG9yfVwiLz5gKTtcbiAgICAkKGZpcnN0KS5iZWZvcmUoJHdyYXBwZXIpO1xuICAgICR3cmFwcGVyLmFwcGVuZCgkd29yZHMpO1xuICAgIHRoaXMuY3VycmVudE1hcmsgPSAodGhpcy5jdXJyZW50TWFyayB8fCAkKCkpLmFkZCgkd3JhcHBlcik7XG4gICAgcmV0dXJuICR3cmFwcGVyO1xuICB9XG5cbiAgc3RhcnRIaWdobGlnaHQgKGZyb20pXG4gIHtcbiAgICAkKHRoaXMuZWwpLmF0dHIoJ2RhdGEtaXMtaGlnaGxpZ2h0aW5nJywgdHJ1ZSk7XG4gICAgdGhpcy5zdGFydCA9IGZyb207XG4gICAgdGhpcy5lbmQgPSBmcm9tO1xuICAgIHRoaXMuY3VycmVudE1hcmsgPSAkKCk7XG4gICAgdGhpcy5oaWdobGlnaHQoZnJvbSwgZnJvbSk7XG4gIH1cblxuICBjYW5jZWxIaWdobGlnaHQgKClcbiAge1xuICAgICQodGhpcy5lbCkuYXR0cignZGF0YS1pcy1oaWdobGlnaHRpbmcnLCBmYWxzZSk7XG4gICAgdGhpcy5zdGFydCA9IG51bGw7XG4gICAgdGhpcy5lbmQgPSBudWxsO1xuICAgIHRoaXMuY3VycmVudE1hcmsgPSBudWxsO1xuICB9XG5cbiAgbW92ZUhpZ2hsaWdodCAodG8pXG4gIHtcbiAgICB0aGlzLmVuZCA9IHRvO1xuICAgIHRoaXMuaGlnaGxpZ2h0KHRoaXMuc3RhcnQsIHRoaXMuZW5kID0gdG8pO1xuICB9XG5cbiAgZW5kSGlnaGxpZ2h0ICgpXG4gIHtcbiAgICAkKHRoaXMuZWwpLmF0dHIoJ2RhdGEtaXMtaGlnaGxpZ2h0aW5nJywgZmFsc2UpO1xuICAgIHRoaXMuc3RhcnQgPSBudWxsO1xuICAgIHRoaXMuY3VycmVudE1hcmsgPSBudWxsO1xuICAgIHRoaXMubm9ybWFsaXplSGlnaGxpZ2h0cygpO1xuICB9XG5cbiAgaGlnaGxpZ2h0IChmcm9tLCB0bylcbiAge1xuICAgIGlmICh0aGlzLmN1cnJlbnRNYXJrKVxuICAgIHtcbiAgICAgIHRoaXMucmVtb3ZlSGlnaGxpZ2h0KHRoaXMuY3VycmVudE1hcmspO1xuICAgICAgdGhpcy5jdXJyZW50TWFyayA9ICQoKTtcbiAgICB9XG5cbiAgICBsZXQgJGVscyA9ICQoKTtcbiAgICB3YWxrRWxlbWVudHMoZnJvbSwgdG8sIGZhbHNlLCAoZWwsIGRpcikgPT4ge1xuICAgICAgaWYgKGRpciAmJiAkZWxzLmxlbmd0aClcbiAgICAgIHtcbiAgICAgICAgbGV0IHdyYXBwZXIgPSB0aGlzLmhpZ2hsaWdodFdvcmRzKCRlbHMpWzBdO1xuICAgICAgICAkZWxzID0gJCgpO1xuICAgICAgICByZXR1cm4gd3JhcHBlcjtcbiAgICAgIH1cblxuICAgICAgaWYgKCQoZWwpLmlzKCcubWFyay13b3JkJykpXG4gICAgICB7XG4gICAgICAgICRlbHMgPSAkZWxzLmFkZChlbCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoJGVscy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuaGlnaGxpZ2h0V29yZHMoJGVscyk7XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlSGlnaGxpZ2h0ICgkbWFyaylcbiAge1xuICAgICRtYXJrLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgbGV0ICR0aGlzID0gJCh0aGlzKTtcbiAgICAgICR0aGlzLnJlcGxhY2VXaXRoKCR0aGlzLmNvbnRlbnRzKCkpO1xuICAgIH0pO1xuICB9XG5cbiAgY2xlYXJIaWdobGlnaHRzICgpXG4gIHtcbiAgICAkKHRoaXMuZWwpLmZpbmQoJ1tkYXRhLW1hcmtdJykubm90KHRoaXMpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgJCh0aGlzKS5yZXBsYWNlV2l0aCgkKHRoaXMpLmNvbnRlbnRzKCkpO1xuICAgIH0pO1xuICB9XG5cbiAgbm9ybWFsaXplSGlnaGxpZ2h0cyAoKVxuICB7XG4gICAgLy8gRW1wdHlcbiAgICAkKHRoaXMuZWwpLmZpbmQoJ1tkYXRhLW1hcmtdJykubm90KHRoaXMpLmZpbHRlcignOmVtcHR5JykucmVtb3ZlKCk7XG5cbiAgICAvLyBOZXN0ZWRcbiAgICAkKHRoaXMuZWwpLmZpbmQoJ1tkYXRhLW1hcmtdJykubm90KHRoaXMpLmNoaWxkcmVuKCdbZGF0YS1tYXJrXScpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgbGV0ICR0aGlzID0gJCh0aGlzKTtcbiAgICAgIGxldCAkcGFyZW50ID0gJHRoaXMucGFyZW50KCk7XG5cbiAgICAgIGlmICgkdGhpcy5hdHRyKCdkYXRhLW1hcmsnKSA9PSAkcGFyZW50LmF0dHIoJ2RhdGEtbWFyaycpKVxuICAgICAge1xuICAgICAgICAkdGhpcy5yZXBsYWNlV2l0aCgkdGhpcy5jb250ZW50cygpKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBsZXQgJGxlZnRXb3JkcyA9ICRwYXJlbnQuY2hpbGRyZW4oKS5maXJzdCgpLm5leHRVbnRpbCh0aGlzKS5hZGRCYWNrKCk7XG4gICAgICBsZXQgJHJpZ2h0V29yZHMgPSAkdGhpcy5uZXh0QWxsKCk7XG5cbiAgICAgIGlmICgkbGVmdFdvcmRzLmxlbmd0aClcbiAgICAgIHtcbiAgICAgICAgJHBhcmVudC5iZWZvcmUoJCgkcGFyZW50WzBdLmNsb25lTm9kZSgpKS5hcHBlbmQoJGxlZnRXb3JkcykpO1xuICAgICAgfVxuXG4gICAgICBpZiAoJHJpZ2h0V29yZHMubGVuZ3RoKVxuICAgICAge1xuICAgICAgICAkcGFyZW50LmFmdGVyKCQoJHBhcmVudFswXS5jbG9uZU5vZGUoKSkuYXBwZW5kKCRyaWdodFdvcmRzKSk7XG4gICAgICB9XG5cbiAgICAgICRwYXJlbnQucmVwbGFjZVdpdGgoJHRoaXMpO1xuICAgIH0pO1xuXG4gICAgLy8gRXJhc2VkXG4gICAgJCh0aGlzLmVsKS5maW5kKCdbZGF0YS1tYXJrPVwiMFwiXScpLm5vdCh0aGlzKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIGxldCAkdGhpcyA9ICQodGhpcyk7XG4gICAgICAkdGhpcy5yZXBsYWNlV2l0aCgkdGhpcy5jb250ZW50cygpKTtcbiAgICB9KTtcblxuICAgIC8vIEVtcHR5Li4uIGFnYWluXG4gICAgJCh0aGlzLmVsKS5maW5kKCdbZGF0YS1tYXJrXScpLm5vdCh0aGlzKS5maWx0ZXIoJzplbXB0eScpLnJlbW92ZSgpO1xuXG4gICAgLy8gQWRqYWNlbnRcbiAgICAkKHRoaXMuZWwpLmZpbmQoJ1tkYXRhLW1hcmtdJykubm90KHRoaXMpLm5leHQoJ1tkYXRhLW1hcmtdJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICBsZXQgJHRoaXMgPSAkKHRoaXMpO1xuICAgICAgbGV0ICRwcmV2ID0gJHRoaXMucHJldigpO1xuXG4gICAgICBpZiAoJHRoaXMuYXR0cignZGF0YS1tYXJrJykgPT0gJHByZXYuYXR0cignZGF0YS1tYXJrJykpXG4gICAgICB7XG4gICAgICAgICRwcmV2LmFwcGVuZCgkdGhpcy5jb250ZW50cygpKTtcbiAgICAgICAgJHRoaXMucmVtb3ZlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBzZXRDb2xvciAoY29sb3IpXG4gIHtcbiAgICB0aGlzLmNvbG9yID0gY29sb3I7XG4gICAgJCh0aGlzLmVsKS5hdHRyKCdkYXRhLW1hcmsnLCBjb2xvcik7XG4gIH1cblxuICByZWdpc3RlckV2ZW50cyAoKVxuICB7XG4gICAgJCgnYm9keScpLm9uKCd0b3VjaGhvbGQgbW91c2Vkb3duJywgKGUpID0+IHRoaXMuc3RhcnRFdmVudChlKSlcbiAgICAgICAgICAgICAub24oJ3RvdWNobW92ZSBtb3VzZW1vdmUnLCAoZSkgPT4gdGhpcy5tb3ZlRXZlbnQoZSkpXG4gICAgICAgICAgICAgLm9uKCd0b3VjaGVuZCB0b3VjaGNhbmNlbCBtb3VzZXVwJywgKGUpID0+IHRoaXMuZW5kRXZlbnQoZSkpXG4gICAgICAgICAgICAgO1xuXG4gICAgdGhpcy5lbC5maW5kKCcubWFyay13b3JkJykub24oJ2NsaWNrJywgKGUpID0+IHRoaXMuY2xpY2tFdmVudChlKSk7XG5cbiAgICB0aGlzLnRvdWNoc3dhcCgpO1xuICB9XG5cbiAgc3RhcnRFdmVudCAoZSlcbiAge1xuICAgIGlmIChlLnR5cGUgPT0gJ21vdXNlZG93bicgJiYgZS53aGljaCAhPSAxKSByZXR1cm47XG4gICAgaWYgKCQodGhpcy5lbCkuaGFzKGUudGFyZ2V0KS5sZW5ndGggPT0gMCkgcmV0dXJuO1xuICAgIGlmIChlLnR5cGUgPT0gJ3RvdWNoaG9sZCcpXG4gICAge1xuICAgICAgdGhpcy5pc0hlbGQgPSB0cnVlO1xuICAgIH1cblxuICAgIGxldCB7eCwgeX0gPSBnZXRDb29yZHMoZSk7XG4gICAgbGV0IGVsID0gZ2V0Q2xvc2VzdEVsZW1lbnQoeCwgeSwgJy5tYXJrLXdvcmQnKTtcblxuICAgIGlmIChlbClcbiAgICB7XG4gICAgICB0aGlzLnN0YXJ0SGlnaGxpZ2h0KGVsKTtcblxuICAgICAgaWYgKHRoaXMuaXNIZWxkKVxuICAgICAge1xuICAgICAgICB0aGlzLm1hZ25pZmllci5zaG93KGVsLCB4KTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc3RhcnRYID0geDtcbiAgICAgIHRoaXMuc3RhcnRZID0geTtcbiAgICAgIHRoaXMuZW5kWCA9IHg7XG4gICAgICB0aGlzLmVuZFkgPSB5O1xuICAgIH1cbiAgfVxuXG4gIG1vdmVFdmVudCAoZSlcbiAge1xuICAgIGlmICh0aGlzLnN0YXJ0KVxuICAgIHtcbiAgICAgIGlmIChlLnR5cGUgPT0gJ3RvdWNobW92ZScgJiYgIXRoaXMuaXNIZWxkKSB7XG4gICAgICAgIHRoaXMuY2FuY2VsSGlnaGxpZ2h0KCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgbGV0IHt4LCB5fSA9IGdldENvb3JkcyhlKTtcbiAgICAgIGxldCBlbCA9IGdldENsb3Nlc3RFbGVtZW50KHgsIHksICcubWFyay13b3JkJywgMTYsIDYpO1xuICAgICAgaWYgKCFlbClcbiAgICAgIHtcbiAgICAgICAgLy8gZWwgPSBnZXRFbGVtZW50SW5MaW5lKHgsIHksIHRoaXMuc3RhcnRYLCB0aGlzLnN0YXJ0WSwgJy5tYXJrLXdvcmQnKTtcbiAgICAgICAgZWwgPSBnZXRFbGVtZW50SW5TcHJheSh4LCB5LCB0aGlzLmVuZFgsIHRoaXMuZW5kWSwgJy5tYXJrLXdvcmQnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGVsKVxuICAgICAge1xuICAgICAgICB0aGlzLm1vdmVIaWdobGlnaHQoZWwpO1xuXG4gICAgICAgIGlmICh0aGlzLmlzSGVsZClcbiAgICAgICAge1xuICAgICAgICAgIHRoaXMubWFnbmlmaWVyLnNob3coZWwsIHgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZW5kWCA9IHg7XG4gICAgICAgIHRoaXMuZW5kWSA9IHk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZW5kRXZlbnQgKGUpXG4gIHtcbiAgICB0aGlzLmVuZEhpZ2hsaWdodCgpO1xuICAgIHRoaXMubWFnbmlmaWVyLmhpZGUoKTtcbiAgICB0aGlzLmlzSGVsZCA9IGZhbHNlO1xuICB9XG5cbiAgY2xpY2tFdmVudCAoZSlcbiAge1xuICAgIHRoaXMuaGlnaGxpZ2h0KGUudGFyZ2V0LCBlLnRhcmdldCk7XG4gIH1cblxuICB0b3VjaHN3YXAgKClcbiAge1xuICAgIHRoaXMuZWwuYXR0cignZGF0YS1pcy10b3VjaGluZycsIGZhbHNlKTtcbiAgICAkKHdpbmRvdykub24oJ3RvdWNoc3RhcnQgdG91Y2hlbmQnLCAoKSA9PiB7XG4gICAgICB0aGlzLmVsLmF0dHIoJ2RhdGEtaXMtdG91Y2hpbmcnLCB0cnVlKTtcbiAgICB9KTtcbiAgfVxufVxuXG4iLCJleHBvcnQgY2xhc3MgU3R5bGVyXG57XG4gIGNvbnN0cnVjdG9yIChydWxlcz17fSlcbiAge1xuICAgIHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgJCgnYm9keScpLmFwcGVuZCh0aGlzLmVsZW1lbnQpO1xuICAgIHRoaXMuc2hlZXQgPSB0aGlzLmVsZW1lbnQuc2hlZXQ7XG4gICAgdGhpcy5ydWxlcyA9IHt9O1xuICAgIHRoaXMuc2V0KHJ1bGVzKTtcbiAgfVxuXG4gIHNldCAoc2VsLCBwcm9wcylcbiAge1xuICAgIGlmIChzZWwgJiYgdHlwZW9mIHNlbCA9PT0gJ29iamVjdCcpXG4gICAge1xuICAgICAgbGV0IHJ1bGVzID0gc2VsO1xuICAgICAgZm9yIChsZXQgc2VsIGluIHJ1bGVzKVxuICAgICAge1xuICAgICAgICB0aGlzLnNldChzZWwsIHJ1bGVzW3NlbF0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHNlbCA9IHNlbC5yZXBsYWNlKC9cXHMrL2csICcgJyk7XG4gICAgbGV0IHJ1bGUgPSB0aGlzLnJ1bGVzW3NlbF07XG4gICAgaWYgKHJ1bGUpXG4gICAge1xuICAgICAgZm9yIChsZXQga2V5IGluIHByb3BzKVxuICAgICAge1xuICAgICAgICBpZiAocHJvcHNba2V5XSAmJiB0eXBlb2YgcHJvcHNba2V5XSA9PT0gJ29iamVjdCcpXG4gICAgICAgIHtcbiAgICAgICAgICB0aGlzLnNldCh0aGlzLmpvaW5TZWxlY3RvcnMoc2VsLCBrZXksIHByb3BzW2tleV0pKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICBydWxlLnN0eWxlW2tleV0gPSBwcm9wc1trZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICBsZXQgc3R5bGVTdHIgPSAnJztcbiAgICAgIGZvciAobGV0IGtleSBpbiBwcm9wcylcbiAgICAgIHtcbiAgICAgICAgaWYgKHByb3BzW2tleV0gJiYgdHlwZW9mIHByb3BzW2tleV0gPT09ICdvYmplY3QnKVxuICAgICAgICB7XG4gICAgICAgICAgdGhpcy5zZXQodGhpcy5qb2luU2VsZWN0b3JzKHNlbCwga2V5KSwgcHJvcHNba2V5XSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgc3R5bGVTdHIgKz0gYCR7a2V5fToke3Byb3BzW2tleV19O2A7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdHlsZVN0ci5sZW5ndGgpXG4gICAgICB7XG4gICAgICAgIHRoaXMucnVsZXNbc2VsXSA9IHRoaXMuc2hlZXQuY3NzUnVsZXNbXG4gICAgICAgICAgdGhpcy5zaGVldC5pbnNlcnRSdWxlKGAke3NlbH17JHtzdHlsZVN0cn19YCwgdGhpcy5zaGVldC5jc3NSdWxlcy5sZW5ndGgpXG4gICAgICAgIF07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgam9pblNlbGVjdG9ycyAocGFyZW50LCBjaGlsZClcbiAge1xuICAgIGlmICgvJi8udGVzdChjaGlsZCkpXG4gICAge1xuICAgICAgcmV0dXJuIGNoaWxkLnJlcGxhY2UoLyYvZywgcGFyZW50KTtcbiAgICB9XG4gICAgcmV0dXJuIGAke3BhcmVudH0gJHtjaGlsZH1gO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgVG91Y2hob2xkIHtcbiAgY29uc3RydWN0b3IgKGVsLCB7XG4gICAgbXMgPSAzNzUsXG4gICAgZGlzdGFuY2UgPSAxMCxcbiAgfT17fSlcbiAge1xuICAgIHRoaXMuZWwgPSBlbDtcbiAgICB0aGlzLm1zID0gbXM7XG4gICAgdGhpcy5kaXN0YW5jZSA9IGRpc3RhbmNlO1xuICAgIHRoaXMuZGlzdGFuY2VTcSA9IGRpc3RhbmNlICogZGlzdGFuY2U7XG4gICAgdGhpcy5zdGFydFggPSBudWxsO1xuICAgIHRoaXMuc3RhcnRZID0gbnVsbDtcbiAgICB0aGlzLnN0YXJ0U2Nyb2xsWCA9IG51bGw7XG4gICAgdGhpcy5zdGFydFNjcm9sbFkgPSBudWxsO1xuICAgIHRoaXMudGltZXIgPSBudWxsO1xuXG4gICAgdGhpcy50b3VjaGRvd24oKTtcbiAgICB0aGlzLnRvdWNobW92ZSgpO1xuICAgIHRoaXMudG91Y2hlbmQoKTtcbiAgfVxuXG4gIHRvdWNoZG93biAoKVxuICB7XG4gICAgJCgnYm9keScpLm9uKCd0b3VjaHN0YXJ0IG1vdXNlZG93bicsIChlKSA9PiB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lcik7XG4gICAgICBsZXQgZGF0YTtcbiAgICAgIGlmIChlLnRvdWNoZXMpXG4gICAgICB7XG4gICAgICAgIGlmIChlLnRvdWNoZXMubGVuZ3RoID4gMSlcbiAgICAgICAge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBkYXRhID0gZS50b3VjaGVzWzBdO1xuICAgICAgfVxuICAgICAgZWxzZVxuICAgICAge1xuICAgICAgICBpZiAoZS53aGljaCAhPSAxKSByZXR1cm47XG4gICAgICAgIGRhdGEgPSBlO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnN0YXJ0WCA9IGRhdGEuY2xpZW50WDtcbiAgICAgIHRoaXMuc3RhcnRZID0gZGF0YS5jbGllbnRZO1xuICAgICAgdGhpcy5zdGFydFNjcm9sbFggPSB3aW5kb3cuc2Nyb2xsWCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdDtcbiAgICAgIHRoaXMuc3RhcnRTY3JvbGxZID0gd2luZG93LnNjcm9sbFkgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcDtcbiAgICAgIHRoaXMudGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHRoaXMuZW1pdFRvdWNoaG9sZChlKSwgdGhpcy5tcyk7XG4gICAgfSk7XG4gIH1cblxuICB0b3VjaG1vdmUgKClcbiAge1xuICAgICQoZG9jdW1lbnQpLm9uKCd0b3VjaG1vdmUgbW91c2Vtb3ZlJywgKGUpID0+IHtcbiAgICAgIGxldCBkYXRhO1xuICAgICAgaWYgKGUudG91Y2hlcylcbiAgICAgIHtcbiAgICAgICAgaWYgKGUudG91Y2hlcy5sZW5ndGggPiAxKVxuICAgICAgICB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZXIpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBkYXRhID0gZS50b3VjaGVzWzBdO1xuICAgICAgfVxuICAgICAgZWxzZVxuICAgICAge1xuICAgICAgICBkYXRhID0gZTtcbiAgICAgIH1cblxuICAgICAgbGV0IHtjbGllbnRYOiB4LCBjbGllbnRZOiB5fSA9IGRhdGE7XG4gICAgICBsZXQgZHggPSB4IC0gdGhpcy5zdGFydFg7XG4gICAgICBsZXQgZHkgPSB5IC0gdGhpcy5zdGFydFk7XG4gICAgICBsZXQgZGlzdGFuY2VTcSA9IGR4KmR4ICsgZHkqZHk7XG4gICAgICBpZiAoZGlzdGFuY2VTcSA+IHRoaXMuZGlzdGFuY2VTcSlcbiAgICAgIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZXIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgdG91Y2hlbmQgKClcbiAge1xuICAgICQoZG9jdW1lbnQpLm9uKCd0b3VjaGVuZCB0b3VjaGNhbmNlbCBtb3VzZXVwJywgKGUpID0+IHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVyKTtcbiAgICB9KTtcbiAgfVxuXG4gIGVtaXRUb3VjaGhvbGQgKGUpXG4gIHtcbiAgICBlLnR5cGUgPSAndG91Y2hob2xkJztcbiAgICAkKHRoaXMuZWwpLnRyaWdnZXIoZSk7XG4gIH1cbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBnZXRDbG9zZXN0RWxlbWVudCAoeCwgeSwgc2VsLCByYWRpdXM9MTYsIHBvaW50cz05KVxue1xuICAvLyB0cnkgY2VudGVyXG4gIGxldCBlbCA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoeCwgeSk7XG4gIGlmIChlbCAmJiAoIXNlbCB8fCAkKGVsKS5pcyhzZWwpKSlcbiAge1xuICAgIHJldHVybiBlbDtcbiAgfVxuXG4gIC8vIHRyeSBjaXJjbGUgYXJvdW5kXG4gIGxldCBhbmdsZSA9IChNYXRoLlBJICogMikgLyBwb2ludHM7XG4gIGxldCB4cjtcbiAgbGV0IHlyO1xuICBmb3IgKGxldCBpPTA7IGk8cG9pbnRzOyBpKyspXG4gIHtcbiAgICB4ciA9IE1hdGguY29zKGFuZ2xlICogaSk7XG4gICAgeXIgPSBNYXRoLnNpbihhbmdsZSAqIGkpO1xuICAgIGVsID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludCh4ICsgeHIqcmFkaXVzLCB5ICsgeXIqcmFkaXVzKTtcbiAgICBpZiAoZWwgJiYgKCFzZWwgfHwgJChlbCkuaXMoc2VsKSkpXG4gICAge1xuICAgICAgcmV0dXJuIGVsO1xuICAgIH1cbiAgfVxufVxuXG4iLCJleHBvcnQgZnVuY3Rpb24gZ2V0Q29vcmRzIChlKVxue1xuICBsZXQgeCwgeTtcbiAgaWYgKGUudG91Y2hlcylcbiAge1xuICAgIGxldCB0b3VjaCA9IGUudG91Y2hlc1swXTtcbiAgICB4ID0gdG91Y2guY2xpZW50WDtcbiAgICB5ID0gdG91Y2guY2xpZW50WTtcbiAgfVxuICBlbHNlXG4gIHtcbiAgICB4ID0gZS5jbGllbnRYO1xuICAgIHkgPSBlLmNsaWVudFk7XG4gIH1cbiAgcmV0dXJuIHt4LCB5fTtcbn1cblxuIiwiZXhwb3J0IGZ1bmN0aW9uIGdldEVsZW1lbnRJbkxpbmUgKGZ4LCBmeSwgdHgsIHR5LCBzZWwsIHN0ZXA9MTYpXG57XG4gIGxldCBkeCA9IHR4IC0gZng7XG4gIGxldCBkeSA9IHR5IC0gZnk7XG4gIGxldCBtYWduaXR1ZGUgPSBNYXRoLnNxcnQoZHgqZHggKyBkeSpkeSk7XG4gIGxldCBueCA9IGR4IC8gbWFnbml0dWRlO1xuICBsZXQgbnkgPSBkeSAvIG1hZ25pdHVkZTtcbiAgbGV0IHN4ID0gbnggKiBzdGVwO1xuICBsZXQgc3kgPSBueSAqIHN0ZXA7XG5cbiAgLy8gdHJ5IGNlbnRlclxuICBsZXQgZWwgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGZ4LCBmeSk7XG4gIGlmIChlbCAmJiAoIXNlbCB8fCAkKGVsKS5pcyhzZWwpKSlcbiAge1xuICAgIHJldHVybiBlbDtcbiAgfVxuXG4gIC8vIHRyeSBhbG9uZyBsaW5lXG4gIGZvciAobGV0IGk9MCwgaWk9bWFnbml0dWRlL3N0ZXA7IGk8aWk7IGkrKylcbiAge1xuICAgIGVsID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChmeCArIHN4KmksIGZ5ICsgc3kqaSk7XG4gICAgaWYgKGVsICYmICghc2VsIHx8ICQoZWwpLmlzKHNlbCkpKVxuICAgIHtcbiAgICAgIHJldHVybiBlbDtcbiAgICB9XG4gIH1cbn1cblxuIiwiZXhwb3J0IGZ1bmN0aW9uIGdldEVsZW1lbnRJblNwcmF5IChmeCwgZnksIHR4LCB0eSwgc2VsLCBzdGVwPTE2LCBhbmdsZT1NYXRoLlBJLzQsIHBvaW50cz0zKVxue1xuICBsZXQgZHggPSB0eCAtIGZ4O1xuICBsZXQgZHkgPSB0eSAtIGZ5O1xuICBsZXQgbWFnbml0dWRlID0gTWF0aC5zcXJ0KGR4KmR4ICsgZHkqZHkpO1xuICBsZXQgbnggPSBkeCAvIG1hZ25pdHVkZTtcbiAgbGV0IG55ID0gZHkgLyBtYWduaXR1ZGU7XG4gIGxldCBzeCA9IG54ICogc3RlcDtcbiAgbGV0IHN5ID0gbnkgKiBzdGVwO1xuICBsZXQgc3ByYXlBbmdsZSA9IE1hdGguYXRhbjIobnksIG54KTtcbiAgbGV0IHN0YXJ0QW5nbGUgPSBzcHJheUFuZ2xlIC0gKGFuZ2xlKnBvaW50cy8yKTtcblxuICAvLyB0cnkgY2VudGVyXG4gIGxldCBlbCA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoZngsIGZ5KTtcbiAgaWYgKGVsICYmICghc2VsIHx8ICQoZWwpLmlzKHNlbCkpKVxuICB7XG4gICAgcmV0dXJuIGVsO1xuICB9XG5cbiAgLy8gdHJ5IGFsb25nIHNwcmF5XG4gIGxldCB4cjtcbiAgbGV0IHlyO1xuICBmb3IgKGxldCBpPTAsIGlpPW1hZ25pdHVkZS9zdGVwOyBpPGlpOyBpKyspXG4gIHtcbiAgICBmb3IgKGxldCBqPTA7IGo8cG9pbnRzOyBqKyspXG4gICAge1xuICAgICAgeHIgPSBNYXRoLmNvcyhzdGFydEFuZ2xlICsgYW5nbGUgKiBqKTtcbiAgICAgIHlyID0gTWF0aC5zaW4oc3RhcnRBbmdsZSArIGFuZ2xlICogaik7XG4gICAgICBlbCA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoZnggKyB4cipzdGVwKmkvKnN4KmkqLywgZnkgKyB5cipzdGVwKmkvKnN5KmkqLyk7XG4gICAgICBpZiAoZWwgJiYgKCFzZWwgfHwgJChlbCkuaXMoc2VsKSkpXG4gICAgICB7XG4gICAgICAgIHJldHVybiBlbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuIiwiZXhwb3J0ICogZnJvbSAnLi9nZXQtY2xvc2VzdC1lbGVtZW50LmpzJztcbmV4cG9ydCAqIGZyb20gJy4vZ2V0LWNvb3Jkcy5qcyc7XG5leHBvcnQgKiBmcm9tICcuL2dldC1lbGVtZW50LWluLWxpbmUuanMnO1xuZXhwb3J0ICogZnJvbSAnLi9nZXQtZWxlbWVudC1pbi1zcHJheS5qcyc7XG5leHBvcnQgKiBmcm9tICcuL3dhbGstZWxlbWVudHMuanMnO1xuIiwiZXhwb3J0IGZ1bmN0aW9uIHdhbGtFbGVtZW50cyhmcm9tLCB0bywgaW5jbHVkZVRleHQsIGZuKVxue1xuICAvLyB0byBpcyBiZWZvcmUgZnJvbVxuICBpZiAoZnJvbS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbih0bykgJiBOb2RlLkRPQ1VNRU5UX1BPU0lUSU9OX1BSRUNFRElORylcbiAge1xuICAgIGxldCB0bXAgPSBmcm9tO1xuICAgIGZyb20gPSB0bztcbiAgICB0byA9IHRtcDtcbiAgfVxuXG4gIGNvbnN0IFNJQkxJTkcgPSAwO1xuICBjb25zdCBDSElMRCA9IDE7XG4gIGNvbnN0IFBBUkVOVCA9IC0xO1xuXG4gIGxldCAkZnJvbSA9ICQoZnJvbSk7XG4gIGxldCAkdG8gPSAkKHRvKTtcblxuICBsZXQgJGVsID0gJGZyb207XG4gIGxldCAkY2hpbGRyZW47XG4gIGxldCBuZXh0O1xuICBsZXQgZGlyZWN0aW9uID0gU0lCTElORztcbiAgbGV0IG5ld0VsO1xuICBsZXQgZm91bmRUbyA9IGZhbHNlO1xuICBsZXQgY2hpbGRyZW5GbiA9IGluY2x1ZGVUZXh0ID8gJ2NvbnRlbnRzJyA6ICdjaGlsZHJlbic7XG4gIHdoaWxlICh0cnVlKSB7XG4gICAgbmV3RWwgPSBmbigkZWxbMF0sIGRpcmVjdGlvbik7XG4gICAgZGlyZWN0aW9uID0gU0lCTElORztcblxuICAgIC8vIEZuIHJldHVybmVkIG5ldyBlbFxuICAgIGlmIChuZXdFbClcbiAgICB7XG4gICAgICAkZWwgPSAkKG5ld0VsKTtcbiAgICB9XG5cbiAgICAvLyBGb3VuZCB0b1xuICAgIGlmICgkZWwuaXModG8pKVxuICAgIHtcbiAgICAgIGZvdW5kVG8gPSB0cnVlO1xuICAgIH1cblxuICAgIC8vIEZvdW5kIGVsZW1lbnQgd2l0aCBjaGlsZHJlblxuICAgIGlmICgoJGNoaWxkcmVuID0gJGVsW2NoaWxkcmVuRm5dKCkpLmxlbmd0aCAmJiAhbmV3RWwpXG4gICAge1xuICAgICAgJGVsID0gJGNoaWxkcmVuLmZpcnN0KCk7XG4gICAgICBkaXJlY3Rpb24gPSBDSElMRDtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIEVuZCBvZiBlbGVtZW50XG4gICAgd2hpbGUgKCEobmV4dCA9ICRlbFswXS5uZXh0U2libGluZykpXG4gICAge1xuICAgICAgJGVsID0gJGVsLnBhcmVudCgpO1xuICAgICAgZGlyZWN0aW9uID0gUEFSRU5UO1xuICAgIH1cbiAgICBpZiAoZGlyZWN0aW9uID09IFBBUkVOVClcbiAgICB7XG4gICAgICBpZiAoZm91bmRUbylcbiAgICAgIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICAkZWwgPSAkKG5leHQpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKGZvdW5kVG8pXG4gICAge1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgJGVsID0gJChuZXh0KTtcbiAgfVxufVxuIl19
