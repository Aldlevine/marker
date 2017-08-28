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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC9qcy9pbmRleC5qcyIsImJ1aWxkL2pzL21hZ25pZmllci5qcyIsImJ1aWxkL2pzL21hcmtlci5qcyIsImJ1aWxkL2pzL3N0eWxlci5qcyIsImJ1aWxkL2pzL3RvdWNoaG9sZC5qcyIsImJ1aWxkL2pzL3V0aWxzL2dldC1jbG9zZXN0LWVsZW1lbnQuanMiLCJidWlsZC9qcy91dGlscy9nZXQtY29vcmRzLmpzIiwiYnVpbGQvanMvdXRpbHMvZ2V0LWVsZW1lbnQtaW4tbGluZS5qcyIsImJ1aWxkL2pzL3V0aWxzL2dldC1lbGVtZW50LWluLXNwcmF5LmpzIiwiYnVpbGQvanMvdXRpbHMvaW5kZXguanMiLCJidWlsZC9qcy91dGlscy93YWxrLWVsZW1lbnRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7QUFDQSxPQUFPLE9BQVA7Ozs7Ozs7Ozs7Ozs7SUNEYSxTLFdBQUEsUztBQUVYLHFCQUFhLE1BQWIsRUFDQTtBQUFBOztBQUNFLFNBQUssTUFBTCxHQUFlLE1BQWY7QUFDQSxTQUFLLE9BQUwsR0FBZSxFQUFFLE9BQUYsRUFBVyxRQUFYLENBQW9CLFdBQXBCLENBQWY7QUFDQSxTQUFLLElBQUwsR0FBZSxFQUFFLE9BQUYsRUFBVyxRQUFYLENBQW9CLGdCQUFwQixFQUNDLFFBREQsQ0FDVSxLQUFLLE9BRGYsQ0FBZjtBQUVBLFNBQUssT0FBTCxHQUFlLEVBQUUsT0FBRixFQUFXLFFBQVgsQ0FBb0IsbUJBQXBCLEVBQ0MsUUFERCxDQUNVLEtBQUssT0FEZixDQUFmO0FBRUEsTUFBRSxNQUFGLEVBQVUsTUFBVixDQUFpQixLQUFLLE9BQXRCO0FBQ0Q7Ozs7eUJBRUssRSxFQUFJLEMsRUFDVjtBQUNFLFVBQUksTUFBTSxFQUFFLEVBQUYsQ0FBVjtBQUNBLFVBQUksTUFBTSxJQUFJLFFBQUosRUFBVjtBQUNBLFVBQUksUUFBUSxFQUFFLE1BQUYsQ0FBWjtB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QUFJLGFBQWEsTUFBakIsRUFDQTtBQUNFLFVBQUksT0FBSixFQUNBO0FBQ0U7QUFDRDtBQUNELFlBQU0sRUFBRSxJQUFGLENBQU47QUFDQTtBQUNEOztBQUVELFFBQUksT0FBSixFQUNBO0FBQ0U7QUFDRDs7QUFFRCxVQUFNLEVBQUUsSUFBRixDQUFOO0FBQ0Q7QUFDRiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQge01hcmtlcn0gZnJvbSAnLi9tYXJrZXIuanMnO1xubW9kdWxlLmV4cG9ydHMgPSBNYXJrZXI7XG4iLCJleHBvcnQgY2xhc3MgTWFnbmlmaWVyXG57XG4gIGNvbnN0cnVjdG9yIChtYXJrZXIpXG4gIHtcbiAgICB0aGlzLm1hcmtlciAgPSBtYXJrZXI7XG4gICAgdGhpcy5lbGVtZW50ID0gJCgnPGRpdj4nKS5hZGRDbGFzcygnbWFnbmlmaWVyJyk7XG4gICAgdGhpcy50ZXh0ICAgID0gJCgnPGRpdj4nKS5hZGRDbGFzcygnbWFnbmlmaWVyLXRleHQnKVxuICAgICAgICAgICAgICAgICAgIC5hcHBlbmRUbyh0aGlzLmVsZW1lbnQpO1xuICAgIHRoaXMucG9pbnRlciA9ICQoJzxkaXY+JykuYWRkQ2xhc3MoJ21hZ25pZmllci1wb2ludGVyJylcbiAgICAgICAgICAgICAgICAgICAuYXBwZW5kVG8odGhpcy5lbGVtZW50KTtcbiAgICAkKCdib2R5JykuYXBwZW5kKHRoaXMuZWxlbWVudCk7XG4gIH1cblxuICBzaG93IChlbCwgeClcbiAge1xuICAgIGxldCAkZWwgPSAkKGVsKTtcbiAgICBsZXQgcG9zID0gJGVsLnBvc2l0aW9uKCk7XG4gICAgbGV0ICRib2R5ID0gJCgnYm9keScpO1xuICAgIGxldCBib2R5V2lkdGggPSAkYm9keS53aWR0aCgpO1xuICAgIGxldCBib2R5T3V0ZXJXaWR0aCA9ICRib2R5Lm91dGVyV2lkdGgoKTtcbiAgICBsZXQgYm9keVBvcyA9ICRib2R5LnBvc2l0aW9uKCk7XG4gICAgeCA9IHggKyAod2luZG93LnNjcm9sbFggfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQpO1xuICAgIHggPSB4IC0gKGJvZHlPdXRlcldpZHRoIC0gYm9keVdpZHRoKS8yO1xuICAgIHRoaXMudGV4dC5odG1sKCRlbC5odG1sKCkpO1xuXG4gICAgdGhpcy5lbGVtZW50LmF0dHIoJ2RhdGEtbWFyaycsIHRoaXMubWFya2VyLmNvbG9yKTtcbiAgICB0aGlzLmVsZW1lbnQuYXR0cignZGF0YS1tYXJrLWZpcnN0JywgJGVsLmlzKCc6Zmlyc3QtY2hpbGQnKSk7XG4gICAgdGhpcy5lbGVtZW50LmF0dHIoJ2RhdGEtbWFyay1sYXN0JywgJGVsLmlzKCc6bGFzdC1jaGlsZCcpKTtcblxuICAgIGxldCBtYWdXaWR0aCA9IHRoaXMuZWxlbWVudC5vdXRlcldpZHRoKCk7XG4gICAgbGV0IGxlZnRPZmZzZXQgPSBNYXRoLm1pbihNYXRoLm1heCgoeCAtIG1hZ1dpZHRoLzIpLCAwIC0gYm9keVBvcy5sZWZ0KSwgYm9keU91dGVyV2lkdGggKyBib2R5UG9zLmxlZnQgLSBtYWdXaWR0aCk7XG4gICAgbGVmdE9mZnNldCA9IE1hdGgubWF4KE1hdGgubWluKHBvcy5sZWZ0ICsgJGVsLndpZHRoKCkgLSBtYWdXaWR0aC8yLCBsZWZ0T2Zmc2V0KSwgcG9zLmxlZnQgLSBtYWdXaWR0aC8yKTtcbiAgICBsZXQgdG9wT2Zmc2V0ID0gcG9zLnRvcCAtIHRoaXMuZWxlbWVudC5oZWlnaHQoKTtcblxuICAgIHRoaXMuZWxlbWVudC5jc3Moe1xuICAgICAgbGVmdDogbGVmdE9mZnNldCxcbiAgICAgIHRvcDogdG9wT2Zmc2V0LFxuICAgIH0pO1xuXG4gICAgdGhpcy5wb2ludGVyLmNzcyh7XG4gICAgICBsZWZ0OiBNYXRoLm1pbihNYXRoLm1heCh4IC0gbGVmdE9mZnNldCwgMjApLCB0aGlzLmVsZW1lbnQub3V0ZXJXaWR0aCgpIC0gMjIsICgkZWwud2lkdGgoKSArIHBvcy5sZWZ0KSAtIGxlZnRPZmZzZXQpLFxuICAgIH0pO1xuXG4gICAgdGhpcy5lbGVtZW50LmFkZENsYXNzKCdzaG93Jyk7XG4gIH1cblxuICBoaWRlICgpXG4gIHtcbiAgICB0aGlzLmVsZW1lbnQucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcbiAgfVxufVxuIiwiaW1wb3J0IHtcbiAgZ2V0Q29vcmRzLFxuICBnZXRDbG9zZXN0RWxlbWVudCxcbiAgZ2V0RWxlbWVudEluTGluZSxcbiAgZ2V0RWxlbWVudEluU3ByYXksXG4gIHdhbGtFbGVtZW50c1xufSBmcm9tICcuL3V0aWxzJztcblxuaW1wb3J0IHtNYWduaWZpZXJ9IGZyb20gJy4vbWFnbmlmaWVyLmpzJztcbmltcG9ydCB7U3R5bGVyfSBmcm9tICcuL3N0eWxlci5qcyc7XG5pbXBvcnQge1RvdWNoaG9sZH0gZnJvbSAnLi90b3VjaGhvbGQuanMnO1xuXG5leHBvcnQgY2xhc3MgTWFya2VyXG57XG4gIGNvbnN0cnVjdG9yIChlbCwge1xuICAgIGNvbG9ycz17MDogJyNmMmYyZjInLCAxOiAnIzhhZjU4YScsIDI6ICcjZmY4MDgwJ30sXG4gIH09e30pXG4gIHtcbiAgICAkKGVsKS5hZGRDbGFzcygnbWFya2VyJyk7XG4gICAgJChlbCkuYXR0cignZGF0YS1pcy1oaWdobGlnaHRpbmcnLCBmYWxzZSk7XG4gICAgdGhpcy5lbCA9ICQoZWwpO1xuICAgIHRoaXMuY29sb3JzID0gY29sb3JzO1xuICAgIHRoaXMuY29sb3IgPSAwO1xuICAgIHRoaXMuY3VycmVudEhNYXJrID0gbnVsbDtcbiAgICB0aGlzLnN0YXJ0ID0gbnVsbDtcbiAgICB0aGlzLnN0YXJ0WCA9IG51bGw7XG4gICAgdGhpcy5zdGFydFkgPSBudWxsO1xuICAgIHRoaXMuZW5kID0gbnVsbDtcbiAgICB0aGlzLmVuZFggPSBudWxsO1xuICAgIHRoaXMuZW5kWSA9IG51bGw7XG4gICAgdGhpcy5pc0hlbGQgPSBmYWxzZTtcbiAgICB0aGlzLnRvdWNoaG9sZCA9IG5ldyBUb3VjaGhvbGQoJ2JvZHknKTtcbiAgICB0aGlzLm1hZ25pZmllciA9IG5ldyBNYWduaWZpZXIodGhpcyk7XG4gICAgdGhpcy5zdHlsZXIgPSBuZXcgU3R5bGVyKCk7XG4gICAgdGhpcy5lbWJlZFN0eWxlcygpO1xuICAgIHRoaXMud3JhcFdvcmRzKCk7XG4gICAgdGhpcy5yZWdpc3RlckV2ZW50cygpO1xuICB9XG5cbiAgZW1iZWRTdHlsZXMgKClcbiAge1xuICAgIGZvciAobGV0IGtleSBpbiB0aGlzLmNvbG9ycykge1xuICAgICAgdGhpcy5zdHlsZXIuc2V0KHtcbiAgICAgICAgJy5tYXJrZXInOiB7XG4gICAgICAgICAgW2BbZGF0YS1tYXJrPVwiJHtrZXl9XCJdYF06IHtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IHRoaXMuY29sb3JzW2tleV0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBbYCZbZGF0YS1pcy1oaWdobGlnaHRpbmc9XCJmYWxzZVwiXVtkYXRhLWlzLXRvdWNoaW5nPVwiZmFsc2VcIl1bZGF0YS1tYXJrPVwiJHtrZXl9XCJdXG4gICAgICAgICAgLm1hcmstd29yZDpob3ZlcmBdOiB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiB0aGlzLmNvbG9yc1trZXldLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIFtgLm1hZ25pZmllcltkYXRhLW1hcms9XCIke2tleX1cIl0gLm1hZ25pZmllci10ZXh0YF06IHtcbiAgICAgICAgICBiYWNrZ3JvdW5kOiB0aGlzLmNvbG9yc1trZXldLFxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICB3cmFwV29yZHMgKClcbiAge1xuICAgIGxldCAkZWxzID0gJCh0aGlzLmVsKS5maW5kKCcqJyk7XG4gICAgbGV0ICRlbDtcblxuICAgIHdhbGtFbGVtZW50cygkZWxzWzBdLCAkZWxzLmxhc3QoKVswXSwgdHJ1ZSwgKGVsLCBkaXIpID0+IHtcbiAgICAgIGlmIChlbC5ub2RlVHlwZSA9PSAzKSB7XG4gICAgICAgIGxldCB3b3JkcyA9IGVsLnRleHRDb250ZW50LnNwbGl0KC9cXHMrLyk7XG4gICAgICAgIGxldCB3cmFwcGVkID0gW107XG4gICAgICAgIGxldCAkbmV3RWwgPSBlbDtcblxuICAgICAgICBmb3IgKGxldCB3b3JkIG9mIHdvcmRzKVxuICAgICAgICB7XG4gICAgICAgICAgaWYgKHdvcmQubGVuZ3RoKVxuICAgICAgICAgIHtcbiAgICAgICAgICAgICRuZXdFbCA9ICQoYDxzcGFuIGNsYXNzPVwibWFyay13b3JkXCI+JHt3b3JkfTwvc3Bhbj5gKTtcbiAgICAgICAgICAgIHdyYXBwZWQucHVzaCgkbmV3RWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgkbmV3RWwgIT09IGVsKVxuICAgICAgICB7XG4gICAgICAgICAgJChlbCkucmVwbGFjZVdpdGgod3JhcHBlZCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gJG5ld0VsO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoKCRlbCA9ICQoZWwpKS5pcygnOmVtcHR5JykgJiYgISRlbC5pcygnYnIsaHInKSlcbiAgICAgIHtcbiAgICAgICAgcmV0dXJuICRlbC53cmFwKCQoJzxzcGFuIGNsYXNzPVwibWFyay13b3JkIG1hcmstYXRvbVwiPicpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGhpZ2hsaWdodFdvcmRzICgkd29yZHMpXG4gIHtcbiAgICBsZXQgZmlyc3QgPSAkd29yZHNbMF07XG4gICAgbGV0ICR3cmFwcGVyID0gJChgPHNwYW4gZGF0YS1tYXJrPVwiJHt0aGlzLmNvbG9yfVwiLz5gKTtcbiAgICAkKGZpcnN0KS5iZWZvcmUoJHdyYXBwZXIpO1xuICAgICR3cmFwcGVyLmFwcGVuZCgkd29yZHMpO1xuICAgIHRoaXMuY3VycmVudE1hcmsgPSAodGhpcy5jdXJyZW50TWFyayB8fCAkKCkpLmFkZCgkd3JhcHBlcik7XG4gICAgcmV0dXJuICR3cmFwcGVyO1xuICB9XG5cbiAgc3RhcnRIaWdobGlnaHQgKGZyb20pXG4gIHtcbiAgICAkKHRoaXMuZWwpLmF0dHIoJ2RhdGEtaXMtaGlnaGxpZ2h0aW5nJywgdHJ1ZSk7XG4gICAgdGhpcy5zdGFydCA9IGZyb207XG4gICAgdGhpcy5lbmQgPSBmcm9tO1xuICAgIHRoaXMuY3VycmVudE1hcmsgPSAkKCk7XG4gICAgdGhpcy5oaWdobGlnaHQoZnJvbSwgZnJvbSk7XG4gIH1cblxuICBjYW5jZWxIaWdobGlnaHQgKClcbiAge1xuICAgICQodGhpcy5lbCkuYXR0cignZGF0YS1pcy1oaWdobGlnaHRpbmcnLCBmYWxzZSk7XG4gICAgdGhpcy5zdGFydCA9IG51bGw7XG4gICAgdGhpcy5lbmQgPSBudWxsO1xuICAgIHRoaXMuY3VycmVudE1hcmsgPSBudWxsO1xuICB9XG5cbiAgbW92ZUhpZ2hsaWdodCAodG8pXG4gIHtcbiAgICB0aGlzLmhpZ2hsaWdodCh0aGlzLnN0YXJ0LCB0aGlzLmVuZCA9IHRvKTtcbiAgfVxuXG4gIGVuZEhpZ2hsaWdodCAoKVxuICB7XG4gICAgJCh0aGlzLmVsKS5hdHRyKCdkYXRhLWlzLWhpZ2hsaWdodGluZycsIGZhbHNlKTtcbiAgICB0aGlzLnN0YXJ0ID0gbnVsbDtcbiAgICB0aGlzLmN1cnJlbnRNYXJrID0gbnVsbDtcbiAgICB0aGlzLm5vcm1hbGl6ZUhpZ2hsaWdodHMoKTtcbiAgfVxuXG4gIGhpZ2hsaWdodCAoZnJvbSwgdG8pXG4gIHtcbiAgICBpZiAodGhpcy5jdXJyZW50TWFyaylcbiAgICB7XG4gICAgICB0aGlzLnJlbW92ZUhpZ2hsaWdodCh0aGlzLmN1cnJlbnRNYXJrKTtcbiAgICAgIHRoaXMuY3VycmVudE1hcmsgPSAkKCk7XG4gICAgfVxuXG4gICAgbGV0ICRlbHMgPSAkKCk7XG4gICAgd2Fsa0VsZW1lbnRzKGZyb20sIHRvLCBmYWxzZSwgKGVsLCBkaXIpID0+IHtcbiAgICAgIGlmIChkaXIgJiYgJGVscy5sZW5ndGgpXG4gICAgICB7XG4gICAgICAgIGxldCB3cmFwcGVyID0gdGhpcy5oaWdobGlnaHRXb3JkcygkZWxzKVswXTtcbiAgICAgICAgJGVscyA9ICQoKTtcbiAgICAgICAgcmV0dXJuIHdyYXBwZXI7XG4gICAgICB9XG5cbiAgICAgIGlmICgkKGVsKS5pcygnLm1hcmstd29yZCcpKVxuICAgICAge1xuICAgICAgICAkZWxzID0gJGVscy5hZGQoZWwpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKCRlbHMubGVuZ3RoKSB7XG4gICAgICB0aGlzLmhpZ2hsaWdodFdvcmRzKCRlbHMpO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZUhpZ2hsaWdodCAoJG1hcmspXG4gIHtcbiAgICAkbWFyay5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIGxldCAkdGhpcyA9ICQodGhpcyk7XG4gICAgICAkdGhpcy5yZXBsYWNlV2l0aCgkdGhpcy5jb250ZW50cygpKTtcbiAgICB9KTtcbiAgfVxuXG4gIGNsZWFySGlnaGxpZ2h0cyAoKVxuICB7XG4gICAgJCh0aGlzLmVsKS5maW5kKCdbZGF0YS1tYXJrXScpLm5vdCh0aGlzKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICQodGhpcykucmVwbGFjZVdpdGgoJCh0aGlzKS5jb250ZW50cygpKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5vcm1hbGl6ZUhpZ2hsaWdodHMgKClcbiAge1xuICAgIC8vIEVtcHR5XG4gICAgJCh0aGlzLmVsKS5maW5kKCdbZGF0YS1tYXJrXScpLm5vdCh0aGlzKS5maWx0ZXIoJzplbXB0eScpLnJlbW92ZSgpO1xuXG4gICAgLy8gTmVzdGVkXG4gICAgJCh0aGlzLmVsKS5maW5kKCdbZGF0YS1tYXJrXScpLm5vdCh0aGlzKS5jaGlsZHJlbignW2RhdGEtbWFya10nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIGxldCAkdGhpcyA9ICQodGhpcyk7XG4gICAgICBsZXQgJHBhcmVudCA9ICR0aGlzLnBhcmVudCgpO1xuXG4gICAgICBpZiAoJHRoaXMuYXR0cignZGF0YS1tYXJrJykgPT0gJHBhcmVudC5hdHRyKCdkYXRhLW1hcmsnKSlcbiAgICAgIHtcbiAgICAgICAgJHRoaXMucmVwbGFjZVdpdGgoJHRoaXMuY29udGVudHMoKSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgbGV0ICRsZWZ0V29yZHMgPSAkcGFyZW50LmNoaWxkcmVuKCkuZmlyc3QoKS5uZXh0VW50aWwodGhpcykuYWRkQmFjaygpO1xuICAgICAgbGV0ICRyaWdodFdvcmRzID0gJHRoaXMubmV4dEFsbCgpO1xuXG4gICAgICBpZiAoJGxlZnRXb3Jkcy5sZW5ndGgpXG4gICAgICB7XG4gICAgICAgICRwYXJlbnQuYmVmb3JlKCQoJHBhcmVudFswXS5jbG9uZU5vZGUoKSkuYXBwZW5kKCRsZWZ0V29yZHMpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCRyaWdodFdvcmRzLmxlbmd0aClcbiAgICAgIHtcbiAgICAgICAgJHBhcmVudC5hZnRlcigkKCRwYXJlbnRbMF0uY2xvbmVOb2RlKCkpLmFwcGVuZCgkcmlnaHRXb3JkcykpO1xuICAgICAgfVxuXG4gICAgICAkcGFyZW50LnJlcGxhY2VXaXRoKCR0aGlzKTtcbiAgICB9KTtcblxuICAgIC8vIEVyYXNlZFxuICAgICQodGhpcy5lbCkuZmluZCgnW2RhdGEtbWFyaz1cIjBcIl0nKS5ub3QodGhpcykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICBsZXQgJHRoaXMgPSAkKHRoaXMpO1xuICAgICAgJHRoaXMucmVwbGFjZVdpdGgoJHRoaXMuY29udGVudHMoKSk7XG4gICAgfSk7XG5cbiAgICAvLyBFbXB0eS4uLiBhZ2FpblxuICAgICQodGhpcy5lbCkuZmluZCgnW2RhdGEtbWFya10nKS5ub3QodGhpcykuZmlsdGVyKCc6ZW1wdHknKS5yZW1vdmUoKTtcblxuICAgIC8vIEFkamFjZW50XG4gICAgJCh0aGlzLmVsKS5maW5kKCdbZGF0YS1tYXJrXScpLm5vdCh0aGlzKS5uZXh0KCdbZGF0YS1tYXJrXScpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgbGV0ICR0aGlzID0gJCh0aGlzKTtcbiAgICAgIGxldCAkcHJldiA9ICR0aGlzLnByZXYoKTtcblxuICAgICAgaWYgKCR0aGlzLmF0dHIoJ2RhdGEtbWFyaycpID09ICRwcmV2LmF0dHIoJ2RhdGEtbWFyaycpKVxuICAgICAge1xuICAgICAgICAkcHJldi5hcHBlbmQoJHRoaXMuY29udGVudHMoKSk7XG4gICAgICAgICR0aGlzLnJlbW92ZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc2V0Q29sb3IgKGNvbG9yKVxuICB7XG4gICAgdGhpcy5jb2xvciA9IGNvbG9yO1xuICAgICQodGhpcy5lbCkuYXR0cignZGF0YS1tYXJrJywgY29sb3IpO1xuICB9XG5cbiAgcmVnaXN0ZXJFdmVudHMgKClcbiAge1xuICAgICQoJ2JvZHknKS5vbigndG91Y2hob2xkIG1vdXNlZG93bicsIChlKSA9PiB0aGlzLnN0YXJ0RXZlbnQoZSkpXG4gICAgICAgICAgICAgLm9uKCd0b3VjaG1vdmUgbW91c2Vtb3ZlJywgKGUpID0+IHRoaXMubW92ZUV2ZW50KGUpKVxuICAgICAgICAgICAgIC5vbigndG91Y2hlbmQgdG91Y2hjYW5jZWwgbW91c2V1cCcsIChlKSA9PiB0aGlzLmVuZEV2ZW50KGUpKVxuICAgICAgICAgICAgIDtcblxuICAgIHRoaXMuZWwuZmluZCgnLm1hcmstd29yZCcpLm9uKCdjbGljaycsIChlKSA9PiB0aGlzLmNsaWNrRXZlbnQoZSkpO1xuXG4gICAgdGhpcy50b3VjaHN3YXAoKTtcbiAgfVxuXG4gIHN0YXJ0RXZlbnQgKGUpXG4gIHtcbiAgICBpZiAoZS50eXBlID09ICdtb3VzZWRvd24nICYmIGUud2hpY2ggIT0gMSkgcmV0dXJuO1xuICAgIGlmICgkKHRoaXMuZWwpLmhhcyhlLnRhcmdldCkubGVuZ3RoID09IDApIHJldHVybjtcbiAgICBpZiAoZS50eXBlID09ICd0b3VjaGhvbGQnKVxuICAgIHtcbiAgICAgIHRoaXMuaXNIZWxkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBsZXQge3gsIHl9ID0gZ2V0Q29vcmRzKGUpO1xuICAgIGxldCBlbCA9IGdldENsb3Nlc3RFbGVtZW50KHgsIHksICcubWFyay13b3JkJyk7XG5cbiAgICBpZiAoZWwpXG4gICAge1xuICAgICAgdGhpcy5zdGFydEhpZ2hsaWdodChlbCk7XG5cbiAgICAgIGlmICh0aGlzLmlzSGVsZClcbiAgICAgIHtcbiAgICAgICAgdGhpcy5tYWduaWZpZXIuc2hvdyhlbCwgeCk7XG4gICAgICB9XG4gICAgICB0aGlzLnN0YXJ0WCA9IHg7XG4gICAgICB0aGlzLnN0YXJ0WSA9IHk7XG4gICAgICB0aGlzLmVuZFggPSB4O1xuICAgICAgdGhpcy5lbmRZID0geTtcbiAgICB9XG4gIH1cblxuICBtb3ZlRXZlbnQgKGUpXG4gIHtcbiAgICBpZiAodGhpcy5zdGFydClcbiAgICB7XG4gICAgICBpZiAoZS50eXBlID09ICd0b3VjaG1vdmUnICYmICF0aGlzLmlzSGVsZCkge1xuICAgICAgICB0aGlzLmNhbmNlbEhpZ2hsaWdodCgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIGxldCB7eCwgeX0gPSBnZXRDb29yZHMoZSk7XG4gICAgICBsZXQgZWwgPSBnZXRDbG9zZXN0RWxlbWVudCh4LCB5LCAnLm1hcmstd29yZCcsIDE2LCA2KTtcbiAgICAgIGlmICghZWwpXG4gICAgICB7XG4gICAgICAgIC8vIGVsID0gZ2V0RWxlbWVudEluTGluZSh4LCB5LCB0aGlzLnN0YXJ0WCwgdGhpcy5zdGFydFksICcubWFyay13b3JkJyk7XG4gICAgICAgIGVsID0gZ2V0RWxlbWVudEluU3ByYXkoeCwgeSwgdGhpcy5zdGFydFgsIHRoaXMuc3RhcnRZLCAnLm1hcmstd29yZCcpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZWwpXG4gICAgICB7XG4gICAgICAgIHRoaXMubW92ZUhpZ2hsaWdodChlbCk7XG5cbiAgICAgICAgaWYgKHRoaXMuaXNIZWxkKVxuICAgICAgICB7XG4gICAgICAgICAgdGhpcy5tYWduaWZpZXIuc2hvdyhlbCwgeCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbmRYID0geDtcbiAgICAgICAgdGhpcy5lbmRZID0geTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBlbmRFdmVudCAoZSlcbiAge1xuICAgIHRoaXMuZW5kSGlnaGxpZ2h0KCk7XG4gICAgdGhpcy5tYWduaWZpZXIuaGlkZSgpO1xuICAgIHRoaXMuaXNIZWxkID0gZmFsc2U7XG4gIH1cblxuICBjbGlja0V2ZW50IChlKVxuICB7XG4gICAgdGhpcy5oaWdobGlnaHQoZS50YXJnZXQsIGUudGFyZ2V0KTtcbiAgfVxuXG4gIHRvdWNoc3dhcCAoKVxuICB7XG4gICAgdGhpcy5lbC5hdHRyKCdkYXRhLWlzLXRvdWNoaW5nJywgZmFsc2UpO1xuICAgICQod2luZG93KS5vbigndG91Y2hzdGFydCB0b3VjaGVuZCcsICgpID0+IHtcbiAgICAgIHRoaXMuZWwuYXR0cignZGF0YS1pcy10b3VjaGluZycsIHRydWUpO1xuICAgIH0pO1xuICB9XG59XG5cbiIsImV4cG9ydCBjbGFzcyBTdHlsZXJcbntcbiAgY29uc3RydWN0b3IgKHJ1bGVzPXt9KVxuICB7XG4gICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAkKCdib2R5JykuYXBwZW5kKHRoaXMuZWxlbWVudCk7XG4gICAgdGhpcy5zaGVldCA9IHRoaXMuZWxlbWVudC5zaGVldDtcbiAgICB0aGlzLnJ1bGVzID0ge307XG4gICAgdGhpcy5zZXQocnVsZXMpO1xuICB9XG5cbiAgc2V0IChzZWwsIHByb3BzKVxuICB7XG4gICAgaWYgKHNlbCAmJiB0eXBlb2Ygc2VsID09PSAnb2JqZWN0JylcbiAgICB7XG4gICAgICBsZXQgcnVsZXMgPSBzZWw7XG4gICAgICBmb3IgKGxldCBzZWwgaW4gcnVsZXMpXG4gICAgICB7XG4gICAgICAgIHRoaXMuc2V0KHNlbCwgcnVsZXNbc2VsXSk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgc2VsID0gc2VsLnJlcGxhY2UoL1xccysvZywgJyAnKTtcbiAgICBsZXQgcnVsZSA9IHRoaXMucnVsZXNbc2VsXTtcbiAgICBpZiAocnVsZSlcbiAgICB7XG4gICAgICBmb3IgKGxldCBrZXkgaW4gcHJvcHMpXG4gICAgICB7XG4gICAgICAgIGlmIChwcm9wc1trZXldICYmIHR5cGVvZiBwcm9wc1trZXldID09PSAnb2JqZWN0JylcbiAgICAgICAge1xuICAgICAgICAgIHRoaXMuc2V0KHRoaXMuam9pblNlbGVjdG9ycyhzZWwsIGtleSwgcHJvcHNba2V5XSkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgIHJ1bGUuc3R5bGVba2V5XSA9IHByb3BzW2tleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgIGxldCBzdHlsZVN0ciA9ICcnO1xuICAgICAgZm9yIChsZXQga2V5IGluIHByb3BzKVxuICAgICAge1xuICAgICAgICBpZiAocHJvcHNba2V5XSAmJiB0eXBlb2YgcHJvcHNba2V5XSA9PT0gJ29iamVjdCcpXG4gICAgICAgIHtcbiAgICAgICAgICB0aGlzLnNldCh0aGlzLmpvaW5TZWxlY3RvcnMoc2VsLCBrZXkpLCBwcm9wc1trZXldKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICBzdHlsZVN0ciArPSBgJHtrZXl9OiR7cHJvcHNba2V5XX07YDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHN0eWxlU3RyLmxlbmd0aClcbiAgICAgIHtcbiAgICAgICAgdGhpcy5ydWxlc1tzZWxdID0gdGhpcy5zaGVldC5jc3NSdWxlc1tcbiAgICAgICAgICB0aGlzLnNoZWV0Lmluc2VydFJ1bGUoYCR7c2VsfXske3N0eWxlU3RyfX1gLCB0aGlzLnNoZWV0LmNzc1J1bGVzLmxlbmd0aClcbiAgICAgICAgXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBqb2luU2VsZWN0b3JzIChwYXJlbnQsIGNoaWxkKVxuICB7XG4gICAgaWYgKC8mLy50ZXN0KGNoaWxkKSlcbiAgICB7XG4gICAgICByZXR1cm4gY2hpbGQucmVwbGFjZSgvJi9nLCBwYXJlbnQpO1xuICAgIH1cbiAgICByZXR1cm4gYCR7cGFyZW50fSAke2NoaWxkfWA7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBUb3VjaGhvbGQge1xuICBjb25zdHJ1Y3RvciAoZWwsIHtcbiAgICBtcyA9IDM3NSxcbiAgICBkaXN0YW5jZSA9IDEwLFxuICB9PXt9KVxuICB7XG4gICAgdGhpcy5lbCA9IGVsO1xuICAgIHRoaXMubXMgPSBtcztcbiAgICB0aGlzLmRpc3RhbmNlID0gZGlzdGFuY2U7XG4gICAgdGhpcy5kaXN0YW5jZVNxID0gZGlzdGFuY2UgKiBkaXN0YW5jZTtcbiAgICB0aGlzLnN0YXJ0WCA9IG51bGw7XG4gICAgdGhpcy5zdGFydFkgPSBudWxsO1xuICAgIHRoaXMuc3RhcnRTY3JvbGxYID0gbnVsbDtcbiAgICB0aGlzLnN0YXJ0U2Nyb2xsWSA9IG51bGw7XG4gICAgdGhpcy50aW1lciA9IG51bGw7XG5cbiAgICB0aGlzLnRvdWNoZG93bigpO1xuICAgIHRoaXMudG91Y2htb3ZlKCk7XG4gICAgdGhpcy50b3VjaGVuZCgpO1xuICB9XG5cbiAgdG91Y2hkb3duICgpXG4gIHtcbiAgICAkKCdib2R5Jykub24oJ3RvdWNoc3RhcnQgbW91c2Vkb3duJywgKGUpID0+IHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVyKTtcbiAgICAgIGxldCBkYXRhO1xuICAgICAgaWYgKGUudG91Y2hlcylcbiAgICAgIHtcbiAgICAgICAgaWYgKGUudG91Y2hlcy5sZW5ndGggPiAxKVxuICAgICAgICB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGRhdGEgPSBlLnRvdWNoZXNbMF07XG4gICAgICB9XG4gICAgICBlbHNlXG4gICAgICB7XG4gICAgICAgIGlmIChlLndoaWNoICE9IDEpIHJldHVybjtcbiAgICAgICAgZGF0YSA9IGU7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc3RhcnRYID0gZGF0YS5jbGllbnRYO1xuICAgICAgdGhpcy5zdGFydFkgPSBkYXRhLmNsaWVudFk7XG4gICAgICB0aGlzLnN0YXJ0U2Nyb2xsWCA9IHdpbmRvdy5zY3JvbGxYIHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0O1xuICAgICAgdGhpcy5zdGFydFNjcm9sbFkgPSB3aW5kb3cuc2Nyb2xsWSB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wO1xuICAgICAgdGhpcy50aW1lciA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5lbWl0VG91Y2hob2xkKGUpLCB0aGlzLm1zKTtcbiAgICB9KTtcbiAgfVxuXG4gIHRvdWNobW92ZSAoKVxuICB7XG4gICAgJChkb2N1bWVudCkub24oJ3RvdWNobW92ZSBtb3VzZW1vdmUnLCAoZSkgPT4ge1xuICAgICAgbGV0IGRhdGE7XG4gICAgICBpZiAoZS50b3VjaGVzKVxuICAgICAge1xuICAgICAgICBpZiAoZS50b3VjaGVzLmxlbmd0aCA+IDEpXG4gICAgICAgIHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lcik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGRhdGEgPSBlLnRvdWNoZXNbMF07XG4gICAgICB9XG4gICAgICBlbHNlXG4gICAgICB7XG4gICAgICAgIGRhdGEgPSBlO1xuICAgICAgfVxuXG4gICAgICBsZXQge2NsaWVudFg6IHgsIGNsaWVudFk6IHl9ID0gZGF0YTtcbiAgICAgIGxldCBkeCA9IHggLSB0aGlzLnN0YXJ0WDtcbiAgICAgIGxldCBkeSA9IHkgLSB0aGlzLnN0YXJ0WTtcbiAgICAgIGxldCBkaXN0YW5jZVNxID0gZHgqZHggKyBkeSpkeTtcbiAgICAgIGlmIChkaXN0YW5jZVNxID4gdGhpcy5kaXN0YW5jZVNxKVxuICAgICAge1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lcik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICB0b3VjaGVuZCAoKVxuICB7XG4gICAgJChkb2N1bWVudCkub24oJ3RvdWNoZW5kIHRvdWNoY2FuY2VsIG1vdXNldXAnLCAoZSkgPT4ge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZXIpO1xuICAgIH0pO1xuICB9XG5cbiAgZW1pdFRvdWNoaG9sZCAoZSlcbiAge1xuICAgIGUudHlwZSA9ICd0b3VjaGhvbGQnO1xuICAgICQodGhpcy5lbCkudHJpZ2dlcihlKTtcbiAgfVxufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGdldENsb3Nlc3RFbGVtZW50ICh4LCB5LCBzZWwsIHJhZGl1cz0xNiwgcG9pbnRzPTkpXG57XG4gIC8vIHRyeSBjZW50ZXJcbiAgbGV0IGVsID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludCh4LCB5KTtcbiAgaWYgKGVsICYmICghc2VsIHx8ICQoZWwpLmlzKHNlbCkpKVxuICB7XG4gICAgcmV0dXJuIGVsO1xuICB9XG5cbiAgLy8gdHJ5IGNpcmNsZSBhcm91bmRcbiAgbGV0IGFuZ2xlID0gKE1hdGguUEkgKiAyKSAvIHBvaW50cztcbiAgbGV0IHhyO1xuICBsZXQgeXI7XG4gIGZvciAobGV0IGk9MDsgaTxwb2ludHM7IGkrKylcbiAge1xuICAgIHhyID0gTWF0aC5jb3MoYW5nbGUgKiBpKTtcbiAgICB5ciA9IE1hdGguc2luKGFuZ2xlICogaSk7XG4gICAgZWwgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KHggKyB4cipyYWRpdXMsIHkgKyB5cipyYWRpdXMpO1xuICAgIGlmIChlbCAmJiAoIXNlbCB8fCAkKGVsKS5pcyhzZWwpKSlcbiAgICB7XG4gICAgICByZXR1cm4gZWw7XG4gICAgfVxuICB9XG59XG5cbiIsImV4cG9ydCBmdW5jdGlvbiBnZXRDb29yZHMgKGUpXG57XG4gIGxldCB4LCB5O1xuICBpZiAoZS50b3VjaGVzKVxuICB7XG4gICAgbGV0IHRvdWNoID0gZS50b3VjaGVzWzBdO1xuICAgIHggPSB0b3VjaC5jbGllbnRYO1xuICAgIHkgPSB0b3VjaC5jbGllbnRZO1xuICB9XG4gIGVsc2VcbiAge1xuICAgIHggPSBlLmNsaWVudFg7XG4gICAgeSA9IGUuY2xpZW50WTtcbiAgfVxuICByZXR1cm4ge3gsIHl9O1xufVxuXG4iLCJleHBvcnQgZnVuY3Rpb24gZ2V0RWxlbWVudEluTGluZSAoZngsIGZ5LCB0eCwgdHksIHNlbCwgc3RlcD0xNilcbntcbiAgbGV0IGR4ID0gdHggLSBmeDtcbiAgbGV0IGR5ID0gdHkgLSBmeTtcbiAgbGV0IG1hZ25pdHVkZSA9IE1hdGguc3FydChkeCpkeCArIGR5KmR5KTtcbiAgbGV0IG54ID0gZHggLyBtYWduaXR1ZGU7XG4gIGxldCBueSA9IGR5IC8gbWFnbml0dWRlO1xuICBsZXQgc3ggPSBueCAqIHN0ZXA7XG4gIGxldCBzeSA9IG55ICogc3RlcDtcblxuICAvLyB0cnkgY2VudGVyXG4gIGxldCBlbCA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoZngsIGZ5KTtcbiAgaWYgKGVsICYmICghc2VsIHx8ICQoZWwpLmlzKHNlbCkpKVxuICB7XG4gICAgcmV0dXJuIGVsO1xuICB9XG5cbiAgLy8gdHJ5IGFsb25nIGxpbmVcbiAgZm9yIChsZXQgaT0wLCBpaT1tYWduaXR1ZGUvc3RlcDsgaTxpaTsgaSsrKVxuICB7XG4gICAgZWwgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGZ4ICsgc3gqaSwgZnkgKyBzeSppKTtcbiAgICBpZiAoZWwgJiYgKCFzZWwgfHwgJChlbCkuaXMoc2VsKSkpXG4gICAge1xuICAgICAgcmV0dXJuIGVsO1xuICAgIH1cbiAgfVxufVxuXG4iLCJleHBvcnQgZnVuY3Rpb24gZ2V0RWxlbWVudEluU3ByYXkgKGZ4LCBmeSwgdHgsIHR5LCBzZWwsIHN0ZXA9MTYsIGFuZ2xlPU1hdGguUEkvNiwgcG9pbnRzPTMpXG57XG4gIGxldCBkeCA9IHR4IC0gZng7XG4gIGxldCBkeSA9IHR5IC0gZnk7XG4gIGxldCBtYWduaXR1ZGUgPSBNYXRoLnNxcnQoZHgqZHggKyBkeSpkeSk7XG4gIGxldCBueCA9IGR4IC8gbWFnbml0dWRlO1xuICBsZXQgbnkgPSBkeSAvIG1hZ25pdHVkZTtcbiAgbGV0IHN4ID0gbnggKiBzdGVwO1xuICBsZXQgc3kgPSBueSAqIHN0ZXA7XG4gIGxldCBzcHJheUFuZ2xlID0gTWF0aC5hdGFuMihueS9ueCk7XG4gIGxldCBzdGFydEFuZ2xlID0gc3ByYXlBbmdsZSAtIChhbmdsZSpwb2ludHMvMik7XG5cbiAgLy8gdHJ5IGNlbnRlclxuICBsZXQgZWwgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGZ4LCBmeSk7XG4gIGlmIChlbCAmJiAoIXNlbCB8fCAkKGVsKS5pcyhzZWwpKSlcbiAge1xuICAgIHJldHVybiBlbDtcbiAgfVxuXG4gIC8vIHRyeSBhbG9uZyBzcHJheVxuICBsZXQgeHI7XG4gIGxldCB5cjtcbiAgZm9yIChsZXQgaT0wLCBpaT1tYWduaXR1ZGUvc3RlcDsgaTxpaTsgaSsrKVxuICB7XG4gICAgZm9yIChsZXQgaj0wOyBqPHBvaW50czsgaisrKVxuICAgIHtcbiAgICAgIHhyID0gTWF0aC5jb3Moc3RhcnRBbmdsZSArIGFuZ2xlICogaik7XG4gICAgICB5ciA9IE1hdGguc2luKHN0YXJ0QW5nbGUgKyBhbmdsZSAqIGopO1xuICAgICAgZWwgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGZ4ICsgeHIqc3RlcCppLypzeCppKi8sIGZ5ICsgeXIqc3RlcCppLypzeSppKi8pO1xuICAgICAgaWYgKGVsICYmICghc2VsIHx8ICQoZWwpLmlzKHNlbCkpKVxuICAgICAge1xuICAgICAgICByZXR1cm4gZWw7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbiIsImV4cG9ydCAqIGZyb20gJy4vZ2V0LWNsb3Nlc3QtZWxlbWVudC5qcyc7XG5leHBvcnQgKiBmcm9tICcuL2dldC1jb29yZHMuanMnO1xuZXhwb3J0ICogZnJvbSAnLi9nZXQtZWxlbWVudC1pbi1saW5lLmpzJztcbmV4cG9ydCAqIGZyb20gJy4vZ2V0LWVsZW1lbnQtaW4tc3ByYXkuanMnO1xuZXhwb3J0ICogZnJvbSAnLi93YWxrLWVsZW1lbnRzLmpzJztcbiIsImV4cG9ydCBmdW5jdGlvbiB3YWxrRWxlbWVudHMoZnJvbSwgdG8sIGluY2x1ZGVUZXh0LCBmbilcbntcbiAgLy8gdG8gaXMgYmVmb3JlIGZyb21cbiAgaWYgKGZyb20uY29tcGFyZURvY3VtZW50UG9zaXRpb24odG8pICYgTm9kZS5ET0NVTUVOVF9QT1NJVElPTl9QUkVDRURJTkcpXG4gIHtcbiAgICBsZXQgdG1wID0gZnJvbTtcbiAgICBmcm9tID0gdG87XG4gICAgdG8gPSB0bXA7XG4gIH1cblxuICBjb25zdCBTSUJMSU5HID0gMDtcbiAgY29uc3QgQ0hJTEQgPSAxO1xuICBjb25zdCBQQVJFTlQgPSAtMTtcblxuICBsZXQgJGZyb20gPSAkKGZyb20pO1xuICBsZXQgJHRvID0gJCh0byk7XG5cbiAgbGV0ICRlbCA9ICRmcm9tO1xuICBsZXQgJGNoaWxkcmVuO1xuICBsZXQgbmV4dDtcbiAgbGV0IGRpcmVjdGlvbiA9IFNJQkxJTkc7XG4gIGxldCBuZXdFbDtcbiAgbGV0IGZvdW5kVG8gPSBmYWxzZTtcbiAgbGV0IGNoaWxkcmVuRm4gPSBpbmNsdWRlVGV4dCA/ICdjb250ZW50cycgOiAnY2hpbGRyZW4nO1xuICB3aGlsZSAodHJ1ZSkge1xuICAgIG5ld0VsID0gZm4oJGVsWzBdLCBkaXJlY3Rpb24pO1xuICAgIGRpcmVjdGlvbiA9IFNJQkxJTkc7XG5cbiAgICAvLyBGbiByZXR1cm5lZCBuZXcgZWxcbiAgICBpZiAobmV3RWwpXG4gICAge1xuICAgICAgJGVsID0gJChuZXdFbCk7XG4gICAgfVxuXG4gICAgLy8gRm91bmQgdG9cbiAgICBpZiAoJGVsLmlzKHRvKSlcbiAgICB7XG4gICAgICBmb3VuZFRvID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBGb3VuZCBlbGVtZW50IHdpdGggY2hpbGRyZW5cbiAgICBpZiAoKCRjaGlsZHJlbiA9ICRlbFtjaGlsZHJlbkZuXSgpKS5sZW5ndGggJiYgIW5ld0VsKVxuICAgIHtcbiAgICAgICRlbCA9ICRjaGlsZHJlbi5maXJzdCgpO1xuICAgICAgZGlyZWN0aW9uID0gQ0hJTEQ7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBFbmQgb2YgZWxlbWVudFxuICAgIHdoaWxlICghKG5leHQgPSAkZWxbMF0ubmV4dFNpYmxpbmcpKVxuICAgIHtcbiAgICAgICRlbCA9ICRlbC5wYXJlbnQoKTtcbiAgICAgIGRpcmVjdGlvbiA9IFBBUkVOVDtcbiAgICB9XG4gICAgaWYgKGRpcmVjdGlvbiA9PSBQQVJFTlQpXG4gICAge1xuICAgICAgaWYgKGZvdW5kVG8pXG4gICAgICB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgJGVsID0gJChuZXh0KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChmb3VuZFRvKVxuICAgIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgICRlbCA9ICQobmV4dCk7XG4gIH1cbn1cbiJdfQ==
