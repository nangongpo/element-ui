import { on, off, isInContainer, getScrollContainer } from 'element-ui/lib/utils/dom';
import { isFirefox, rafThrottle } from 'element-ui/lib/utils/util';
import { PopupManager } from 'element-ui/lib/utils/popup';
import __vue_normalize__ from 'vue-runtime-helpers/dist/normalize-component.mjs';
import Locale from 'element-ui/lib/mixins/locale';
import { isHtmlElement, isString } from 'element-ui/lib/utils/types';

function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t, e;
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}

var Mode = {
  CONTAIN: {
    name: 'contain',
    icon: 'el-icon-full-screen'
  },
  ORIGINAL: {
    name: 'original',
    icon: 'el-icon-c-scale-to-original'
  }
};
var mousewheelEventName = isFirefox() ? 'DOMMouseScroll' : 'mousewheel';
var script$1 = {
  name: 'elImageViewer',
  props: {
    urlList: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    zIndex: {
      type: Number,
      default: 2000
    },
    onSwitch: {
      type: Function,
      default: function _default() {}
    },
    onClose: {
      type: Function,
      default: function _default() {}
    },
    initialIndex: {
      type: Number,
      default: 0
    },
    appendToBody: {
      type: Boolean,
      default: true
    },
    maskClosable: {
      type: Boolean,
      default: true
    }
  },
  data: function data() {
    return {
      index: this.initialIndex,
      isShow: false,
      infinite: true,
      loading: false,
      mode: Mode.CONTAIN,
      transform: {
        scale: 1,
        deg: 0,
        offsetX: 0,
        offsetY: 0,
        enableTransition: false
      }
    };
  },
  computed: {
    isSingle: function isSingle() {
      return this.urlList.length <= 1;
    },
    isFirst: function isFirst() {
      return this.index === 0;
    },
    isLast: function isLast() {
      return this.index === this.urlList.length - 1;
    },
    currentImg: function currentImg() {
      return this.urlList[this.index];
    },
    imgStyle: function imgStyle() {
      var _this$transform = this.transform,
        scale = _this$transform.scale,
        deg = _this$transform.deg,
        offsetX = _this$transform.offsetX,
        offsetY = _this$transform.offsetY,
        enableTransition = _this$transform.enableTransition;
      var style = {
        transform: "scale(".concat(scale, ") rotate(").concat(deg, "deg)"),
        transition: enableTransition ? 'transform .3s' : '',
        'margin-left': "".concat(offsetX, "px"),
        'margin-top': "".concat(offsetY, "px")
      };
      if (this.mode === Mode.CONTAIN) {
        style.maxWidth = style.maxHeight = '100%';
      }
      return style;
    },
    viewerZIndex: function viewerZIndex() {
      var nextZIndex = PopupManager.nextZIndex();
      return this.zIndex > nextZIndex ? this.zIndex : nextZIndex;
    }
  },
  watch: {
    index: {
      handler: function handler(val) {
        this.reset();
        this.onSwitch(val);
      }
    },
    currentImg: function currentImg(val) {
      var _this = this;
      this.$nextTick(function (_) {
        var $img = _this.$refs.img[0];
        if (!$img.complete) {
          _this.loading = true;
        }
      });
    }
  },
  methods: {
    hide: function hide() {
      this.deviceSupportUninstall();
      this.onClose();
    },
    deviceSupportInstall: function deviceSupportInstall() {
      var _this2 = this;
      this._keyDownHandler = function (e) {
        e.stopPropagation();
        var keyCode = e.keyCode;
        switch (keyCode) {
          // ESC
          case 27:
            _this2.hide();
            break;
          // SPACE
          case 32:
            _this2.toggleMode();
            break;
          // LEFT_ARROW
          case 37:
            _this2.prev();
            break;
          // UP_ARROW
          case 38:
            _this2.handleActions('zoomIn');
            break;
          // RIGHT_ARROW
          case 39:
            _this2.next();
            break;
          // DOWN_ARROW
          case 40:
            _this2.handleActions('zoomOut');
            break;
        }
      };
      this._mouseWheelHandler = rafThrottle(function (e) {
        var delta = e.wheelDelta ? e.wheelDelta : -e.detail;
        if (delta > 0) {
          _this2.handleActions('zoomIn', {
            zoomRate: 0.015,
            enableTransition: false
          });
        } else {
          _this2.handleActions('zoomOut', {
            zoomRate: 0.015,
            enableTransition: false
          });
        }
      });
      on(document, 'keydown', this._keyDownHandler);
      on(document, mousewheelEventName, this._mouseWheelHandler);
    },
    deviceSupportUninstall: function deviceSupportUninstall() {
      off(document, 'keydown', this._keyDownHandler);
      off(document, mousewheelEventName, this._mouseWheelHandler);
      this._keyDownHandler = null;
      this._mouseWheelHandler = null;
    },
    handleImgLoad: function handleImgLoad(e) {
      this.loading = false;
    },
    handleImgError: function handleImgError(e) {
      this.loading = false;
      e.target.alt = '加载失败';
    },
    handleMouseDown: function handleMouseDown(e) {
      var _this3 = this;
      if (this.loading || e.button !== 0) return;
      var _this$transform2 = this.transform,
        offsetX = _this$transform2.offsetX,
        offsetY = _this$transform2.offsetY;
      var startX = e.pageX;
      var startY = e.pageY;
      this._dragHandler = rafThrottle(function (ev) {
        _this3.transform.offsetX = offsetX + ev.pageX - startX;
        _this3.transform.offsetY = offsetY + ev.pageY - startY;
      });
      on(document, 'mousemove', this._dragHandler);
      on(document, 'mouseup', function (ev) {
        off(document, 'mousemove', _this3._dragHandler);
      });
      e.preventDefault();
    },
    handleMaskClick: function handleMaskClick() {
      if (this.maskClosable) {
        this.hide();
      }
    },
    reset: function reset() {
      this.transform = {
        scale: 1,
        deg: 0,
        offsetX: 0,
        offsetY: 0,
        enableTransition: false
      };
    },
    toggleMode: function toggleMode() {
      if (this.loading) return;
      var modeNames = Object.keys(Mode);
      var modeValues = Object.values(Mode);
      var index = modeValues.indexOf(this.mode);
      var nextIndex = (index + 1) % modeNames.length;
      this.mode = Mode[modeNames[nextIndex]];
      this.reset();
    },
    prev: function prev() {
      if (this.isFirst && !this.infinite) return;
      var len = this.urlList.length;
      this.index = (this.index - 1 + len) % len;
    },
    next: function next() {
      if (this.isLast && !this.infinite) return;
      var len = this.urlList.length;
      this.index = (this.index + 1) % len;
    },
    handleActions: function handleActions(action) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      if (this.loading) return;
      var _zoomRate$rotateDeg$e = _objectSpread2({
          zoomRate: 0.2,
          rotateDeg: 90,
          enableTransition: true
        }, options),
        zoomRate = _zoomRate$rotateDeg$e.zoomRate,
        rotateDeg = _zoomRate$rotateDeg$e.rotateDeg,
        enableTransition = _zoomRate$rotateDeg$e.enableTransition;
      var transform = this.transform;
      switch (action) {
        case 'zoomOut':
          if (transform.scale > 0.2) {
            transform.scale = parseFloat((transform.scale - zoomRate).toFixed(3));
          }
          break;
        case 'zoomIn':
          transform.scale = parseFloat((transform.scale + zoomRate).toFixed(3));
          break;
        case 'clocelise':
          transform.deg += rotateDeg;
          break;
        case 'anticlocelise':
          transform.deg -= rotateDeg;
          break;
      }
      transform.enableTransition = enableTransition;
    }
  },
  mounted: function mounted() {
    this.deviceSupportInstall();
    if (this.appendToBody) {
      document.body.appendChild(this.$el);
    }
    // add tabindex then wrapper can be focusable via Javascript
    // focus wrapper so arrow key can't cause inner scroll behavior underneath
    this.$refs['el-image-viewer__wrapper'].focus();
  },
  destroyed: function destroyed() {
    // if appendToBody is true, remove DOM node after destroy
    if (this.appendToBody && this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
  }
};

/* script */
var __vue_script__$1 = script$1;

/* template */
var __vue_render__$1 = function __vue_render__() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("transition", {
    attrs: {
      name: "viewer-fade"
    }
  }, [_c("div", {
    ref: "el-image-viewer__wrapper",
    staticClass: "el-image-viewer__wrapper",
    style: {
      "z-index": _vm.viewerZIndex
    },
    attrs: {
      tabindex: "-1"
    }
  }, [_c("div", {
    staticClass: "el-image-viewer__mask",
    on: {
      click: function click($event) {
        if ($event.target !== $event.currentTarget) {
          return null;
        }
        return _vm.handleMaskClick($event);
      }
    }
  }), _vm._v(" "), _c("span", {
    staticClass: "el-image-viewer__btn el-image-viewer__close",
    on: {
      click: _vm.hide
    }
  }, [_c("i", {
    staticClass: "el-icon-close"
  })]), _vm._v(" "), !_vm.isSingle ? [_c("span", {
    staticClass: "el-image-viewer__btn el-image-viewer__prev",
    class: {
      "is-disabled": !_vm.infinite && _vm.isFirst
    },
    on: {
      click: _vm.prev
    }
  }, [_c("i", {
    staticClass: "el-icon-arrow-left"
  })]), _vm._v(" "), _c("span", {
    staticClass: "el-image-viewer__btn el-image-viewer__next",
    class: {
      "is-disabled": !_vm.infinite && _vm.isLast
    },
    on: {
      click: _vm.next
    }
  }, [_c("i", {
    staticClass: "el-icon-arrow-right"
  })])] : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "el-image-viewer__btn el-image-viewer__actions"
  }, [_c("div", {
    staticClass: "el-image-viewer__actions__inner"
  }, [_c("i", {
    staticClass: "el-icon-zoom-out",
    on: {
      click: function click($event) {
        _vm.handleActions("zoomOut");
      }
    }
  }), _vm._v(" "), _c("i", {
    staticClass: "el-icon-zoom-in",
    on: {
      click: function click($event) {
        _vm.handleActions("zoomIn");
      }
    }
  }), _vm._v(" "), _c("i", {
    staticClass: "el-image-viewer__actions__divider"
  }), _vm._v(" "), _c("i", {
    class: _vm.mode.icon,
    on: {
      click: _vm.toggleMode
    }
  }), _vm._v(" "), _c("i", {
    staticClass: "el-image-viewer__actions__divider"
  }), _vm._v(" "), _c("i", {
    staticClass: "el-icon-refresh-left",
    on: {
      click: function click($event) {
        _vm.handleActions("anticlocelise");
      }
    }
  }), _vm._v(" "), _c("i", {
    staticClass: "el-icon-refresh-right",
    on: {
      click: function click($event) {
        _vm.handleActions("clocelise");
      }
    }
  })])]), _vm._v(" "), _c("div", {
    staticClass: "el-image-viewer__canvas"
  }, _vm._l(_vm.urlList, function (url, i) {
    return i === _vm.index ? _c("img", {
      key: url,
      ref: "img",
      refInFor: true,
      staticClass: "el-image-viewer__img",
      style: _vm.imgStyle,
      attrs: {
        src: _vm.currentImg
      },
      on: {
        load: _vm.handleImgLoad,
        error: _vm.handleImgError,
        mousedown: _vm.handleMouseDown
      }
    }) : _vm._e();
  }), 0)], 2)]);
};
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

/* style */
var __vue_inject_styles__$1 = undefined;
/* scoped */
var __vue_scope_id__$1 = undefined;
/* module identifier */
var __vue_module_identifier__$1 = undefined;
/* functional template */
var __vue_is_functional_template__$1 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$1 = /*#__PURE__*/__vue_normalize__({
  render: __vue_render__$1,
  staticRenderFns: __vue_staticRenderFns__$1
}, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, false, undefined, undefined, undefined);

/* eslint-disable no-undefined,no-param-reassign,no-shadow */

/**
 * Throttle execution of a function. Especially useful for rate limiting
 * execution of handlers on events like resize and scroll.
 *
 * @param  {Number}    delay          A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
 * @param  {Boolean}   [noTrailing]   Optional, defaults to false. If noTrailing is true, callback will only execute every `delay` milliseconds while the
 *                                    throttled-function is being called. If noTrailing is false or unspecified, callback will be executed one final time
 *                                    after the last throttled-function call. (After the throttled-function has not been called for `delay` milliseconds,
 *                                    the internal counter is reset)
 * @param  {Function}  callback       A function to be executed after delay milliseconds. The `this` context and all arguments are passed through, as-is,
 *                                    to `callback` when the throttled-function is executed.
 * @param  {Boolean}   [debounceMode] If `debounceMode` is true (at begin), schedule `clear` to execute after `delay` ms. If `debounceMode` is false (at end),
 *                                    schedule `callback` to execute after `delay` ms.
 *
 * @return {Function}  A new, throttled, function.
 */
var throttle = function ( delay, noTrailing, callback, debounceMode ) {

	// After wrapper has stopped being called, this timeout ensures that
	// `callback` is executed at the proper times in `throttle` and `end`
	// debounce modes.
	var timeoutID;

	// Keep track of the last time `callback` was executed.
	var lastExec = 0;

	// `noTrailing` defaults to falsy.
	if ( typeof noTrailing !== 'boolean' ) {
		debounceMode = callback;
		callback = noTrailing;
		noTrailing = undefined;
	}

	// The `wrapper` function encapsulates all of the throttling / debouncing
	// functionality and when executed will limit the rate at which `callback`
	// is executed.
	function wrapper () {

		var self = this;
		var elapsed = Number(new Date()) - lastExec;
		var args = arguments;

		// Execute `callback` and update the `lastExec` timestamp.
		function exec () {
			lastExec = Number(new Date());
			callback.apply(self, args);
		}

		// If `debounceMode` is true (at begin) this is used to clear the flag
		// to allow future `callback` executions.
		function clear () {
			timeoutID = undefined;
		}

		if ( debounceMode && !timeoutID ) {
			// Since `wrapper` is being called for the first time and
			// `debounceMode` is true (at begin), execute `callback`.
			exec();
		}

		// Clear any existing timeout.
		if ( timeoutID ) {
			clearTimeout(timeoutID);
		}

		if ( debounceMode === undefined && elapsed > delay ) {
			// In throttle mode, if `delay` time has been exceeded, execute
			// `callback`.
			exec();

		} else if ( noTrailing !== true ) {
			// In trailing throttle mode, since `delay` time has not been
			// exceeded, schedule `callback` to execute `delay` ms after most
			// recent execution.
			//
			// If `debounceMode` is true (at begin), schedule `clear` to execute
			// after `delay` ms.
			//
			// If `debounceMode` is false (at end), schedule `callback` to
			// execute after `delay` ms.
			timeoutID = setTimeout(debounceMode ? clear : exec, debounceMode === undefined ? delay - elapsed : delay);
		}

	}

	// Return the wrapper function.
	return wrapper;

};

//
var isSupportObjectFit = function isSupportObjectFit() {
  return document.documentElement.style.objectFit !== undefined;
};
var ObjectFit = {
  NONE: 'none',
  CONTAIN: 'contain',
  COVER: 'cover',
  FILL: 'fill',
  SCALE_DOWN: 'scale-down'
};
var prevOverflow = '';
var script = {
  name: 'ElImage',
  mixins: [Locale],
  inheritAttrs: false,
  components: {
    ImageViewer: __vue_component__$1
  },
  props: {
    src: String,
    fit: String,
    lazy: Boolean,
    scrollContainer: {},
    previewSrcList: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    zIndex: {
      type: Number,
      default: 2000
    },
    initialIndex: Number
  },
  data: function data() {
    return {
      loading: true,
      error: false,
      show: !this.lazy,
      imageWidth: 0,
      imageHeight: 0,
      showViewer: false
    };
  },
  computed: {
    imageStyle: function imageStyle() {
      var fit = this.fit;
      if (!this.$isServer && fit) {
        return isSupportObjectFit() ? {
          'object-fit': fit
        } : this.getImageStyle(fit);
      }
      return {};
    },
    alignCenter: function alignCenter() {
      return !this.$isServer && !isSupportObjectFit() && this.fit !== ObjectFit.FILL;
    },
    preview: function preview() {
      var previewSrcList = this.previewSrcList;
      return Array.isArray(previewSrcList) && previewSrcList.length > 0;
    },
    imageIndex: function imageIndex() {
      var previewIndex = 0;
      var initialIndex = this.initialIndex;
      if (initialIndex >= 0) {
        previewIndex = initialIndex;
        return previewIndex;
      }
      var srcIndex = this.previewSrcList.indexOf(this.src);
      if (srcIndex >= 0) {
        previewIndex = srcIndex;
        return previewIndex;
      }
      return previewIndex;
    }
  },
  watch: {
    src: function src(val) {
      this.show && this.loadImage();
    },
    show: function show(val) {
      val && this.loadImage();
    }
  },
  mounted: function mounted() {
    if (this.lazy) {
      this.addLazyLoadListener();
    } else {
      this.loadImage();
    }
  },
  beforeDestroy: function beforeDestroy() {
    this.lazy && this.removeLazyLoadListener();
  },
  methods: {
    loadImage: function loadImage() {
      var _this = this;
      if (this.$isServer) return;

      // reset status
      this.loading = true;
      this.error = false;
      var img = new Image();
      img.onload = function (e) {
        return _this.handleLoad(e, img);
      };
      img.onerror = this.handleError.bind(this);

      // bind html attrs
      // so it can behave consistently
      Object.keys(this.$attrs).forEach(function (key) {
        var value = _this.$attrs[key];
        img.setAttribute(key, value);
      });
      img.src = this.src;
    },
    handleLoad: function handleLoad(e, img) {
      this.imageWidth = img.width;
      this.imageHeight = img.height;
      this.loading = false;
      this.error = false;
    },
    handleError: function handleError(e) {
      this.loading = false;
      this.error = true;
      this.$emit('error', e);
    },
    handleLazyLoad: function handleLazyLoad() {
      if (isInContainer(this.$el, this._scrollContainer)) {
        this.show = true;
        this.removeLazyLoadListener();
      }
    },
    addLazyLoadListener: function addLazyLoadListener() {
      if (this.$isServer) return;
      var scrollContainer = this.scrollContainer;
      var _scrollContainer = null;
      if (isHtmlElement(scrollContainer)) {
        _scrollContainer = scrollContainer;
      } else if (isString(scrollContainer)) {
        _scrollContainer = document.querySelector(scrollContainer);
      } else {
        _scrollContainer = getScrollContainer(this.$el);
      }
      if (_scrollContainer) {
        this._scrollContainer = _scrollContainer;
        this._lazyLoadHandler = throttle(200, this.handleLazyLoad);
        on(_scrollContainer, 'scroll', this._lazyLoadHandler);
        this.handleLazyLoad();
      }
    },
    removeLazyLoadListener: function removeLazyLoadListener() {
      var _scrollContainer = this._scrollContainer,
        _lazyLoadHandler = this._lazyLoadHandler;
      if (this.$isServer || !_scrollContainer || !_lazyLoadHandler) return;
      off(_scrollContainer, 'scroll', _lazyLoadHandler);
      this._scrollContainer = null;
      this._lazyLoadHandler = null;
    },
    /**
     * simulate object-fit behavior to compatible with IE11 and other browsers which not support object-fit
     */
    getImageStyle: function getImageStyle(fit) {
      var imageWidth = this.imageWidth,
        imageHeight = this.imageHeight;
      var _this$$el = this.$el,
        containerWidth = _this$$el.clientWidth,
        containerHeight = _this$$el.clientHeight;
      if (!imageWidth || !imageHeight || !containerWidth || !containerHeight) return {};
      var imageAspectRatio = imageWidth / imageHeight;
      var containerAspectRatio = containerWidth / containerHeight;
      if (fit === ObjectFit.SCALE_DOWN) {
        var isSmaller = imageWidth < containerWidth && imageHeight < containerHeight;
        fit = isSmaller ? ObjectFit.NONE : ObjectFit.CONTAIN;
      }
      switch (fit) {
        case ObjectFit.NONE:
          return {
            width: 'auto',
            height: 'auto'
          };
        case ObjectFit.CONTAIN:
          return imageAspectRatio < containerAspectRatio ? {
            width: 'auto'
          } : {
            height: 'auto'
          };
        case ObjectFit.COVER:
          return imageAspectRatio < containerAspectRatio ? {
            height: 'auto'
          } : {
            width: 'auto'
          };
        default:
          return {};
      }
    },
    clickHandler: function clickHandler() {
      // don't show viewer when preview is false
      if (!this.preview) {
        return;
      }
      // prevent body scroll
      prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      this.showViewer = true;
    },
    closeViewer: function closeViewer() {
      document.body.style.overflow = prevOverflow;
      this.showViewer = false;
    }
  }
};

/* script */
var __vue_script__ = script;

/* template */
var __vue_render__ = function __vue_render__() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", {
    staticClass: "el-image"
  }, [_vm.loading ? _vm._t("placeholder", [_c("div", {
    staticClass: "el-image__placeholder"
  })]) : _vm.error ? _vm._t("error", [_c("div", {
    staticClass: "el-image__error"
  }, [_vm._v(_vm._s(_vm.t("el.image.error")))])]) : _c("img", _vm._g(_vm._b({
    staticClass: "el-image__inner",
    class: {
      "el-image__inner--center": _vm.alignCenter,
      "el-image__preview": _vm.preview
    },
    style: _vm.imageStyle,
    attrs: {
      src: _vm.src
    },
    on: {
      click: _vm.clickHandler
    }
  }, "img", _vm.$attrs, false), _vm.$listeners)), _vm._v(" "), _vm.preview ? [_vm.showViewer ? _c("image-viewer", {
    attrs: {
      "z-index": _vm.zIndex,
      "initial-index": _vm.imageIndex,
      "on-close": _vm.closeViewer,
      "url-list": _vm.previewSrcList
    }
  }) : _vm._e()] : _vm._e()], 2);
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

/* style */
var __vue_inject_styles__ = undefined;
/* scoped */
var __vue_scope_id__ = undefined;
/* module identifier */
var __vue_module_identifier__ = undefined;
/* functional template */
var __vue_is_functional_template__ = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__ = /*#__PURE__*/__vue_normalize__({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, undefined, undefined);

/* istanbul ignore next */
__vue_component__.install = function (Vue) {
  Vue.component(__vue_component__.name, __vue_component__);
};

export { __vue_component__ as default };
