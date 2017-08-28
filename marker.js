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
      x = x + (window.scrollX || document.documentElement.scrollLeft);
      var $el = $(el);
      var pos = $el.position();
      var bodyWidth = $('html').outerWidth();
      this.text.html($el.html());

      this.element.attr('data-mark', this.marker.color);
      this.element.attr('data-mark-first', $el.is(':first-child'));
      this.element.attr('data-mark-last', $el.is(':last-child'));

      var magWidth = this.element.outerWidth();
      var leftOffset = Math.min(Math.max(x - magWidth / 2, 0), bodyWidth - magWidth);
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
          el = (0, _utils.getElementInSpray)(x, y, this.startX, this.startY, '.mark-word');
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
  var angle = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : Math.PI / 6;
  var points = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 3;

  var dx = tx - fx;
  var dy = ty - fy;
  var magnitude = Math.sqrt(dx * dx + dy * dy);
  var nx = dx / magnitude;
  var ny = dy / magnitude;
  var sx = nx * step;
  var sy = ny * step;
  var sprayAngle = Math.atan2(ny / nx);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC9qcy9pbmRleC5qcyIsImJ1aWxkL2pzL21hZ25pZmllci5qcyIsImJ1aWxkL2pzL21hcmtlci5qcyIsImJ1aWxkL2pzL3N0eWxlci5qcyIsImJ1aWxkL2pzL3RvdWNoaG9sZC5qcyIsImJ1aWxkL2pzL3V0aWxzL2dldC1jbG9zZXN0LWVsZW1lbnQuanMiLCJidWlsZC9qcy91dGlscy9nZXQtY29vcmRzLmpzIiwiYnVpbGQvanMvdXRpbHMvZ2V0LWVsZW1lbnQtaW4tbGluZS5qcyIsImJ1aWxkL2pzL3V0aWxzL2dldC1lbGVtZW50LWluLXNwcmF5LmpzIiwiYnVpbGQvanMvdXRpbHMvaW5kZXguanMiLCJidWlsZC9qcy91dGlscy93YWxrLWVsZW1lbnRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7QUFDQSxPQUFPLE9BQVA7Ozs7Ozs7Ozs7Ozs7SUNEYSxTLFdBQUEsUztBQUVYLHFCQUFhLE1BQWIsRUFDQTtBQUFBOztBQUNFLFNBQUssTUFBTCxHQUFlLE1BQWY7QUFDQSxTQUFLLE9BQUwsR0FBZSxFQUFFLE9BQUYsRUFBVyxRQUFYLENBQW9CLFdBQXBCLENBQWY7QUFDQSxTQUFLLElBQUwsR0FBZSxFQUFFLE9BQUYsRUFBVyxRQUFYLENBQW9CLGdCQUFwQixFQUNDLFFBREQsQ0FDVSxLQUFLLE9BRGYsQ0FBZjtBQUVBLFNBQUssT0FBTCxHQUFlLEVBQUUsT0FBRixFQUFXLFFBQVgsQ0FBb0IsbUJBQXBCLEVBQ0MsUUFERCxDQUNVLEtBQUssT0FEZixDQUFmO0FBRUEsTUFBRSxNQUFGLEVBQVUsTUFBVixDQUFpQixLQUFLLE9BQXRCO0FBQ0Q7Ozs7eUJBRUssRSxFQUFJLEMsRUFDVjtBQUNFLFVBQUksS0FBSyxPQUFPLE9BQVAsSUFBa0IsU0FBUyxlQUFULENBQXlCLFVBQWhELENBQUo7QUFDQSxVQUFJLE1BQU0sRUFBRSxFQUFGLENBQVY7QUFD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ZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCB7TWFya2VyfSBmcm9tICcuL21hcmtlci5qcyc7XG5tb2R1bGUuZXhwb3J0cyA9IE1hcmtlcjtcbiIsImV4cG9ydCBjbGFzcyBNYWduaWZpZXJcbntcbiAgY29uc3RydWN0b3IgKG1hcmtlcilcbiAge1xuICAgIHRoaXMubWFya2VyICA9IG1hcmtlcjtcbiAgICB0aGlzLmVsZW1lbnQgPSAkKCc8ZGl2PicpLmFkZENsYXNzKCdtYWduaWZpZXInKTtcbiAgICB0aGlzLnRleHQgICAgPSAkKCc8ZGl2PicpLmFkZENsYXNzKCdtYWduaWZpZXItdGV4dCcpXG4gICAgICAgICAgICAgICAgICAgLmFwcGVuZFRvKHRoaXMuZWxlbWVudCk7XG4gICAgdGhpcy5wb2ludGVyID0gJCgnPGRpdj4nKS5hZGRDbGFzcygnbWFnbmlmaWVyLXBvaW50ZXInKVxuICAgICAgICAgICAgICAgICAgIC5hcHBlbmRUbyh0aGlzLmVsZW1lbnQpO1xuICAgICQoJ2JvZHknKS5hcHBlbmQodGhpcy5lbGVtZW50KTtcbiAgfVxuXG4gIHNob3cgKGVsLCB4KVxuICB7XG4gICAgeCA9IHggKyAod2luZG93LnNjcm9sbFggfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQpO1xuICAgIGxldCAkZWwgPSAkKGVsKTtcbiAgICBsZXQgcG9zID0gJGVsLnBvc2l0aW9uKCk7XG4gICAgbGV0IGJvZHlXaWR0aCA9ICQoJ2h0bWwnKS5vdXRlcldpZHRoKCk7XG4gICAgdGhpcy50ZXh0Lmh0bWwoJGVsLmh0bWwoKSk7XG5cbiAgICB0aGlzLmVsZW1lbnQuYXR0cignZGF0YS1tYXJrJywgdGhpcy5tYXJrZXIuY29sb3IpO1xuICAgIHRoaXMuZWxlbWVudC5hdHRyKCdkYXRhLW1hcmstZmlyc3QnLCAkZWwuaXMoJzpmaXJzdC1jaGlsZCcpKTtcbiAgICB0aGlzLmVsZW1lbnQuYXR0cignZGF0YS1tYXJrLWxhc3QnLCAkZWwuaXMoJzpsYXN0LWNoaWxkJykpO1xuXG4gICAgbGV0IG1hZ1dpZHRoID0gdGhpcy5lbGVtZW50Lm91dGVyV2lkdGgoKTtcbiAgICBsZXQgbGVmdE9mZnNldCA9IE1hdGgubWluKE1hdGgubWF4KCh4IC0gbWFnV2lkdGgvMiksIDApLCBib2R5V2lkdGggLSBtYWdXaWR0aCk7XG4gICAgbGVmdE9mZnNldCA9IE1hdGgubWF4KE1hdGgubWluKHBvcy5sZWZ0ICsgJGVsLndpZHRoKCkgLSBtYWdXaWR0aC8yLCBsZWZ0T2Zmc2V0KSwgcG9zLmxlZnQgLSBtYWdXaWR0aC8yKTtcbiAgICBsZXQgdG9wT2Zmc2V0ID0gcG9zLnRvcCAtIHRoaXMuZWxlbWVudC5oZWlnaHQoKTtcblxuICAgIHRoaXMuZWxlbWVudC5jc3Moe1xuICAgICAgbGVmdDogbGVmdE9mZnNldCxcbiAgICAgIHRvcDogdG9wT2Zmc2V0LFxuICAgIH0pO1xuXG4gICAgdGhpcy5wb2ludGVyLmNzcyh7XG4gICAgICBsZWZ0OiBNYXRoLm1pbihNYXRoLm1heCh4IC0gbGVmdE9mZnNldCwgMjApLCB0aGlzLmVsZW1lbnQub3V0ZXJXaWR0aCgpIC0gMjIsICgkZWwud2lkdGgoKSArIHBvcy5sZWZ0KSAtIGxlZnRPZmZzZXQpLFxuICAgIH0pO1xuXG4gICAgdGhpcy5lbGVtZW50LmFkZENsYXNzKCdzaG93Jyk7XG4gIH1cblxuICBoaWRlICgpXG4gIHtcbiAgICB0aGlzLmVsZW1lbnQucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcbiAgfVxufVxuIiwiaW1wb3J0IHtcbiAgZ2V0Q29vcmRzLFxuICBnZXRDbG9zZXN0RWxlbWVudCxcbiAgZ2V0RWxlbWVudEluTGluZSxcbiAgZ2V0RWxlbWVudEluU3ByYXksXG4gIHdhbGtFbGVtZW50c1xufSBmcm9tICcuL3V0aWxzJztcblxuaW1wb3J0IHtNYWduaWZpZXJ9IGZyb20gJy4vbWFnbmlmaWVyLmpzJztcbmltcG9ydCB7U3R5bGVyfSBmcm9tICcuL3N0eWxlci5qcyc7XG5pbXBvcnQge1RvdWNoaG9sZH0gZnJvbSAnLi90b3VjaGhvbGQuanMnO1xuXG5leHBvcnQgY2xhc3MgTWFya2VyXG57XG4gIGNvbnN0cnVjdG9yIChlbCwge1xuICAgIGNvbG9ycz17MDogJyNmMmYyZjInLCAxOiAnIzhhZjU4YScsIDI6ICcjZmY4MDgwJ30sXG4gIH09e30pXG4gIHtcbiAgICAkKGVsKS5hZGRDbGFzcygnbWFya2VyJyk7XG4gICAgJChlbCkuYXR0cignZGF0YS1pcy1oaWdobGlnaHRpbmcnLCBmYWxzZSk7XG4gICAgdGhpcy5lbCA9ICQoZWwpO1xuICAgIHRoaXMuY29sb3JzID0gY29sb3JzO1xuICAgIHRoaXMuY29sb3IgPSAwO1xuICAgIHRoaXMuY3VycmVudEhNYXJrID0gbnVsbDtcbiAgICB0aGlzLnN0YXJ0ID0gbnVsbDtcbiAgICB0aGlzLnN0YXJ0WCA9IG51bGw7XG4gICAgdGhpcy5zdGFydFkgPSBudWxsO1xuICAgIHRoaXMuZW5kID0gbnVsbDtcbiAgICB0aGlzLmVuZFggPSBudWxsO1xuICAgIHRoaXMuZW5kWSA9IG51bGw7XG4gICAgdGhpcy5pc0hlbGQgPSBmYWxzZTtcbiAgICB0aGlzLnRvdWNoaG9sZCA9IG5ldyBUb3VjaGhvbGQoJ2JvZHknKTtcbiAgICB0aGlzLm1hZ25pZmllciA9IG5ldyBNYWduaWZpZXIodGhpcyk7XG4gICAgdGhpcy5zdHlsZXIgPSBuZXcgU3R5bGVyKCk7XG4gICAgdGhpcy5lbWJlZFN0eWxlcygpO1xuICAgIHRoaXMud3JhcFdvcmRzKCk7XG4gICAgdGhpcy5yZWdpc3RlckV2ZW50cygpO1xuICB9XG5cbiAgZW1iZWRTdHlsZXMgKClcbiAge1xuICAgIGZvciAobGV0IGtleSBpbiB0aGlzLmNvbG9ycykge1xuICAgICAgdGhpcy5zdHlsZXIuc2V0KHtcbiAgICAgICAgJy5tYXJrZXInOiB7XG4gICAgICAgICAgW2BbZGF0YS1tYXJrPVwiJHtrZXl9XCJdYF06IHtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IHRoaXMuY29sb3JzW2tleV0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBbYCZbZGF0YS1pcy1oaWdobGlnaHRpbmc9XCJmYWxzZVwiXVtkYXRhLWlzLXRvdWNoaW5nPVwiZmFsc2VcIl1bZGF0YS1tYXJrPVwiJHtrZXl9XCJdXG4gICAgICAgICAgLm1hcmstd29yZDpob3ZlcmBdOiB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiB0aGlzLmNvbG9yc1trZXldLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIFtgLm1hZ25pZmllcltkYXRhLW1hcms9XCIke2tleX1cIl0gLm1hZ25pZmllci10ZXh0YF06IHtcbiAgICAgICAgICBiYWNrZ3JvdW5kOiB0aGlzLmNvbG9yc1trZXldLFxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICB3cmFwV29yZHMgKClcbiAge1xuICAgIGxldCAkZWxzID0gJCh0aGlzLmVsKS5maW5kKCcqJyk7XG4gICAgbGV0ICRlbDtcblxuICAgIHdhbGtFbGVtZW50cygkZWxzWzBdLCAkZWxzLmxhc3QoKVswXSwgdHJ1ZSwgKGVsLCBkaXIpID0+IHtcbiAgICAgIGlmIChlbC5ub2RlVHlwZSA9PSAzKSB7XG4gICAgICAgIGxldCB3b3JkcyA9IGVsLnRleHRDb250ZW50LnNwbGl0KC9cXHMrLyk7XG4gICAgICAgIGxldCB3cmFwcGVkID0gW107XG4gICAgICAgIGxldCAkbmV3RWwgPSBlbDtcblxuICAgICAgICBmb3IgKGxldCB3b3JkIG9mIHdvcmRzKVxuICAgICAgICB7XG4gICAgICAgICAgaWYgKHdvcmQubGVuZ3RoKVxuICAgICAgICAgIHtcbiAgICAgICAgICAgICRuZXdFbCA9ICQoYDxzcGFuIGNsYXNzPVwibWFyay13b3JkXCI+JHt3b3JkfTwvc3Bhbj5gKTtcbiAgICAgICAgICAgIHdyYXBwZWQucHVzaCgkbmV3RWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgkbmV3RWwgIT09IGVsKVxuICAgICAgICB7XG4gICAgICAgICAgJChlbCkucmVwbGFjZVdpdGgod3JhcHBlZCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gJG5ld0VsO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoKCRlbCA9ICQoZWwpKS5pcygnOmVtcHR5JykgJiYgISRlbC5pcygnYnIsaHInKSlcbiAgICAgIHtcbiAgICAgICAgcmV0dXJuICRlbC53cmFwKCQoJzxzcGFuIGNsYXNzPVwibWFyay13b3JkIG1hcmstYXRvbVwiPicpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGhpZ2hsaWdodFdvcmRzICgkd29yZHMpXG4gIHtcbiAgICBsZXQgZmlyc3QgPSAkd29yZHNbMF07XG4gICAgbGV0ICR3cmFwcGVyID0gJChgPHNwYW4gZGF0YS1tYXJrPVwiJHt0aGlzLmNvbG9yfVwiLz5gKTtcbiAgICAkKGZpcnN0KS5iZWZvcmUoJHdyYXBwZXIpO1xuICAgICR3cmFwcGVyLmFwcGVuZCgkd29yZHMpO1xuICAgIHRoaXMuY3VycmVudE1hcmsgPSAodGhpcy5jdXJyZW50TWFyayB8fCAkKCkpLmFkZCgkd3JhcHBlcik7XG4gICAgcmV0dXJuICR3cmFwcGVyO1xuICB9XG5cbiAgc3RhcnRIaWdobGlnaHQgKGZyb20pXG4gIHtcbiAgICAkKHRoaXMuZWwpLmF0dHIoJ2RhdGEtaXMtaGlnaGxpZ2h0aW5nJywgdHJ1ZSk7XG4gICAgdGhpcy5zdGFydCA9IGZyb207XG4gICAgdGhpcy5lbmQgPSBmcm9tO1xuICAgIHRoaXMuY3VycmVudE1hcmsgPSAkKCk7XG4gICAgdGhpcy5oaWdobGlnaHQoZnJvbSwgZnJvbSk7XG4gIH1cblxuICBjYW5jZWxIaWdobGlnaHQgKClcbiAge1xuICAgICQodGhpcy5lbCkuYXR0cignZGF0YS1pcy1oaWdobGlnaHRpbmcnLCBmYWxzZSk7XG4gICAgdGhpcy5zdGFydCA9IG51bGw7XG4gICAgdGhpcy5lbmQgPSBudWxsO1xuICAgIHRoaXMuY3VycmVudE1hcmsgPSBudWxsO1xuICB9XG5cbiAgbW92ZUhpZ2hsaWdodCAodG8pXG4gIHtcbiAgICB0aGlzLmhpZ2hsaWdodCh0aGlzLnN0YXJ0LCB0aGlzLmVuZCA9IHRvKTtcbiAgfVxuXG4gIGVuZEhpZ2hsaWdodCAoKVxuICB7XG4gICAgJCh0aGlzLmVsKS5hdHRyKCdkYXRhLWlzLWhpZ2hsaWdodGluZycsIGZhbHNlKTtcbiAgICB0aGlzLnN0YXJ0ID0gbnVsbDtcbiAgICB0aGlzLmN1cnJlbnRNYXJrID0gbnVsbDtcbiAgICB0aGlzLm5vcm1hbGl6ZUhpZ2hsaWdodHMoKTtcbiAgfVxuXG4gIGhpZ2hsaWdodCAoZnJvbSwgdG8pXG4gIHtcbiAgICBpZiAodGhpcy5jdXJyZW50TWFyaylcbiAgICB7XG4gICAgICB0aGlzLnJlbW92ZUhpZ2hsaWdodCh0aGlzLmN1cnJlbnRNYXJrKTtcbiAgICAgIHRoaXMuY3VycmVudE1hcmsgPSAkKCk7XG4gICAgfVxuXG4gICAgbGV0ICRlbHMgPSAkKCk7XG4gICAgd2Fsa0VsZW1lbnRzKGZyb20sIHRvLCBmYWxzZSwgKGVsLCBkaXIpID0+IHtcbiAgICAgIGlmIChkaXIgJiYgJGVscy5sZW5ndGgpXG4gICAgICB7XG4gICAgICAgIGxldCB3cmFwcGVyID0gdGhpcy5oaWdobGlnaHRXb3JkcygkZWxzKVswXTtcbiAgICAgICAgJGVscyA9ICQoKTtcbiAgICAgICAgcmV0dXJuIHdyYXBwZXI7XG4gICAgICB9XG5cbiAgICAgIGlmICgkKGVsKS5pcygnLm1hcmstd29yZCcpKVxuICAgICAge1xuICAgICAgICAkZWxzID0gJGVscy5hZGQoZWwpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKCRlbHMubGVuZ3RoKSB7XG4gICAgICB0aGlzLmhpZ2hsaWdodFdvcmRzKCRlbHMpO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZUhpZ2hsaWdodCAoJG1hcmspXG4gIHtcbiAgICAkbWFyay5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIGxldCAkdGhpcyA9ICQodGhpcyk7XG4gICAgICAkdGhpcy5yZXBsYWNlV2l0aCgkdGhpcy5jb250ZW50cygpKTtcbiAgICB9KTtcbiAgfVxuXG4gIGNsZWFySGlnaGxpZ2h0cyAoKVxuICB7XG4gICAgJCh0aGlzLmVsKS5maW5kKCdbZGF0YS1tYXJrXScpLm5vdCh0aGlzKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICQodGhpcykucmVwbGFjZVdpdGgoJCh0aGlzKS5jb250ZW50cygpKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5vcm1hbGl6ZUhpZ2hsaWdodHMgKClcbiAge1xuICAgIC8vIEVtcHR5XG4gICAgJCh0aGlzLmVsKS5maW5kKCdbZGF0YS1tYXJrXScpLm5vdCh0aGlzKS5maWx0ZXIoJzplbXB0eScpLnJlbW92ZSgpO1xuXG4gICAgLy8gTmVzdGVkXG4gICAgJCh0aGlzLmVsKS5maW5kKCdbZGF0YS1tYXJrXScpLm5vdCh0aGlzKS5jaGlsZHJlbignW2RhdGEtbWFya10nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIGxldCAkdGhpcyA9ICQodGhpcyk7XG4gICAgICBsZXQgJHBhcmVudCA9ICR0aGlzLnBhcmVudCgpO1xuXG4gICAgICBpZiAoJHRoaXMuYXR0cignZGF0YS1tYXJrJykgPT0gJHBhcmVudC5hdHRyKCdkYXRhLW1hcmsnKSlcbiAgICAgIHtcbiAgICAgICAgJHRoaXMucmVwbGFjZVdpdGgoJHRoaXMuY29udGVudHMoKSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgbGV0ICRsZWZ0V29yZHMgPSAkcGFyZW50LmNoaWxkcmVuKCkuZmlyc3QoKS5uZXh0VW50aWwodGhpcykuYWRkQmFjaygpO1xuICAgICAgbGV0ICRyaWdodFdvcmRzID0gJHRoaXMubmV4dEFsbCgpO1xuXG4gICAgICBpZiAoJGxlZnRXb3Jkcy5sZW5ndGgpXG4gICAgICB7XG4gICAgICAgICRwYXJlbnQuYmVmb3JlKCQoJHBhcmVudFswXS5jbG9uZU5vZGUoKSkuYXBwZW5kKCRsZWZ0V29yZHMpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCRyaWdodFdvcmRzLmxlbmd0aClcbiAgICAgIHtcbiAgICAgICAgJHBhcmVudC5hZnRlcigkKCRwYXJlbnRbMF0uY2xvbmVOb2RlKCkpLmFwcGVuZCgkcmlnaHRXb3JkcykpO1xuICAgICAgfVxuXG4gICAgICAkcGFyZW50LnJlcGxhY2VXaXRoKCR0aGlzKTtcbiAgICB9KTtcblxuICAgIC8vIEVyYXNlZFxuICAgICQodGhpcy5lbCkuZmluZCgnW2RhdGEtbWFyaz1cIjBcIl0nKS5ub3QodGhpcykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICBsZXQgJHRoaXMgPSAkKHRoaXMpO1xuICAgICAgJHRoaXMucmVwbGFjZVdpdGgoJHRoaXMuY29udGVudHMoKSk7XG4gICAgfSk7XG5cbiAgICAvLyBFbXB0eS4uLiBhZ2FpblxuICAgICQodGhpcy5lbCkuZmluZCgnW2RhdGEtbWFya10nKS5ub3QodGhpcykuZmlsdGVyKCc6ZW1wdHknKS5yZW1vdmUoKTtcblxuICAgIC8vIEFkamFjZW50XG4gICAgJCh0aGlzLmVsKS5maW5kKCdbZGF0YS1tYXJrXScpLm5vdCh0aGlzKS5uZXh0KCdbZGF0YS1tYXJrXScpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgbGV0ICR0aGlzID0gJCh0aGlzKTtcbiAgICAgIGxldCAkcHJldiA9ICR0aGlzLnByZXYoKTtcblxuICAgICAgaWYgKCR0aGlzLmF0dHIoJ2RhdGEtbWFyaycpID09ICRwcmV2LmF0dHIoJ2RhdGEtbWFyaycpKVxuICAgICAge1xuICAgICAgICAkcHJldi5hcHBlbmQoJHRoaXMuY29udGVudHMoKSk7XG4gICAgICAgICR0aGlzLnJlbW92ZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc2V0Q29sb3IgKGNvbG9yKVxuICB7XG4gICAgdGhpcy5jb2xvciA9IGNvbG9yO1xuICAgICQodGhpcy5lbCkuYXR0cignZGF0YS1tYXJrJywgY29sb3IpO1xuICB9XG5cbiAgcmVnaXN0ZXJFdmVudHMgKClcbiAge1xuICAgICQoJ2JvZHknKS5vbigndG91Y2hob2xkIG1vdXNlZG93bicsIChlKSA9PiB0aGlzLnN0YXJ0RXZlbnQoZSkpXG4gICAgICAgICAgICAgLm9uKCd0b3VjaG1vdmUgbW91c2Vtb3ZlJywgKGUpID0+IHRoaXMubW92ZUV2ZW50KGUpKVxuICAgICAgICAgICAgIC5vbigndG91Y2hlbmQgdG91Y2hjYW5jZWwgbW91c2V1cCcsIChlKSA9PiB0aGlzLmVuZEV2ZW50KGUpKVxuICAgICAgICAgICAgIDtcblxuICAgIHRoaXMuZWwuZmluZCgnLm1hcmstd29yZCcpLm9uKCdjbGljaycsIChlKSA9PiB0aGlzLmNsaWNrRXZlbnQoZSkpO1xuXG4gICAgdGhpcy50b3VjaHN3YXAoKTtcbiAgfVxuXG4gIHN0YXJ0RXZlbnQgKGUpXG4gIHtcbiAgICBpZiAoZS50eXBlID09ICdtb3VzZWRvd24nICYmIGUud2hpY2ggIT0gMSkgcmV0dXJuO1xuICAgIGlmICgkKHRoaXMuZWwpLmhhcyhlLnRhcmdldCkubGVuZ3RoID09IDApIHJldHVybjtcbiAgICBpZiAoZS50eXBlID09ICd0b3VjaGhvbGQnKVxuICAgIHtcbiAgICAgIHRoaXMuaXNIZWxkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBsZXQge3gsIHl9ID0gZ2V0Q29vcmRzKGUpO1xuICAgIGxldCBlbCA9IGdldENsb3Nlc3RFbGVtZW50KHgsIHksICcubWFyay13b3JkJyk7XG5cbiAgICBpZiAoZWwpXG4gICAge1xuICAgICAgdGhpcy5zdGFydEhpZ2hsaWdodChlbCk7XG5cbiAgICAgIGlmICh0aGlzLmlzSGVsZClcbiAgICAgIHtcbiAgICAgICAgdGhpcy5tYWduaWZpZXIuc2hvdyhlbCwgeCk7XG4gICAgICB9XG4gICAgICB0aGlzLnN0YXJ0WCA9IHg7XG4gICAgICB0aGlzLnN0YXJ0WSA9IHk7XG4gICAgICB0aGlzLmVuZFggPSB4O1xuICAgICAgdGhpcy5lbmRZID0geTtcbiAgICB9XG4gIH1cblxuICBtb3ZlRXZlbnQgKGUpXG4gIHtcbiAgICBpZiAodGhpcy5zdGFydClcbiAgICB7XG4gICAgICBpZiAoZS50eXBlID09ICd0b3VjaG1vdmUnICYmICF0aGlzLmlzSGVsZCkge1xuICAgICAgICB0aGlzLmNhbmNlbEhpZ2hsaWdodCgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIGxldCB7eCwgeX0gPSBnZXRDb29yZHMoZSk7XG4gICAgICBsZXQgZWwgPSBnZXRDbG9zZXN0RWxlbWVudCh4LCB5LCAnLm1hcmstd29yZCcsIDE2LCA2KTtcbiAgICAgIGlmICghZWwpXG4gICAgICB7XG4gICAgICAgIC8vIGVsID0gZ2V0RWxlbWVudEluTGluZSh4LCB5LCB0aGlzLnN0YXJ0WCwgdGhpcy5zdGFydFksICcubWFyay13b3JkJyk7XG4gICAgICAgIGVsID0gZ2V0RWxlbWVudEluU3ByYXkoeCwgeSwgdGhpcy5zdGFydFgsIHRoaXMuc3RhcnRZLCAnLm1hcmstd29yZCcpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZWwpXG4gICAgICB7XG4gICAgICAgIHRoaXMubW92ZUhpZ2hsaWdodChlbCk7XG5cbiAgICAgICAgaWYgKHRoaXMuaXNIZWxkKVxuICAgICAgICB7XG4gICAgICAgICAgdGhpcy5tYWduaWZpZXIuc2hvdyhlbCwgeCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbmRYID0geDtcbiAgICAgICAgdGhpcy5lbmRZID0geTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBlbmRFdmVudCAoZSlcbiAge1xuICAgIHRoaXMuZW5kSGlnaGxpZ2h0KCk7XG4gICAgdGhpcy5tYWduaWZpZXIuaGlkZSgpO1xuICAgIHRoaXMuaXNIZWxkID0gZmFsc2U7XG4gIH1cblxuICBjbGlja0V2ZW50IChlKVxuICB7XG4gICAgdGhpcy5oaWdobGlnaHQoZS50YXJnZXQsIGUudGFyZ2V0KTtcbiAgfVxuXG4gIHRvdWNoc3dhcCAoKVxuICB7XG4gICAgdGhpcy5lbC5hdHRyKCdkYXRhLWlzLXRvdWNoaW5nJywgZmFsc2UpO1xuICAgICQod2luZG93KS5vbigndG91Y2hzdGFydCB0b3VjaGVuZCcsICgpID0+IHtcbiAgICAgIHRoaXMuZWwuYXR0cignZGF0YS1pcy10b3VjaGluZycsIHRydWUpO1xuICAgIH0pO1xuICB9XG59XG5cbiIsImV4cG9ydCBjbGFzcyBTdHlsZXJcbntcbiAgY29uc3RydWN0b3IgKHJ1bGVzPXt9KVxuICB7XG4gICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAkKCdib2R5JykuYXBwZW5kKHRoaXMuZWxlbWVudCk7XG4gICAgdGhpcy5zaGVldCA9IHRoaXMuZWxlbWVudC5zaGVldDtcbiAgICB0aGlzLnJ1bGVzID0ge307XG4gICAgdGhpcy5zZXQocnVsZXMpO1xuICB9XG5cbiAgc2V0IChzZWwsIHByb3BzKVxuICB7XG4gICAgaWYgKHNlbCAmJiB0eXBlb2Ygc2VsID09PSAnb2JqZWN0JylcbiAgICB7XG4gICAgICBsZXQgcnVsZXMgPSBzZWw7XG4gICAgICBmb3IgKGxldCBzZWwgaW4gcnVsZXMpXG4gICAgICB7XG4gICAgICAgIHRoaXMuc2V0KHNlbCwgcnVsZXNbc2VsXSk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgc2VsID0gc2VsLnJlcGxhY2UoL1xccysvZywgJyAnKTtcbiAgICBsZXQgcnVsZSA9IHRoaXMucnVsZXNbc2VsXTtcbiAgICBpZiAocnVsZSlcbiAgICB7XG4gICAgICBmb3IgKGxldCBrZXkgaW4gcHJvcHMpXG4gICAgICB7XG4gICAgICAgIGlmIChwcm9wc1trZXldICYmIHR5cGVvZiBwcm9wc1trZXldID09PSAnb2JqZWN0JylcbiAgICAgICAge1xuICAgICAgICAgIHRoaXMuc2V0KHRoaXMuam9pblNlbGVjdG9ycyhzZWwsIGtleSwgcHJvcHNba2V5XSkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgIHJ1bGUuc3R5bGVba2V5XSA9IHByb3BzW2tleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgIGxldCBzdHlsZVN0ciA9ICcnO1xuICAgICAgZm9yIChsZXQga2V5IGluIHByb3BzKVxuICAgICAge1xuICAgICAgICBpZiAocHJvcHNba2V5XSAmJiB0eXBlb2YgcHJvcHNba2V5XSA9PT0gJ29iamVjdCcpXG4gICAgICAgIHtcbiAgICAgICAgICB0aGlzLnNldCh0aGlzLmpvaW5TZWxlY3RvcnMoc2VsLCBrZXkpLCBwcm9wc1trZXldKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICBzdHlsZVN0ciArPSBgJHtrZXl9OiR7cHJvcHNba2V5XX07YDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHN0eWxlU3RyLmxlbmd0aClcbiAgICAgIHtcbiAgICAgICAgdGhpcy5ydWxlc1tzZWxdID0gdGhpcy5zaGVldC5jc3NSdWxlc1tcbiAgICAgICAgICB0aGlzLnNoZWV0Lmluc2VydFJ1bGUoYCR7c2VsfXske3N0eWxlU3RyfX1gLCB0aGlzLnNoZWV0LmNzc1J1bGVzLmxlbmd0aClcbiAgICAgICAgXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBqb2luU2VsZWN0b3JzIChwYXJlbnQsIGNoaWxkKVxuICB7XG4gICAgaWYgKC8mLy50ZXN0KGNoaWxkKSlcbiAgICB7XG4gICAgICByZXR1cm4gY2hpbGQucmVwbGFjZSgvJi9nLCBwYXJlbnQpO1xuICAgIH1cbiAgICByZXR1cm4gYCR7cGFyZW50fSAke2NoaWxkfWA7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBUb3VjaGhvbGQge1xuICBjb25zdHJ1Y3RvciAoZWwsIHtcbiAgICBtcyA9IDM3NSxcbiAgICBkaXN0YW5jZSA9IDEwLFxuICB9PXt9KVxuICB7XG4gICAgdGhpcy5lbCA9IGVsO1xuICAgIHRoaXMubXMgPSBtcztcbiAgICB0aGlzLmRpc3RhbmNlID0gZGlzdGFuY2U7XG4gICAgdGhpcy5kaXN0YW5jZVNxID0gZGlzdGFuY2UgKiBkaXN0YW5jZTtcbiAgICB0aGlzLnN0YXJ0WCA9IG51bGw7XG4gICAgdGhpcy5zdGFydFkgPSBudWxsO1xuICAgIHRoaXMuc3RhcnRTY3JvbGxYID0gbnVsbDtcbiAgICB0aGlzLnN0YXJ0U2Nyb2xsWSA9IG51bGw7XG4gICAgdGhpcy50aW1lciA9IG51bGw7XG5cbiAgICB0aGlzLnRvdWNoZG93bigpO1xuICAgIHRoaXMudG91Y2htb3ZlKCk7XG4gICAgdGhpcy50b3VjaGVuZCgpO1xuICB9XG5cbiAgdG91Y2hkb3duICgpXG4gIHtcbiAgICAkKCdib2R5Jykub24oJ3RvdWNoc3RhcnQgbW91c2Vkb3duJywgKGUpID0+IHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVyKTtcbiAgICAgIGxldCBkYXRhO1xuICAgICAgaWYgKGUudG91Y2hlcylcbiAgICAgIHtcbiAgICAgICAgaWYgKGUudG91Y2hlcy5sZW5ndGggPiAxKVxuICAgICAgICB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGRhdGEgPSBlLnRvdWNoZXNbMF07XG4gICAgICB9XG4gICAgICBlbHNlXG4gICAgICB7XG4gICAgICAgIGlmIChlLndoaWNoICE9IDEpIHJldHVybjtcbiAgICAgICAgZGF0YSA9IGU7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc3RhcnRYID0gZGF0YS5jbGllbnRYO1xuICAgICAgdGhpcy5zdGFydFkgPSBkYXRhLmNsaWVudFk7XG4gICAgICB0aGlzLnN0YXJ0U2Nyb2xsWCA9IHdpbmRvdy5zY3JvbGxYIHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0O1xuICAgICAgdGhpcy5zdGFydFNjcm9sbFkgPSB3aW5kb3cuc2Nyb2xsWSB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wO1xuICAgICAgdGhpcy50aW1lciA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5lbWl0VG91Y2hob2xkKGUpLCB0aGlzLm1zKTtcbiAgICB9KTtcbiAgfVxuXG4gIHRvdWNobW92ZSAoKVxuICB7XG4gICAgJChkb2N1bWVudCkub24oJ3RvdWNobW92ZSBtb3VzZW1vdmUnLCAoZSkgPT4ge1xuICAgICAgbGV0IGRhdGE7XG4gICAgICBpZiAoZS50b3VjaGVzKVxuICAgICAge1xuICAgICAgICBpZiAoZS50b3VjaGVzLmxlbmd0aCA+IDEpXG4gICAgICAgIHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lcik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGRhdGEgPSBlLnRvdWNoZXNbMF07XG4gICAgICB9XG4gICAgICBlbHNlXG4gICAgICB7XG4gICAgICAgIGRhdGEgPSBlO1xuICAgICAgfVxuXG4gICAgICBsZXQge2NsaWVudFg6IHgsIGNsaWVudFk6IHl9ID0gZGF0YTtcbiAgICAgIGxldCBkeCA9IHggLSB0aGlzLnN0YXJ0WDtcbiAgICAgIGxldCBkeSA9IHkgLSB0aGlzLnN0YXJ0WTtcbiAgICAgIGxldCBkaXN0YW5jZVNxID0gZHgqZHggKyBkeSpkeTtcbiAgICAgIGlmIChkaXN0YW5jZVNxID4gdGhpcy5kaXN0YW5jZVNxKVxuICAgICAge1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lcik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICB0b3VjaGVuZCAoKVxuICB7XG4gICAgJChkb2N1bWVudCkub24oJ3RvdWNoZW5kIHRvdWNoY2FuY2VsIG1vdXNldXAnLCAoZSkgPT4ge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZXIpO1xuICAgIH0pO1xuICB9XG5cbiAgZW1pdFRvdWNoaG9sZCAoZSlcbiAge1xuICAgIGUudHlwZSA9ICd0b3VjaGhvbGQnO1xuICAgICQodGhpcy5lbCkudHJpZ2dlcihlKTtcbiAgfVxufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGdldENsb3Nlc3RFbGVtZW50ICh4LCB5LCBzZWwsIHJhZGl1cz0xNiwgcG9pbnRzPTkpXG57XG4gIC8vIHRyeSBjZW50ZXJcbiAgbGV0IGVsID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludCh4LCB5KTtcbiAgaWYgKGVsICYmICghc2VsIHx8ICQoZWwpLmlzKHNlbCkpKVxuICB7XG4gICAgcmV0dXJuIGVsO1xuICB9XG5cbiAgLy8gdHJ5IGNpcmNsZSBhcm91bmRcbiAgbGV0IGFuZ2xlID0gKE1hdGguUEkgKiAyKSAvIHBvaW50cztcbiAgbGV0IHhyO1xuICBsZXQgeXI7XG4gIGZvciAobGV0IGk9MDsgaTxwb2ludHM7IGkrKylcbiAge1xuICAgIHhyID0gTWF0aC5jb3MoYW5nbGUgKiBpKTtcbiAgICB5ciA9IE1hdGguc2luKGFuZ2xlICogaSk7XG4gICAgZWwgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KHggKyB4cipyYWRpdXMsIHkgKyB5cipyYWRpdXMpO1xuICAgIGlmIChlbCAmJiAoIXNlbCB8fCAkKGVsKS5pcyhzZWwpKSlcbiAgICB7XG4gICAgICByZXR1cm4gZWw7XG4gICAgfVxuICB9XG59XG5cbiIsImV4cG9ydCBmdW5jdGlvbiBnZXRDb29yZHMgKGUpXG57XG4gIGxldCB4LCB5O1xuICBpZiAoZS50b3VjaGVzKVxuICB7XG4gICAgbGV0IHRvdWNoID0gZS50b3VjaGVzWzBdO1xuICAgIHggPSB0b3VjaC5jbGllbnRYO1xuICAgIHkgPSB0b3VjaC5jbGllbnRZO1xuICB9XG4gIGVsc2VcbiAge1xuICAgIHggPSBlLmNsaWVudFg7XG4gICAgeSA9IGUuY2xpZW50WTtcbiAgfVxuICByZXR1cm4ge3gsIHl9O1xufVxuXG4iLCJleHBvcnQgZnVuY3Rpb24gZ2V0RWxlbWVudEluTGluZSAoZngsIGZ5LCB0eCwgdHksIHNlbCwgc3RlcD0xNilcbntcbiAgbGV0IGR4ID0gdHggLSBmeDtcbiAgbGV0IGR5ID0gdHkgLSBmeTtcbiAgbGV0IG1hZ25pdHVkZSA9IE1hdGguc3FydChkeCpkeCArIGR5KmR5KTtcbiAgbGV0IG54ID0gZHggLyBtYWduaXR1ZGU7XG4gIGxldCBueSA9IGR5IC8gbWFnbml0dWRlO1xuICBsZXQgc3ggPSBueCAqIHN0ZXA7XG4gIGxldCBzeSA9IG55ICogc3RlcDtcblxuICAvLyB0cnkgY2VudGVyXG4gIGxldCBlbCA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoZngsIGZ5KTtcbiAgaWYgKGVsICYmICghc2VsIHx8ICQoZWwpLmlzKHNlbCkpKVxuICB7XG4gICAgcmV0dXJuIGVsO1xuICB9XG5cbiAgLy8gdHJ5IGFsb25nIGxpbmVcbiAgZm9yIChsZXQgaT0wLCBpaT1tYWduaXR1ZGUvc3RlcDsgaTxpaTsgaSsrKVxuICB7XG4gICAgZWwgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGZ4ICsgc3gqaSwgZnkgKyBzeSppKTtcbiAgICBpZiAoZWwgJiYgKCFzZWwgfHwgJChlbCkuaXMoc2VsKSkpXG4gICAge1xuICAgICAgcmV0dXJuIGVsO1xuICAgIH1cbiAgfVxufVxuXG4iLCJleHBvcnQgZnVuY3Rpb24gZ2V0RWxlbWVudEluU3ByYXkgKGZ4LCBmeSwgdHgsIHR5LCBzZWwsIHN0ZXA9MTYsIGFuZ2xlPU1hdGguUEkvNiwgcG9pbnRzPTMpXG57XG4gIGxldCBkeCA9IHR4IC0gZng7XG4gIGxldCBkeSA9IHR5IC0gZnk7XG4gIGxldCBtYWduaXR1ZGUgPSBNYXRoLnNxcnQoZHgqZHggKyBkeSpkeSk7XG4gIGxldCBueCA9IGR4IC8gbWFnbml0dWRlO1xuICBsZXQgbnkgPSBkeSAvIG1hZ25pdHVkZTtcbiAgbGV0IHN4ID0gbnggKiBzdGVwO1xuICBsZXQgc3kgPSBueSAqIHN0ZXA7XG4gIGxldCBzcHJheUFuZ2xlID0gTWF0aC5hdGFuMihueS9ueCk7XG4gIGxldCBzdGFydEFuZ2xlID0gc3ByYXlBbmdsZSAtIChhbmdsZSpwb2ludHMvMik7XG5cbiAgLy8gdHJ5IGNlbnRlclxuICBsZXQgZWwgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGZ4LCBmeSk7XG4gIGlmIChlbCAmJiAoIXNlbCB8fCAkKGVsKS5pcyhzZWwpKSlcbiAge1xuICAgIHJldHVybiBlbDtcbiAgfVxuXG4gIC8vIHRyeSBhbG9uZyBzcHJheVxuICBsZXQgeHI7XG4gIGxldCB5cjtcbiAgZm9yIChsZXQgaT0wLCBpaT1tYWduaXR1ZGUvc3RlcDsgaTxpaTsgaSsrKVxuICB7XG4gICAgZm9yIChsZXQgaj0wOyBqPHBvaW50czsgaisrKVxuICAgIHtcbiAgICAgIHhyID0gTWF0aC5jb3Moc3RhcnRBbmdsZSArIGFuZ2xlICogaik7XG4gICAgICB5ciA9IE1hdGguc2luKHN0YXJ0QW5nbGUgKyBhbmdsZSAqIGopO1xuICAgICAgZWwgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGZ4ICsgeHIqc3RlcCppLypzeCppKi8sIGZ5ICsgeXIqc3RlcCppLypzeSppKi8pO1xuICAgICAgaWYgKGVsICYmICghc2VsIHx8ICQoZWwpLmlzKHNlbCkpKVxuICAgICAge1xuICAgICAgICByZXR1cm4gZWw7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbiIsImV4cG9ydCAqIGZyb20gJy4vZ2V0LWNsb3Nlc3QtZWxlbWVudC5qcyc7XG5leHBvcnQgKiBmcm9tICcuL2dldC1jb29yZHMuanMnO1xuZXhwb3J0ICogZnJvbSAnLi9nZXQtZWxlbWVudC1pbi1saW5lLmpzJztcbmV4cG9ydCAqIGZyb20gJy4vZ2V0LWVsZW1lbnQtaW4tc3ByYXkuanMnO1xuZXhwb3J0ICogZnJvbSAnLi93YWxrLWVsZW1lbnRzLmpzJztcbiIsImV4cG9ydCBmdW5jdGlvbiB3YWxrRWxlbWVudHMoZnJvbSwgdG8sIGluY2x1ZGVUZXh0LCBmbilcbntcbiAgLy8gdG8gaXMgYmVmb3JlIGZyb21cbiAgaWYgKGZyb20uY29tcGFyZURvY3VtZW50UG9zaXRpb24odG8pICYgTm9kZS5ET0NVTUVOVF9QT1NJVElPTl9QUkVDRURJTkcpXG4gIHtcbiAgICBsZXQgdG1wID0gZnJvbTtcbiAgICBmcm9tID0gdG87XG4gICAgdG8gPSB0bXA7XG4gIH1cblxuICBjb25zdCBTSUJMSU5HID0gMDtcbiAgY29uc3QgQ0hJTEQgPSAxO1xuICBjb25zdCBQQVJFTlQgPSAtMTtcblxuICBsZXQgJGZyb20gPSAkKGZyb20pO1xuICBsZXQgJHRvID0gJCh0byk7XG5cbiAgbGV0ICRlbCA9ICRmcm9tO1xuICBsZXQgJGNoaWxkcmVuO1xuICBsZXQgbmV4dDtcbiAgbGV0IGRpcmVjdGlvbiA9IFNJQkxJTkc7XG4gIGxldCBuZXdFbDtcbiAgbGV0IGZvdW5kVG8gPSBmYWxzZTtcbiAgbGV0IGNoaWxkcmVuRm4gPSBpbmNsdWRlVGV4dCA/ICdjb250ZW50cycgOiAnY2hpbGRyZW4nO1xuICB3aGlsZSAodHJ1ZSkge1xuICAgIG5ld0VsID0gZm4oJGVsWzBdLCBkaXJlY3Rpb24pO1xuICAgIGRpcmVjdGlvbiA9IFNJQkxJTkc7XG5cbiAgICAvLyBGbiByZXR1cm5lZCBuZXcgZWxcbiAgICBpZiAobmV3RWwpXG4gICAge1xuICAgICAgJGVsID0gJChuZXdFbCk7XG4gICAgfVxuXG4gICAgLy8gRm91bmQgdG9cbiAgICBpZiAoJGVsLmlzKHRvKSlcbiAgICB7XG4gICAgICBmb3VuZFRvID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBGb3VuZCBlbGVtZW50IHdpdGggY2hpbGRyZW5cbiAgICBpZiAoKCRjaGlsZHJlbiA9ICRlbFtjaGlsZHJlbkZuXSgpKS5sZW5ndGggJiYgIW5ld0VsKVxuICAgIHtcbiAgICAgICRlbCA9ICRjaGlsZHJlbi5maXJzdCgpO1xuICAgICAgZGlyZWN0aW9uID0gQ0hJTEQ7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBFbmQgb2YgZWxlbWVudFxuICAgIHdoaWxlICghKG5leHQgPSAkZWxbMF0ubmV4dFNpYmxpbmcpKVxuICAgIHtcbiAgICAgICRlbCA9ICRlbC5wYXJlbnQoKTtcbiAgICAgIGRpcmVjdGlvbiA9IFBBUkVOVDtcbiAgICB9XG4gICAgaWYgKGRpcmVjdGlvbiA9PSBQQVJFTlQpXG4gICAge1xuICAgICAgaWYgKGZvdW5kVG8pXG4gICAgICB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgJGVsID0gJChuZXh0KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChmb3VuZFRvKVxuICAgIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgICRlbCA9ICQobmV4dCk7XG4gIH1cbn1cbiJdfQ==
