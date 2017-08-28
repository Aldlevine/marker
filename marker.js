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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC9qcy9pbmRleC5qcyIsImJ1aWxkL2pzL21hZ25pZmllci5qcyIsImJ1aWxkL2pzL21hcmtlci5qcyIsImJ1aWxkL2pzL3N0eWxlci5qcyIsImJ1aWxkL2pzL3RvdWNoaG9sZC5qcyIsImJ1aWxkL2pzL3V0aWxzL2dldC1jbG9zZXN0LWVsZW1lbnQuanMiLCJidWlsZC9qcy91dGlscy9nZXQtY29vcmRzLmpzIiwiYnVpbGQvanMvdXRpbHMvZ2V0LWVsZW1lbnQtaW4tbGluZS5qcyIsImJ1aWxkL2pzL3V0aWxzL2dldC1lbGVtZW50LWluLXNwcmF5LmpzIiwiYnVpbGQvanMvdXRpbHMvaW5kZXguanMiLCJidWlsZC9qcy91dGlscy93YWxrLWVsZW1lbnRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7QUFDQSxPQUFPLE9BQVA7Ozs7Ozs7Ozs7Ozs7SUNEYSxTLFdBQUEsUztBQUVYLHFCQUFhLE1BQWIsRUFDQTtBQUFBOztBQUNFLFNBQUssTUFBTCxHQUFlLE1BQWY7QUFDQSxTQUFLLE9BQUwsR0FBZSxFQUFFLE9BQUYsRUFBVyxRQUFYLENBQW9CLFdBQXBCLENBQWY7QUFDQSxTQUFLLElBQUwsR0FBZSxFQUFFLE9BQUYsRUFBVyxRQUFYLENBQW9CLGdCQUFwQixFQUNDLFFBREQsQ0FDVSxLQUFLLE9BRGYsQ0FBZjtBQUVBLFNBQUssT0FBTCxHQUFlLEVBQUUsT0FBRixFQUFXLFFBQVgsQ0FBb0IsbUJBQXBCLEVBQ0MsUUFERCxDQUNVLEtBQUssT0FEZixDQUFmO0FBRUEsTUFBRSxNQUFGLEVBQVUsTUFBVixDQUFpQixLQUFLLE9BQXRCO0FBQ0Q7Ozs7eUJBRUssRSxFQUFJLEMsRUFDVjtBQUNFLFVBQUksTUFBTSxFQUFFLEVBQUYsQ0FBVjtBQUNBLFVBQUksTUFBTSxJQUFJLFFBQUosRUFBVjtBQUNBLFVBQUksUUFBUSxFQUFFLE1BQUYsQ0FBWjtB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QUNELFFBQUksYUFBYSxNQUFqQixFQUNBO0FBQ0UsVUFBSSxPQUFKLEVBQ0E7QUFDRTtBQUNEO0FBQ0QsWUFBTSxFQUFFLElBQUYsQ0FBTjtBQUNBO0FBQ0Q7O0FBRUQsUUFBSSxPQUFKLEVBQ0E7QUFDRTtBQUNEOztBQUVELFVBQU0sRUFBRSxJQUFGLENBQU47QUFDRDtBQUNGIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCB7TWFya2VyfSBmcm9tICcuL21hcmtlci5qcyc7XG5tb2R1bGUuZXhwb3J0cyA9IE1hcmtlcjtcbiIsImV4cG9ydCBjbGFzcyBNYWduaWZpZXJcbntcbiAgY29uc3RydWN0b3IgKG1hcmtlcilcbiAge1xuICAgIHRoaXMubWFya2VyICA9IG1hcmtlcjtcbiAgICB0aGlzLmVsZW1lbnQgPSAkKCc8ZGl2PicpLmFkZENsYXNzKCdtYWduaWZpZXInKTtcbiAgICB0aGlzLnRleHQgICAgPSAkKCc8ZGl2PicpLmFkZENsYXNzKCdtYWduaWZpZXItdGV4dCcpXG4gICAgICAgICAgICAgICAgICAgLmFwcGVuZFRvKHRoaXMuZWxlbWVudCk7XG4gICAgdGhpcy5wb2ludGVyID0gJCgnPGRpdj4nKS5hZGRDbGFzcygnbWFnbmlmaWVyLXBvaW50ZXInKVxuICAgICAgICAgICAgICAgICAgIC5hcHBlbmRUbyh0aGlzLmVsZW1lbnQpO1xuICAgICQoJ2JvZHknKS5hcHBlbmQodGhpcy5lbGVtZW50KTtcbiAgfVxuXG4gIHNob3cgKGVsLCB4KVxuICB7XG4gICAgbGV0ICRlbCA9ICQoZWwpO1xuICAgIGxldCBwb3MgPSAkZWwucG9zaXRpb24oKTtcbiAgICBsZXQgJGJvZHkgPSAkKCdib2R5Jyk7XG4gICAgbGV0IGJvZHlXaWR0aCA9ICRib2R5LndpZHRoKCk7XG4gICAgbGV0IGJvZHlPdXRlcldpZHRoID0gJGJvZHkub3V0ZXJXaWR0aCgpO1xuICAgIGxldCBib2R5UG9zID0gJGJvZHkucG9zaXRpb24oKTtcbiAgICB4ID0geCArICh3aW5kb3cuc2Nyb2xsWCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdCk7XG4gICAgeCA9IHggLSAoYm9keU91dGVyV2lkdGggLSBib2R5V2lkdGgpLzI7XG4gICAgdGhpcy50ZXh0Lmh0bWwoJGVsLmh0bWwoKSk7XG5cbiAgICB0aGlzLmVsZW1lbnQuYXR0cignZGF0YS1tYXJrJywgdGhpcy5tYXJrZXIuY29sb3IpO1xuICAgIHRoaXMuZWxlbWVudC5hdHRyKCdkYXRhLW1hcmstZmlyc3QnLCAkZWwuaXMoJzpmaXJzdC1jaGlsZCcpKTtcbiAgICB0aGlzLmVsZW1lbnQuYXR0cignZGF0YS1tYXJrLWxhc3QnLCAkZWwuaXMoJzpsYXN0LWNoaWxkJykpO1xuXG4gICAgbGV0IG1hZ1dpZHRoID0gdGhpcy5lbGVtZW50Lm91dGVyV2lkdGgoKTtcbiAgICBsZXQgbGVmdE9mZnNldCA9IE1hdGgubWluKE1hdGgubWF4KCh4IC0gbWFnV2lkdGgvMiksIDAgLSBib2R5UG9zLmxlZnQpLCBib2R5T3V0ZXJXaWR0aCArIGJvZHlQb3MubGVmdCAtIG1hZ1dpZHRoKTtcbiAgICBsZWZ0T2Zmc2V0ID0gTWF0aC5tYXgoTWF0aC5taW4ocG9zLmxlZnQgKyAkZWwud2lkdGgoKSAtIG1hZ1dpZHRoLzIsIGxlZnRPZmZzZXQpLCBwb3MubGVmdCAtIG1hZ1dpZHRoLzIpO1xuICAgIGxldCB0b3BPZmZzZXQgPSBwb3MudG9wIC0gdGhpcy5lbGVtZW50LmhlaWdodCgpO1xuXG4gICAgdGhpcy5lbGVtZW50LmNzcyh7XG4gICAgICBsZWZ0OiBsZWZ0T2Zmc2V0LFxuICAgICAgdG9wOiB0b3BPZmZzZXQsXG4gICAgfSk7XG5cbiAgICB0aGlzLnBvaW50ZXIuY3NzKHtcbiAgICAgIGxlZnQ6IE1hdGgubWluKE1hdGgubWF4KHggLSBsZWZ0T2Zmc2V0LCAyMCksIHRoaXMuZWxlbWVudC5vdXRlcldpZHRoKCkgLSAyMiwgKCRlbC53aWR0aCgpICsgcG9zLmxlZnQpIC0gbGVmdE9mZnNldCksXG4gICAgfSk7XG5cbiAgICB0aGlzLmVsZW1lbnQuYWRkQ2xhc3MoJ3Nob3cnKTtcbiAgfVxuXG4gIGhpZGUgKClcbiAge1xuICAgIHRoaXMuZWxlbWVudC5yZW1vdmVDbGFzcygnc2hvdycpO1xuICB9XG59XG4iLCJpbXBvcnQge1xuICBnZXRDb29yZHMsXG4gIGdldENsb3Nlc3RFbGVtZW50LFxuICBnZXRFbGVtZW50SW5MaW5lLFxuICBnZXRFbGVtZW50SW5TcHJheSxcbiAgd2Fsa0VsZW1lbnRzXG59IGZyb20gJy4vdXRpbHMnO1xuXG5pbXBvcnQge01hZ25pZmllcn0gZnJvbSAnLi9tYWduaWZpZXIuanMnO1xuaW1wb3J0IHtTdHlsZXJ9IGZyb20gJy4vc3R5bGVyLmpzJztcbmltcG9ydCB7VG91Y2hob2xkfSBmcm9tICcuL3RvdWNoaG9sZC5qcyc7XG5cbmV4cG9ydCBjbGFzcyBNYXJrZXJcbntcbiAgY29uc3RydWN0b3IgKGVsLCB7XG4gICAgY29sb3JzPXswOiAnI2YyZjJmMicsIDE6ICcjOGFmNThhJywgMjogJyNmZjgwODAnfSxcbiAgfT17fSlcbiAge1xuICAgICQoZWwpLmFkZENsYXNzKCdtYXJrZXInKTtcbiAgICAkKGVsKS5hdHRyKCdkYXRhLWlzLWhpZ2hsaWdodGluZycsIGZhbHNlKTtcbiAgICB0aGlzLmVsID0gJChlbCk7XG4gICAgdGhpcy5jb2xvcnMgPSBjb2xvcnM7XG4gICAgdGhpcy5jb2xvciA9IDA7XG4gICAgdGhpcy5jdXJyZW50SE1hcmsgPSBudWxsO1xuICAgIHRoaXMuc3RhcnQgPSBudWxsO1xuICAgIHRoaXMuc3RhcnRYID0gbnVsbDtcbiAgICB0aGlzLnN0YXJ0WSA9IG51bGw7XG4gICAgdGhpcy5lbmQgPSBudWxsO1xuICAgIHRoaXMuZW5kWCA9IG51bGw7XG4gICAgdGhpcy5lbmRZID0gbnVsbDtcbiAgICB0aGlzLmlzSGVsZCA9IGZhbHNlO1xuICAgIHRoaXMudG91Y2hob2xkID0gbmV3IFRvdWNoaG9sZCgnYm9keScpO1xuICAgIHRoaXMubWFnbmlmaWVyID0gbmV3IE1hZ25pZmllcih0aGlzKTtcbiAgICB0aGlzLnN0eWxlciA9IG5ldyBTdHlsZXIoKTtcbiAgICB0aGlzLmVtYmVkU3R5bGVzKCk7XG4gICAgdGhpcy53cmFwV29yZHMoKTtcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnRzKCk7XG4gIH1cblxuICBlbWJlZFN0eWxlcyAoKVxuICB7XG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMuY29sb3JzKSB7XG4gICAgICB0aGlzLnN0eWxlci5zZXQoe1xuICAgICAgICAnLm1hcmtlcic6IHtcbiAgICAgICAgICBbYFtkYXRhLW1hcms9XCIke2tleX1cIl1gXToge1xuICAgICAgICAgICAgYmFja2dyb3VuZDogdGhpcy5jb2xvcnNba2V5XSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFtgJltkYXRhLWlzLWhpZ2hsaWdodGluZz1cImZhbHNlXCJdW2RhdGEtaXMtdG91Y2hpbmc9XCJmYWxzZVwiXVtkYXRhLW1hcms9XCIke2tleX1cIl1cbiAgICAgICAgICAubWFyay13b3JkOmhvdmVyYF06IHtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IHRoaXMuY29sb3JzW2tleV0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgW2AubWFnbmlmaWVyW2RhdGEtbWFyaz1cIiR7a2V5fVwiXSAubWFnbmlmaWVyLXRleHRgXToge1xuICAgICAgICAgIGJhY2tncm91bmQ6IHRoaXMuY29sb3JzW2tleV0sXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHdyYXBXb3JkcyAoKVxuICB7XG4gICAgbGV0ICRlbHMgPSAkKHRoaXMuZWwpLmZpbmQoJyonKTtcbiAgICBsZXQgJGVsO1xuXG4gICAgd2Fsa0VsZW1lbnRzKCRlbHNbMF0sICRlbHMubGFzdCgpWzBdLCB0cnVlLCAoZWwsIGRpcikgPT4ge1xuICAgICAgaWYgKGVsLm5vZGVUeXBlID09IDMpIHtcbiAgICAgICAgbGV0IHdvcmRzID0gZWwudGV4dENvbnRlbnQuc3BsaXQoL1xccysvKTtcbiAgICAgICAgbGV0IHdyYXBwZWQgPSBbXTtcbiAgICAgICAgbGV0ICRuZXdFbCA9IGVsO1xuXG4gICAgICAgIGZvciAobGV0IHdvcmQgb2Ygd29yZHMpXG4gICAgICAgIHtcbiAgICAgICAgICBpZiAod29yZC5sZW5ndGgpXG4gICAgICAgICAge1xuICAgICAgICAgICAgJG5ld0VsID0gJChgPHNwYW4gY2xhc3M9XCJtYXJrLXdvcmRcIj4ke3dvcmR9PC9zcGFuPmApO1xuICAgICAgICAgICAgd3JhcHBlZC5wdXNoKCRuZXdFbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCRuZXdFbCAhPT0gZWwpXG4gICAgICAgIHtcbiAgICAgICAgICAkKGVsKS5yZXBsYWNlV2l0aCh3cmFwcGVkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAkbmV3RWw7XG4gICAgICB9XG4gICAgICBlbHNlIGlmICgoJGVsID0gJChlbCkpLmlzKCc6ZW1wdHknKSAmJiAhJGVsLmlzKCdicixocicpKVxuICAgICAge1xuICAgICAgICByZXR1cm4gJGVsLndyYXAoJCgnPHNwYW4gY2xhc3M9XCJtYXJrLXdvcmQgbWFyay1hdG9tXCI+JykpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgaGlnaGxpZ2h0V29yZHMgKCR3b3JkcylcbiAge1xuICAgIGxldCBmaXJzdCA9ICR3b3Jkc1swXTtcbiAgICBsZXQgJHdyYXBwZXIgPSAkKGA8c3BhbiBkYXRhLW1hcms9XCIke3RoaXMuY29sb3J9XCIvPmApO1xuICAgICQoZmlyc3QpLmJlZm9yZSgkd3JhcHBlcik7XG4gICAgJHdyYXBwZXIuYXBwZW5kKCR3b3Jkcyk7XG4gICAgdGhpcy5jdXJyZW50TWFyayA9ICh0aGlzLmN1cnJlbnRNYXJrIHx8ICQoKSkuYWRkKCR3cmFwcGVyKTtcbiAgICByZXR1cm4gJHdyYXBwZXI7XG4gIH1cblxuICBzdGFydEhpZ2hsaWdodCAoZnJvbSlcbiAge1xuICAgICQodGhpcy5lbCkuYXR0cignZGF0YS1pcy1oaWdobGlnaHRpbmcnLCB0cnVlKTtcbiAgICB0aGlzLnN0YXJ0ID0gZnJvbTtcbiAgICB0aGlzLmVuZCA9IGZyb207XG4gICAgdGhpcy5jdXJyZW50TWFyayA9ICQoKTtcbiAgICB0aGlzLmhpZ2hsaWdodChmcm9tLCBmcm9tKTtcbiAgfVxuXG4gIGNhbmNlbEhpZ2hsaWdodCAoKVxuICB7XG4gICAgJCh0aGlzLmVsKS5hdHRyKCdkYXRhLWlzLWhpZ2hsaWdodGluZycsIGZhbHNlKTtcbiAgICB0aGlzLnN0YXJ0ID0gbnVsbDtcbiAgICB0aGlzLmVuZCA9IG51bGw7XG4gICAgdGhpcy5jdXJyZW50TWFyayA9IG51bGw7XG4gIH1cblxuICBtb3ZlSGlnaGxpZ2h0ICh0bylcbiAge1xuICAgIHRoaXMuaGlnaGxpZ2h0KHRoaXMuc3RhcnQsIHRoaXMuZW5kID0gdG8pO1xuICB9XG5cbiAgZW5kSGlnaGxpZ2h0ICgpXG4gIHtcbiAgICAkKHRoaXMuZWwpLmF0dHIoJ2RhdGEtaXMtaGlnaGxpZ2h0aW5nJywgZmFsc2UpO1xuICAgIHRoaXMuc3RhcnQgPSBudWxsO1xuICAgIHRoaXMuY3VycmVudE1hcmsgPSBudWxsO1xuICAgIHRoaXMubm9ybWFsaXplSGlnaGxpZ2h0cygpO1xuICB9XG5cbiAgaGlnaGxpZ2h0IChmcm9tLCB0bylcbiAge1xuICAgIGlmICh0aGlzLmN1cnJlbnRNYXJrKVxuICAgIHtcbiAgICAgIHRoaXMucmVtb3ZlSGlnaGxpZ2h0KHRoaXMuY3VycmVudE1hcmspO1xuICAgICAgdGhpcy5jdXJyZW50TWFyayA9ICQoKTtcbiAgICB9XG5cbiAgICBsZXQgJGVscyA9ICQoKTtcbiAgICB3YWxrRWxlbWVudHMoZnJvbSwgdG8sIGZhbHNlLCAoZWwsIGRpcikgPT4ge1xuICAgICAgaWYgKGRpciAmJiAkZWxzLmxlbmd0aClcbiAgICAgIHtcbiAgICAgICAgbGV0IHdyYXBwZXIgPSB0aGlzLmhpZ2hsaWdodFdvcmRzKCRlbHMpWzBdO1xuICAgICAgICAkZWxzID0gJCgpO1xuICAgICAgICByZXR1cm4gd3JhcHBlcjtcbiAgICAgIH1cblxuICAgICAgaWYgKCQoZWwpLmlzKCcubWFyay13b3JkJykpXG4gICAgICB7XG4gICAgICAgICRlbHMgPSAkZWxzLmFkZChlbCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoJGVscy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuaGlnaGxpZ2h0V29yZHMoJGVscyk7XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlSGlnaGxpZ2h0ICgkbWFyaylcbiAge1xuICAgICRtYXJrLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgbGV0ICR0aGlzID0gJCh0aGlzKTtcbiAgICAgICR0aGlzLnJlcGxhY2VXaXRoKCR0aGlzLmNvbnRlbnRzKCkpO1xuICAgIH0pO1xuICB9XG5cbiAgY2xlYXJIaWdobGlnaHRzICgpXG4gIHtcbiAgICAkKHRoaXMuZWwpLmZpbmQoJ1tkYXRhLW1hcmtdJykubm90KHRoaXMpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgJCh0aGlzKS5yZXBsYWNlV2l0aCgkKHRoaXMpLmNvbnRlbnRzKCkpO1xuICAgIH0pO1xuICB9XG5cbiAgbm9ybWFsaXplSGlnaGxpZ2h0cyAoKVxuICB7XG4gICAgLy8gRW1wdHlcbiAgICAkKHRoaXMuZWwpLmZpbmQoJ1tkYXRhLW1hcmtdJykubm90KHRoaXMpLmZpbHRlcignOmVtcHR5JykucmVtb3ZlKCk7XG5cbiAgICAvLyBOZXN0ZWRcbiAgICAkKHRoaXMuZWwpLmZpbmQoJ1tkYXRhLW1hcmtdJykubm90KHRoaXMpLmNoaWxkcmVuKCdbZGF0YS1tYXJrXScpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgbGV0ICR0aGlzID0gJCh0aGlzKTtcbiAgICAgIGxldCAkcGFyZW50ID0gJHRoaXMucGFyZW50KCk7XG5cbiAgICAgIGlmICgkdGhpcy5hdHRyKCdkYXRhLW1hcmsnKSA9PSAkcGFyZW50LmF0dHIoJ2RhdGEtbWFyaycpKVxuICAgICAge1xuICAgICAgICAkdGhpcy5yZXBsYWNlV2l0aCgkdGhpcy5jb250ZW50cygpKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBsZXQgJGxlZnRXb3JkcyA9ICRwYXJlbnQuY2hpbGRyZW4oKS5maXJzdCgpLm5leHRVbnRpbCh0aGlzKS5hZGRCYWNrKCk7XG4gICAgICBsZXQgJHJpZ2h0V29yZHMgPSAkdGhpcy5uZXh0QWxsKCk7XG5cbiAgICAgIGlmICgkbGVmdFdvcmRzLmxlbmd0aClcbiAgICAgIHtcbiAgICAgICAgJHBhcmVudC5iZWZvcmUoJCgkcGFyZW50WzBdLmNsb25lTm9kZSgpKS5hcHBlbmQoJGxlZnRXb3JkcykpO1xuICAgICAgfVxuXG4gICAgICBpZiAoJHJpZ2h0V29yZHMubGVuZ3RoKVxuICAgICAge1xuICAgICAgICAkcGFyZW50LmFmdGVyKCQoJHBhcmVudFswXS5jbG9uZU5vZGUoKSkuYXBwZW5kKCRyaWdodFdvcmRzKSk7XG4gICAgICB9XG5cbiAgICAgICRwYXJlbnQucmVwbGFjZVdpdGgoJHRoaXMpO1xuICAgIH0pO1xuXG4gICAgLy8gRXJhc2VkXG4gICAgJCh0aGlzLmVsKS5maW5kKCdbZGF0YS1tYXJrPVwiMFwiXScpLm5vdCh0aGlzKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIGxldCAkdGhpcyA9ICQodGhpcyk7XG4gICAgICAkdGhpcy5yZXBsYWNlV2l0aCgkdGhpcy5jb250ZW50cygpKTtcbiAgICB9KTtcblxuICAgIC8vIEVtcHR5Li4uIGFnYWluXG4gICAgJCh0aGlzLmVsKS5maW5kKCdbZGF0YS1tYXJrXScpLm5vdCh0aGlzKS5maWx0ZXIoJzplbXB0eScpLnJlbW92ZSgpO1xuXG4gICAgLy8gQWRqYWNlbnRcbiAgICAkKHRoaXMuZWwpLmZpbmQoJ1tkYXRhLW1hcmtdJykubm90KHRoaXMpLm5leHQoJ1tkYXRhLW1hcmtdJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICBsZXQgJHRoaXMgPSAkKHRoaXMpO1xuICAgICAgbGV0ICRwcmV2ID0gJHRoaXMucHJldigpO1xuXG4gICAgICBpZiAoJHRoaXMuYXR0cignZGF0YS1tYXJrJykgPT0gJHByZXYuYXR0cignZGF0YS1tYXJrJykpXG4gICAgICB7XG4gICAgICAgICRwcmV2LmFwcGVuZCgkdGhpcy5jb250ZW50cygpKTtcbiAgICAgICAgJHRoaXMucmVtb3ZlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBzZXRDb2xvciAoY29sb3IpXG4gIHtcbiAgICB0aGlzLmNvbG9yID0gY29sb3I7XG4gICAgJCh0aGlzLmVsKS5hdHRyKCdkYXRhLW1hcmsnLCBjb2xvcik7XG4gIH1cblxuICByZWdpc3RlckV2ZW50cyAoKVxuICB7XG4gICAgJCgnYm9keScpLm9uKCd0b3VjaGhvbGQgbW91c2Vkb3duJywgKGUpID0+IHRoaXMuc3RhcnRFdmVudChlKSlcbiAgICAgICAgICAgICAub24oJ3RvdWNobW92ZSBtb3VzZW1vdmUnLCAoZSkgPT4gdGhpcy5tb3ZlRXZlbnQoZSkpXG4gICAgICAgICAgICAgLm9uKCd0b3VjaGVuZCB0b3VjaGNhbmNlbCBtb3VzZXVwJywgKGUpID0+IHRoaXMuZW5kRXZlbnQoZSkpXG4gICAgICAgICAgICAgO1xuXG4gICAgdGhpcy5lbC5maW5kKCcubWFyay13b3JkJykub24oJ2NsaWNrJywgKGUpID0+IHRoaXMuY2xpY2tFdmVudChlKSk7XG5cbiAgICB0aGlzLnRvdWNoc3dhcCgpO1xuICB9XG5cbiAgc3RhcnRFdmVudCAoZSlcbiAge1xuICAgIGlmIChlLnR5cGUgPT0gJ21vdXNlZG93bicgJiYgZS53aGljaCAhPSAxKSByZXR1cm47XG4gICAgaWYgKCQodGhpcy5lbCkuaGFzKGUudGFyZ2V0KS5sZW5ndGggPT0gMCkgcmV0dXJuO1xuICAgIGlmIChlLnR5cGUgPT0gJ3RvdWNoaG9sZCcpXG4gICAge1xuICAgICAgdGhpcy5pc0hlbGQgPSB0cnVlO1xuICAgIH1cblxuICAgIGxldCB7eCwgeX0gPSBnZXRDb29yZHMoZSk7XG4gICAgbGV0IGVsID0gZ2V0Q2xvc2VzdEVsZW1lbnQoeCwgeSwgJy5tYXJrLXdvcmQnKTtcblxuICAgIGlmIChlbClcbiAgICB7XG4gICAgICB0aGlzLnN0YXJ0SGlnaGxpZ2h0KGVsKTtcblxuICAgICAgaWYgKHRoaXMuaXNIZWxkKVxuICAgICAge1xuICAgICAgICB0aGlzLm1hZ25pZmllci5zaG93KGVsLCB4KTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc3RhcnRYID0geDtcbiAgICAgIHRoaXMuc3RhcnRZID0geTtcbiAgICAgIHRoaXMuZW5kWCA9IHg7XG4gICAgICB0aGlzLmVuZFkgPSB5O1xuICAgIH1cbiAgfVxuXG4gIG1vdmVFdmVudCAoZSlcbiAge1xuICAgIGlmICh0aGlzLnN0YXJ0KVxuICAgIHtcbiAgICAgIGlmIChlLnR5cGUgPT0gJ3RvdWNobW92ZScgJiYgIXRoaXMuaXNIZWxkKSB7XG4gICAgICAgIHRoaXMuY2FuY2VsSGlnaGxpZ2h0KCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgbGV0IHt4LCB5fSA9IGdldENvb3JkcyhlKTtcbiAgICAgIGxldCBlbCA9IGdldENsb3Nlc3RFbGVtZW50KHgsIHksICcubWFyay13b3JkJywgMTYsIDYpO1xuICAgICAgaWYgKCFlbClcbiAgICAgIHtcbiAgICAgICAgLy8gZWwgPSBnZXRFbGVtZW50SW5MaW5lKHgsIHksIHRoaXMuc3RhcnRYLCB0aGlzLnN0YXJ0WSwgJy5tYXJrLXdvcmQnKTtcbiAgICAgICAgZWwgPSBnZXRFbGVtZW50SW5TcHJheSh4LCB5LCB0aGlzLnN0YXJ0WCwgdGhpcy5zdGFydFksICcubWFyay13b3JkJyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChlbClcbiAgICAgIHtcbiAgICAgICAgdGhpcy5tb3ZlSGlnaGxpZ2h0KGVsKTtcblxuICAgICAgICBpZiAodGhpcy5pc0hlbGQpXG4gICAgICAgIHtcbiAgICAgICAgICB0aGlzLm1hZ25pZmllci5zaG93KGVsLCB4KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVuZFggPSB4O1xuICAgICAgICB0aGlzLmVuZFkgPSB5O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGVuZEV2ZW50IChlKVxuICB7XG4gICAgdGhpcy5lbmRIaWdobGlnaHQoKTtcbiAgICB0aGlzLm1hZ25pZmllci5oaWRlKCk7XG4gICAgdGhpcy5pc0hlbGQgPSBmYWxzZTtcbiAgfVxuXG4gIGNsaWNrRXZlbnQgKGUpXG4gIHtcbiAgICB0aGlzLmhpZ2hsaWdodChlLnRhcmdldCwgZS50YXJnZXQpO1xuICB9XG5cbiAgdG91Y2hzd2FwICgpXG4gIHtcbiAgICB0aGlzLmVsLmF0dHIoJ2RhdGEtaXMtdG91Y2hpbmcnLCBmYWxzZSk7XG4gICAgJCh3aW5kb3cpLm9uKCd0b3VjaHN0YXJ0IHRvdWNoZW5kJywgKCkgPT4ge1xuICAgICAgdGhpcy5lbC5hdHRyKCdkYXRhLWlzLXRvdWNoaW5nJywgdHJ1ZSk7XG4gICAgfSk7XG4gIH1cbn1cblxuIiwiZXhwb3J0IGNsYXNzIFN0eWxlclxue1xuICBjb25zdHJ1Y3RvciAocnVsZXM9e30pXG4gIHtcbiAgICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICQoJ2JvZHknKS5hcHBlbmQodGhpcy5lbGVtZW50KTtcbiAgICB0aGlzLnNoZWV0ID0gdGhpcy5lbGVtZW50LnNoZWV0O1xuICAgIHRoaXMucnVsZXMgPSB7fTtcbiAgICB0aGlzLnNldChydWxlcyk7XG4gIH1cblxuICBzZXQgKHNlbCwgcHJvcHMpXG4gIHtcbiAgICBpZiAoc2VsICYmIHR5cGVvZiBzZWwgPT09ICdvYmplY3QnKVxuICAgIHtcbiAgICAgIGxldCBydWxlcyA9IHNlbDtcbiAgICAgIGZvciAobGV0IHNlbCBpbiBydWxlcylcbiAgICAgIHtcbiAgICAgICAgdGhpcy5zZXQoc2VsLCBydWxlc1tzZWxdKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzZWwgPSBzZWwucmVwbGFjZSgvXFxzKy9nLCAnICcpO1xuICAgIGxldCBydWxlID0gdGhpcy5ydWxlc1tzZWxdO1xuICAgIGlmIChydWxlKVxuICAgIHtcbiAgICAgIGZvciAobGV0IGtleSBpbiBwcm9wcylcbiAgICAgIHtcbiAgICAgICAgaWYgKHByb3BzW2tleV0gJiYgdHlwZW9mIHByb3BzW2tleV0gPT09ICdvYmplY3QnKVxuICAgICAgICB7XG4gICAgICAgICAgdGhpcy5zZXQodGhpcy5qb2luU2VsZWN0b3JzKHNlbCwga2V5LCBwcm9wc1trZXldKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgcnVsZS5zdHlsZVtrZXldID0gcHJvcHNba2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgbGV0IHN0eWxlU3RyID0gJyc7XG4gICAgICBmb3IgKGxldCBrZXkgaW4gcHJvcHMpXG4gICAgICB7XG4gICAgICAgIGlmIChwcm9wc1trZXldICYmIHR5cGVvZiBwcm9wc1trZXldID09PSAnb2JqZWN0JylcbiAgICAgICAge1xuICAgICAgICAgIHRoaXMuc2V0KHRoaXMuam9pblNlbGVjdG9ycyhzZWwsIGtleSksIHByb3BzW2tleV0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgIHN0eWxlU3RyICs9IGAke2tleX06JHtwcm9wc1trZXldfTtgO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3R5bGVTdHIubGVuZ3RoKVxuICAgICAge1xuICAgICAgICB0aGlzLnJ1bGVzW3NlbF0gPSB0aGlzLnNoZWV0LmNzc1J1bGVzW1xuICAgICAgICAgIHRoaXMuc2hlZXQuaW5zZXJ0UnVsZShgJHtzZWx9eyR7c3R5bGVTdHJ9fWAsIHRoaXMuc2hlZXQuY3NzUnVsZXMubGVuZ3RoKVxuICAgICAgICBdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGpvaW5TZWxlY3RvcnMgKHBhcmVudCwgY2hpbGQpXG4gIHtcbiAgICBpZiAoLyYvLnRlc3QoY2hpbGQpKVxuICAgIHtcbiAgICAgIHJldHVybiBjaGlsZC5yZXBsYWNlKC8mL2csIHBhcmVudCk7XG4gICAgfVxuICAgIHJldHVybiBgJHtwYXJlbnR9ICR7Y2hpbGR9YDtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFRvdWNoaG9sZCB7XG4gIGNvbnN0cnVjdG9yIChlbCwge1xuICAgIG1zID0gMzc1LFxuICAgIGRpc3RhbmNlID0gMTAsXG4gIH09e30pXG4gIHtcbiAgICB0aGlzLmVsID0gZWw7XG4gICAgdGhpcy5tcyA9IG1zO1xuICAgIHRoaXMuZGlzdGFuY2UgPSBkaXN0YW5jZTtcbiAgICB0aGlzLmRpc3RhbmNlU3EgPSBkaXN0YW5jZSAqIGRpc3RhbmNlO1xuICAgIHRoaXMuc3RhcnRYID0gbnVsbDtcbiAgICB0aGlzLnN0YXJ0WSA9IG51bGw7XG4gICAgdGhpcy5zdGFydFNjcm9sbFggPSBudWxsO1xuICAgIHRoaXMuc3RhcnRTY3JvbGxZID0gbnVsbDtcbiAgICB0aGlzLnRpbWVyID0gbnVsbDtcblxuICAgIHRoaXMudG91Y2hkb3duKCk7XG4gICAgdGhpcy50b3VjaG1vdmUoKTtcbiAgICB0aGlzLnRvdWNoZW5kKCk7XG4gIH1cblxuICB0b3VjaGRvd24gKClcbiAge1xuICAgICQoJ2JvZHknKS5vbigndG91Y2hzdGFydCBtb3VzZWRvd24nLCAoZSkgPT4ge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZXIpO1xuICAgICAgbGV0IGRhdGE7XG4gICAgICBpZiAoZS50b3VjaGVzKVxuICAgICAge1xuICAgICAgICBpZiAoZS50b3VjaGVzLmxlbmd0aCA+IDEpXG4gICAgICAgIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZGF0YSA9IGUudG91Y2hlc1swXTtcbiAgICAgIH1cbiAgICAgIGVsc2VcbiAgICAgIHtcbiAgICAgICAgaWYgKGUud2hpY2ggIT0gMSkgcmV0dXJuO1xuICAgICAgICBkYXRhID0gZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zdGFydFggPSBkYXRhLmNsaWVudFg7XG4gICAgICB0aGlzLnN0YXJ0WSA9IGRhdGEuY2xpZW50WTtcbiAgICAgIHRoaXMuc3RhcnRTY3JvbGxYID0gd2luZG93LnNjcm9sbFggfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQ7XG4gICAgICB0aGlzLnN0YXJ0U2Nyb2xsWSA9IHdpbmRvdy5zY3JvbGxZIHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3A7XG4gICAgICB0aGlzLnRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB0aGlzLmVtaXRUb3VjaGhvbGQoZSksIHRoaXMubXMpO1xuICAgIH0pO1xuICB9XG5cbiAgdG91Y2htb3ZlICgpXG4gIHtcbiAgICAkKGRvY3VtZW50KS5vbigndG91Y2htb3ZlIG1vdXNlbW92ZScsIChlKSA9PiB7XG4gICAgICBsZXQgZGF0YTtcbiAgICAgIGlmIChlLnRvdWNoZXMpXG4gICAgICB7XG4gICAgICAgIGlmIChlLnRvdWNoZXMubGVuZ3RoID4gMSlcbiAgICAgICAge1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVyKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZGF0YSA9IGUudG91Y2hlc1swXTtcbiAgICAgIH1cbiAgICAgIGVsc2VcbiAgICAgIHtcbiAgICAgICAgZGF0YSA9IGU7XG4gICAgICB9XG5cbiAgICAgIGxldCB7Y2xpZW50WDogeCwgY2xpZW50WTogeX0gPSBkYXRhO1xuICAgICAgbGV0IGR4ID0geCAtIHRoaXMuc3RhcnRYO1xuICAgICAgbGV0IGR5ID0geSAtIHRoaXMuc3RhcnRZO1xuICAgICAgbGV0IGRpc3RhbmNlU3EgPSBkeCpkeCArIGR5KmR5O1xuICAgICAgaWYgKGRpc3RhbmNlU3EgPiB0aGlzLmRpc3RhbmNlU3EpXG4gICAgICB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVyKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHRvdWNoZW5kICgpXG4gIHtcbiAgICAkKGRvY3VtZW50KS5vbigndG91Y2hlbmQgdG91Y2hjYW5jZWwgbW91c2V1cCcsIChlKSA9PiB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lcik7XG4gICAgfSk7XG4gIH1cblxuICBlbWl0VG91Y2hob2xkIChlKVxuICB7XG4gICAgZS50eXBlID0gJ3RvdWNoaG9sZCc7XG4gICAgJCh0aGlzLmVsKS50cmlnZ2VyKGUpO1xuICB9XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gZ2V0Q2xvc2VzdEVsZW1lbnQgKHgsIHksIHNlbCwgcmFkaXVzPTE2LCBwb2ludHM9OSlcbntcbiAgLy8gdHJ5IGNlbnRlclxuICBsZXQgZWwgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KHgsIHkpO1xuICBpZiAoZWwgJiYgKCFzZWwgfHwgJChlbCkuaXMoc2VsKSkpXG4gIHtcbiAgICByZXR1cm4gZWw7XG4gIH1cblxuICAvLyB0cnkgY2lyY2xlIGFyb3VuZFxuICBsZXQgYW5nbGUgPSAoTWF0aC5QSSAqIDIpIC8gcG9pbnRzO1xuICBsZXQgeHI7XG4gIGxldCB5cjtcbiAgZm9yIChsZXQgaT0wOyBpPHBvaW50czsgaSsrKVxuICB7XG4gICAgeHIgPSBNYXRoLmNvcyhhbmdsZSAqIGkpO1xuICAgIHlyID0gTWF0aC5zaW4oYW5nbGUgKiBpKTtcbiAgICBlbCA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoeCArIHhyKnJhZGl1cywgeSArIHlyKnJhZGl1cyk7XG4gICAgaWYgKGVsICYmICghc2VsIHx8ICQoZWwpLmlzKHNlbCkpKVxuICAgIHtcbiAgICAgIHJldHVybiBlbDtcbiAgICB9XG4gIH1cbn1cblxuIiwiZXhwb3J0IGZ1bmN0aW9uIGdldENvb3JkcyAoZSlcbntcbiAgbGV0IHgsIHk7XG4gIGlmIChlLnRvdWNoZXMpXG4gIHtcbiAgICBsZXQgdG91Y2ggPSBlLnRvdWNoZXNbMF07XG4gICAgeCA9IHRvdWNoLmNsaWVudFg7XG4gICAgeSA9IHRvdWNoLmNsaWVudFk7XG4gIH1cbiAgZWxzZVxuICB7XG4gICAgeCA9IGUuY2xpZW50WDtcbiAgICB5ID0gZS5jbGllbnRZO1xuICB9XG4gIHJldHVybiB7eCwgeX07XG59XG5cbiIsImV4cG9ydCBmdW5jdGlvbiBnZXRFbGVtZW50SW5MaW5lIChmeCwgZnksIHR4LCB0eSwgc2VsLCBzdGVwPTE2KVxue1xuICBsZXQgZHggPSB0eCAtIGZ4O1xuICBsZXQgZHkgPSB0eSAtIGZ5O1xuICBsZXQgbWFnbml0dWRlID0gTWF0aC5zcXJ0KGR4KmR4ICsgZHkqZHkpO1xuICBsZXQgbnggPSBkeCAvIG1hZ25pdHVkZTtcbiAgbGV0IG55ID0gZHkgLyBtYWduaXR1ZGU7XG4gIGxldCBzeCA9IG54ICogc3RlcDtcbiAgbGV0IHN5ID0gbnkgKiBzdGVwO1xuXG4gIC8vIHRyeSBjZW50ZXJcbiAgbGV0IGVsID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChmeCwgZnkpO1xuICBpZiAoZWwgJiYgKCFzZWwgfHwgJChlbCkuaXMoc2VsKSkpXG4gIHtcbiAgICByZXR1cm4gZWw7XG4gIH1cblxuICAvLyB0cnkgYWxvbmcgbGluZVxuICBmb3IgKGxldCBpPTAsIGlpPW1hZ25pdHVkZS9zdGVwOyBpPGlpOyBpKyspXG4gIHtcbiAgICBlbCA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoZnggKyBzeCppLCBmeSArIHN5KmkpO1xuICAgIGlmIChlbCAmJiAoIXNlbCB8fCAkKGVsKS5pcyhzZWwpKSlcbiAgICB7XG4gICAgICByZXR1cm4gZWw7XG4gICAgfVxuICB9XG59XG5cbiIsImV4cG9ydCBmdW5jdGlvbiBnZXRFbGVtZW50SW5TcHJheSAoZngsIGZ5LCB0eCwgdHksIHNlbCwgc3RlcD0xNiwgYW5nbGU9TWF0aC5QSS80LCBwb2ludHM9MylcbntcbiAgbGV0IGR4ID0gdHggLSBmeDtcbiAgbGV0IGR5ID0gdHkgLSBmeTtcbiAgbGV0IG1hZ25pdHVkZSA9IE1hdGguc3FydChkeCpkeCArIGR5KmR5KTtcbiAgbGV0IG54ID0gZHggLyBtYWduaXR1ZGU7XG4gIGxldCBueSA9IGR5IC8gbWFnbml0dWRlO1xuICBsZXQgc3ggPSBueCAqIHN0ZXA7XG4gIGxldCBzeSA9IG55ICogc3RlcDtcbiAgbGV0IHNwcmF5QW5nbGUgPSBNYXRoLmF0YW4yKG55LCBueCk7XG4gIGxldCBzdGFydEFuZ2xlID0gc3ByYXlBbmdsZSAtIChhbmdsZSpwb2ludHMvMik7XG5cbiAgLy8gdHJ5IGNlbnRlclxuICBsZXQgZWwgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGZ4LCBmeSk7XG4gIGlmIChlbCAmJiAoIXNlbCB8fCAkKGVsKS5pcyhzZWwpKSlcbiAge1xuICAgIHJldHVybiBlbDtcbiAgfVxuXG4gIC8vIHRyeSBhbG9uZyBzcHJheVxuICBsZXQgeHI7XG4gIGxldCB5cjtcbiAgZm9yIChsZXQgaT0wLCBpaT1tYWduaXR1ZGUvc3RlcDsgaTxpaTsgaSsrKVxuICB7XG4gICAgZm9yIChsZXQgaj0wOyBqPHBvaW50czsgaisrKVxuICAgIHtcbiAgICAgIHhyID0gTWF0aC5jb3Moc3RhcnRBbmdsZSArIGFuZ2xlICogaik7XG4gICAgICB5ciA9IE1hdGguc2luKHN0YXJ0QW5nbGUgKyBhbmdsZSAqIGopO1xuICAgICAgZWwgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGZ4ICsgeHIqc3RlcCppLypzeCppKi8sIGZ5ICsgeXIqc3RlcCppLypzeSppKi8pO1xuICAgICAgaWYgKGVsICYmICghc2VsIHx8ICQoZWwpLmlzKHNlbCkpKVxuICAgICAge1xuICAgICAgICByZXR1cm4gZWw7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbiIsImV4cG9ydCAqIGZyb20gJy4vZ2V0LWNsb3Nlc3QtZWxlbWVudC5qcyc7XG5leHBvcnQgKiBmcm9tICcuL2dldC1jb29yZHMuanMnO1xuZXhwb3J0ICogZnJvbSAnLi9nZXQtZWxlbWVudC1pbi1saW5lLmpzJztcbmV4cG9ydCAqIGZyb20gJy4vZ2V0LWVsZW1lbnQtaW4tc3ByYXkuanMnO1xuZXhwb3J0ICogZnJvbSAnLi93YWxrLWVsZW1lbnRzLmpzJztcbiIsImV4cG9ydCBmdW5jdGlvbiB3YWxrRWxlbWVudHMoZnJvbSwgdG8sIGluY2x1ZGVUZXh0LCBmbilcbntcbiAgLy8gdG8gaXMgYmVmb3JlIGZyb21cbiAgaWYgKGZyb20uY29tcGFyZURvY3VtZW50UG9zaXRpb24odG8pICYgTm9kZS5ET0NVTUVOVF9QT1NJVElPTl9QUkVDRURJTkcpXG4gIHtcbiAgICBsZXQgdG1wID0gZnJvbTtcbiAgICBmcm9tID0gdG87XG4gICAgdG8gPSB0bXA7XG4gIH1cblxuICBjb25zdCBTSUJMSU5HID0gMDtcbiAgY29uc3QgQ0hJTEQgPSAxO1xuICBjb25zdCBQQVJFTlQgPSAtMTtcblxuICBsZXQgJGZyb20gPSAkKGZyb20pO1xuICBsZXQgJHRvID0gJCh0byk7XG5cbiAgbGV0ICRlbCA9ICRmcm9tO1xuICBsZXQgJGNoaWxkcmVuO1xuICBsZXQgbmV4dDtcbiAgbGV0IGRpcmVjdGlvbiA9IFNJQkxJTkc7XG4gIGxldCBuZXdFbDtcbiAgbGV0IGZvdW5kVG8gPSBmYWxzZTtcbiAgbGV0IGNoaWxkcmVuRm4gPSBpbmNsdWRlVGV4dCA/ICdjb250ZW50cycgOiAnY2hpbGRyZW4nO1xuICB3aGlsZSAodHJ1ZSkge1xuICAgIG5ld0VsID0gZm4oJGVsWzBdLCBkaXJlY3Rpb24pO1xuICAgIGRpcmVjdGlvbiA9IFNJQkxJTkc7XG5cbiAgICAvLyBGbiByZXR1cm5lZCBuZXcgZWxcbiAgICBpZiAobmV3RWwpXG4gICAge1xuICAgICAgJGVsID0gJChuZXdFbCk7XG4gICAgfVxuXG4gICAgLy8gRm91bmQgdG9cbiAgICBpZiAoJGVsLmlzKHRvKSlcbiAgICB7XG4gICAgICBmb3VuZFRvID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBGb3VuZCBlbGVtZW50IHdpdGggY2hpbGRyZW5cbiAgICBpZiAoKCRjaGlsZHJlbiA9ICRlbFtjaGlsZHJlbkZuXSgpKS5sZW5ndGggJiYgIW5ld0VsKVxuICAgIHtcbiAgICAgICRlbCA9ICRjaGlsZHJlbi5maXJzdCgpO1xuICAgICAgZGlyZWN0aW9uID0gQ0hJTEQ7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBFbmQgb2YgZWxlbWVudFxuICAgIHdoaWxlICghKG5leHQgPSAkZWxbMF0ubmV4dFNpYmxpbmcpKVxuICAgIHtcbiAgICAgICRlbCA9ICRlbC5wYXJlbnQoKTtcbiAgICAgIGRpcmVjdGlvbiA9IFBBUkVOVDtcbiAgICB9XG4gICAgaWYgKGRpcmVjdGlvbiA9PSBQQVJFTlQpXG4gICAge1xuICAgICAgaWYgKGZvdW5kVG8pXG4gICAgICB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgJGVsID0gJChuZXh0KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChmb3VuZFRvKVxuICAgIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgICRlbCA9ICQobmV4dCk7XG4gIH1cbn1cbiJdfQ==
