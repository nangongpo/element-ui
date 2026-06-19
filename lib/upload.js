import Locale from 'element-ui/lib/mixins/locale.js';
import ElProgress from 'element-ui/lib/progress.js';
import __vue_normalize__ from 'vue-runtime-helpers/dist/normalize-component.mjs';
import Migrating from 'element-ui/lib/mixins/migrating.js';

function _extends(){return _extends=Object.assign||function(a){for(var b,c=1;c<arguments.length;c++)for(var d in b=arguments[c],b)Object.prototype.hasOwnProperty.call(b,d)&&(a[d]=b[d]);return a},_extends.apply(this,arguments)}var normalMerge=["attrs","props","domProps"],toArrayMerge=["class","style","directives"],functionalMerge=["on","nativeOn"],mergeJsxProps=function(a){return a.reduce(function(c,a){for(var b in a)if(!c[b])c[b]=a[b];else if(-1!==normalMerge.indexOf(b))c[b]=_extends({},c[b],a[b]);else if(-1!==toArrayMerge.indexOf(b)){var d=c[b]instanceof Array?c[b]:[c[b]],e=a[b]instanceof Array?a[b]:[a[b]];c[b]=d.concat(e);}else if(-1!==functionalMerge.indexOf(b)){for(var f in a[b])if(c[b][f]){var g=c[b][f]instanceof Array?c[b][f]:[c[b][f]],h=a[b][f]instanceof Array?a[b][f]:[a[b][f]];c[b][f]=g.concat(h);}else c[b][f]=a[b][f];}else if("hook"==b)for(var i in a[b])c[b][i]=c[b][i]?mergeFn(c[b][i],a[b][i]):a[b][i];else c[b]=a[b];return c},{})},mergeFn=function(a,b){return function(){a&&a.apply(this,arguments),b&&b.apply(this,arguments);}};var helper=mergeJsxProps;

//
var script$3 = {
  name: 'ElUploadList',
  mixins: [Locale],
  data: function data() {
    return {
      focusing: false
    };
  },
  components: {
    ElProgress: ElProgress
  },
  props: {
    files: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    handlePreview: Function,
    listType: String
  },
  methods: {
    parsePercentage: function parsePercentage(val) {
      return parseInt(val, 10);
    },
    handleClick: function handleClick(file) {
      this.handlePreview && this.handlePreview(file);
    }
  }
};

/* script */
var __vue_script__$3 = script$3;

/* template */
var __vue_render__$1 = function __vue_render__() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("transition-group", {
    class: ["el-upload-list", "el-upload-list--" + _vm.listType, {
      "is-disabled": _vm.disabled
    }],
    attrs: {
      tag: "ul",
      name: "el-list"
    }
  }, _vm._l(_vm.files, function (file) {
    return _c("li", {
      key: file.uid,
      class: ["el-upload-list__item", "is-" + file.status, _vm.focusing ? "focusing" : ""],
      attrs: {
        tabindex: "0"
      },
      on: {
        keydown: function keydown($event) {
          if (!("button" in $event) && _vm._k($event.keyCode, "delete", [8, 46], $event.key, ["Backspace", "Delete", "Del"])) {
            return null;
          }
          !_vm.disabled && _vm.$emit("remove", file);
        },
        focus: function focus($event) {
          _vm.focusing = true;
        },
        blur: function blur($event) {
          _vm.focusing = false;
        },
        click: function click($event) {
          _vm.focusing = false;
        }
      }
    }, [_vm._t("default", [file.status !== "uploading" && ["picture-card", "picture"].indexOf(_vm.listType) > -1 ? _c("img", {
      staticClass: "el-upload-list__item-thumbnail",
      attrs: {
        src: file.url,
        alt: ""
      }
    }) : _vm._e(), _vm._v(" "), _c("a", {
      staticClass: "el-upload-list__item-name",
      on: {
        click: function click($event) {
          _vm.handleClick(file);
        }
      }
    }, [_c("i", {
      staticClass: "el-icon-document"
    }), _vm._v(_vm._s(file.name) + "\n      ")]), _vm._v(" "), _c("label", {
      staticClass: "el-upload-list__item-status-label"
    }, [_c("i", {
      class: {
        "el-icon-upload-success": true,
        "el-icon-circle-check": _vm.listType === "text",
        "el-icon-check": ["picture-card", "picture"].indexOf(_vm.listType) > -1
      }
    })]), _vm._v(" "), !_vm.disabled ? _c("i", {
      staticClass: "el-icon-close",
      on: {
        click: function click($event) {
          _vm.$emit("remove", file);
        }
      }
    }) : _vm._e(), _vm._v(" "), !_vm.disabled ? _c("i", {
      staticClass: "el-icon-close-tip"
    }, [_vm._v(_vm._s(_vm.t("el.upload.deleteTip")))]) : _vm._e(), _vm._v(" "), file.status === "uploading" ? _c("el-progress", {
      attrs: {
        type: _vm.listType === "picture-card" ? "circle" : "line",
        "stroke-width": _vm.listType === "picture-card" ? 6 : 2,
        percentage: _vm.parsePercentage(file.percentage)
      }
    }) : _vm._e(), _vm._v(" "), _vm.listType === "picture-card" ? _c("span", {
      staticClass: "el-upload-list__item-actions"
    }, [_vm.handlePreview && _vm.listType === "picture-card" ? _c("span", {
      staticClass: "el-upload-list__item-preview",
      on: {
        click: function click($event) {
          _vm.handlePreview(file);
        }
      }
    }, [_c("i", {
      staticClass: "el-icon-zoom-in"
    })]) : _vm._e(), _vm._v(" "), !_vm.disabled ? _c("span", {
      staticClass: "el-upload-list__item-delete",
      on: {
        click: function click($event) {
          _vm.$emit("remove", file);
        }
      }
    }, [_c("i", {
      staticClass: "el-icon-delete"
    })]) : _vm._e()]) : _vm._e()], {
      file: file
    })], 2);
  }), 0);
};
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

/* style */
var __vue_inject_styles__$3 = undefined;
/* scoped */
var __vue_scope_id__$3 = undefined;
/* module identifier */
var __vue_module_identifier__$3 = undefined;
/* functional template */
var __vue_is_functional_template__$3 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$3 = /*#__PURE__*/__vue_normalize__({
  render: __vue_render__$1,
  staticRenderFns: __vue_staticRenderFns__$1
}, __vue_inject_styles__$3, __vue_script__$3, __vue_scope_id__$3, __vue_is_functional_template__$3, __vue_module_identifier__$3, false, undefined, undefined, undefined);

function getError(action, option, xhr) {
  var msg;
  if (xhr.response) {
    msg = "".concat(xhr.response.error || xhr.response);
  } else if (xhr.responseText) {
    msg = "".concat(xhr.responseText);
  } else {
    msg = "fail to post ".concat(action, " ").concat(xhr.status);
  }
  var err = new Error(msg);
  err.status = xhr.status;
  err.method = 'post';
  err.url = action;
  return err;
}
function getBody(xhr) {
  var text = xhr.responseText || xhr.response;
  if (!text) {
    return text;
  }
  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
}
function upload(option) {
  if (typeof XMLHttpRequest === 'undefined') {
    return;
  }
  var xhr = new XMLHttpRequest();
  var action = option.action;
  if (xhr.upload) {
    xhr.upload.onprogress = function progress(e) {
      if (e.total > 0) {
        e.percent = e.loaded / e.total * 100;
      }
      option.onProgress(e);
    };
  }
  var formData = new FormData();
  if (option.data) {
    Object.keys(option.data).forEach(function (key) {
      formData.append(key, option.data[key]);
    });
  }
  formData.append(option.filename, option.file, option.file.name);
  xhr.onerror = function error(e) {
    option.onError(e);
  };
  xhr.onload = function onload() {
    if (xhr.status < 200 || xhr.status >= 300) {
      return option.onError(getError(action, option, xhr));
    }
    option.onSuccess(getBody(xhr));
  };
  xhr.open('post', action, true);
  if (option.withCredentials && 'withCredentials' in xhr) {
    xhr.withCredentials = true;
  }
  var headers = option.headers || {};
  for (var item in headers) {
    if (headers.hasOwnProperty(item) && headers[item] !== null) {
      xhr.setRequestHeader(item, headers[item]);
    }
  }
  xhr.send(formData);
  return xhr;
}

//
//
//
//
//
//
//
//
//
//
//
//
//

var script$2 = {
  name: 'ElUploadDrag',
  props: {
    disabled: Boolean
  },
  inject: {
    uploader: {
      default: ''
    }
  },
  data: function data() {
    return {
      dragover: false
    };
  },
  methods: {
    onDragover: function onDragover() {
      if (!this.disabled) {
        this.dragover = true;
      }
    },
    onDrop: function onDrop(e) {
      if (this.disabled || !this.uploader) return;
      var accept = this.uploader.accept;
      this.dragover = false;
      if (!accept) {
        this.$emit('file', e.dataTransfer.files);
        return;
      }
      this.$emit('file', [].slice.call(e.dataTransfer.files).filter(function (file) {
        var type = file.type,
          name = file.name;
        var extension = name.indexOf('.') > -1 ? ".".concat(name.split('.').pop()) : '';
        var baseType = type.replace(/\/.*$/, '');
        return accept.split(',').map(function (type) {
          return type.trim();
        }).filter(function (type) {
          return type;
        }).some(function (acceptedType) {
          if (/\..+$/.test(acceptedType)) {
            return extension === acceptedType;
          }
          if (/\/\*$/.test(acceptedType)) {
            return baseType === acceptedType.replace(/\/\*$/, '');
          }
          if (/^[^\/]+\/[^\/]+$/.test(acceptedType)) {
            return type === acceptedType;
          }
          return false;
        });
      }));
    }
  }
};

/* script */
var __vue_script__$2 = script$2;

/* template */
var __vue_render__ = function __vue_render__() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", {
    staticClass: "el-upload-dragger",
    class: {
      "is-dragover": _vm.dragover
    },
    on: {
      drop: function drop($event) {
        $event.preventDefault();
        return _vm.onDrop($event);
      },
      dragover: function dragover($event) {
        $event.preventDefault();
        return _vm.onDragover($event);
      },
      dragleave: function dragleave($event) {
        $event.preventDefault();
        _vm.dragover = false;
      }
    }
  }, [_vm._t("default")], 2);
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

/* style */
var __vue_inject_styles__$2 = undefined;
/* scoped */
var __vue_scope_id__$2 = undefined;
/* module identifier */
var __vue_module_identifier__$2 = undefined;
/* functional template */
var __vue_is_functional_template__$2 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$2 = /*#__PURE__*/__vue_normalize__({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__$2, __vue_script__$2, __vue_scope_id__$2, __vue_is_functional_template__$2, __vue_module_identifier__$2, false, undefined, undefined, undefined);

var script$1 = {
  inject: ['uploader'],
  components: {
    UploadDragger: __vue_component__$2
  },
  props: {
    type: String,
    action: {
      type: String,
      required: true
    },
    name: {
      type: String,
      default: 'file'
    },
    data: Object,
    headers: Object,
    withCredentials: Boolean,
    multiple: Boolean,
    accept: String,
    onStart: Function,
    onProgress: Function,
    onSuccess: Function,
    onError: Function,
    beforeUpload: Function,
    drag: Boolean,
    onPreview: {
      type: Function,
      default: function _default() {}
    },
    onRemove: {
      type: Function,
      default: function _default() {}
    },
    fileList: Array,
    autoUpload: Boolean,
    listType: String,
    httpRequest: {
      type: Function,
      default: upload
    },
    disabled: Boolean,
    limit: Number,
    onExceed: Function
  },
  data: function data() {
    return {
      mouseover: false,
      reqs: {}
    };
  },
  methods: {
    isImage: function isImage(str) {
      return str.indexOf('image') !== -1;
    },
    handleChange: function handleChange(ev) {
      var files = ev.target.files;
      if (!files) return;
      this.uploadFiles(files);
    },
    uploadFiles: function uploadFiles(files) {
      var _this = this;
      if (this.limit && this.fileList.length + files.length > this.limit) {
        this.onExceed && this.onExceed(files, this.fileList);
        return;
      }
      var postFiles = Array.prototype.slice.call(files);
      if (!this.multiple) {
        postFiles = postFiles.slice(0, 1);
      }
      if (postFiles.length === 0) {
        return;
      }
      postFiles.forEach(function (rawFile) {
        _this.onStart(rawFile);
        if (_this.autoUpload) _this.upload(rawFile);
      });
    },
    upload: function upload(rawFile) {
      var _this2 = this;
      this.$refs.input.value = null;
      if (!this.beforeUpload) {
        return this.post(rawFile);
      }
      var before = this.beforeUpload(rawFile);
      if (before && before.then) {
        before.then(function (processedFile) {
          var fileType = Object.prototype.toString.call(processedFile);
          if (fileType === '[object File]' || fileType === '[object Blob]') {
            if (fileType === '[object Blob]') {
              processedFile = new File([processedFile], rawFile.name, {
                type: rawFile.type
              });
            }
            for (var p in rawFile) {
              if (rawFile.hasOwnProperty(p)) {
                processedFile[p] = rawFile[p];
              }
            }
            _this2.post(processedFile);
          } else {
            _this2.post(rawFile);
          }
        }, function () {
          _this2.onRemove(null, rawFile);
        });
      } else if (before !== false) {
        this.post(rawFile);
      } else {
        this.onRemove(null, rawFile);
      }
    },
    abort: function abort(file) {
      var reqs = this.reqs;
      if (file) {
        var uid = file;
        if (file.uid) uid = file.uid;
        if (reqs[uid]) {
          reqs[uid].abort();
        }
      } else {
        Object.keys(reqs).forEach(function (uid) {
          if (reqs[uid]) reqs[uid].abort();
          delete reqs[uid];
        });
      }
    },
    post: function post(rawFile) {
      var _this3 = this;
      var uid = rawFile.uid;
      var options = {
        headers: this.headers,
        withCredentials: this.withCredentials,
        file: rawFile,
        data: this.data,
        filename: this.name,
        action: this.action,
        onProgress: function onProgress(e) {
          _this3.onProgress(e, rawFile);
        },
        onSuccess: function onSuccess(res) {
          _this3.onSuccess(res, rawFile);
          delete _this3.reqs[uid];
        },
        onError: function onError(err) {
          _this3.onError(err, rawFile);
          delete _this3.reqs[uid];
        }
      };
      var req = this.httpRequest(options);
      this.reqs[uid] = req;
      if (req && req.then) {
        req.then(options.onSuccess, options.onError);
      }
    },
    handleClick: function handleClick() {
      if (!this.disabled) {
        this.$refs.input.value = null;
        this.$refs.input.click();
      }
    },
    handleKeydown: function handleKeydown(e) {
      if (e.target !== e.currentTarget) return;
      if (e.keyCode === 13 || e.keyCode === 32) {
        this.handleClick();
      }
    }
  },
  render: function render(h) {
    var handleClick = this.handleClick,
      drag = this.drag,
      name = this.name,
      handleChange = this.handleChange,
      multiple = this.multiple,
      accept = this.accept,
      listType = this.listType,
      uploadFiles = this.uploadFiles,
      disabled = this.disabled,
      handleKeydown = this.handleKeydown;
    var data = {
      class: {
        'el-upload': true
      },
      on: {
        click: handleClick,
        keydown: handleKeydown
      }
    };
    data.class["el-upload--".concat(listType)] = true;
    return h("div", helper([{}, data, {
      "attrs": {
        "tabindex": "0"
      }
    }]), [drag ? h("upload-dragger", {
      "attrs": {
        "disabled": disabled
      },
      "on": {
        "file": uploadFiles
      }
    }, [this.$slots.default]) : this.$slots.default, h("input", {
      "class": "el-upload__input",
      "attrs": {
        "type": "file",
        "name": name,
        "multiple": multiple,
        "accept": accept
      },
      "ref": "input",
      "on": {
        "change": handleChange
      }
    })]);
  }
};

/* script */
var __vue_script__$1 = script$1;

/* template */

/* style */
var __vue_inject_styles__$1 = undefined;
/* scoped */
var __vue_scope_id__$1 = undefined;
/* module identifier */
var __vue_module_identifier__$1 = undefined;
/* functional template */
var __vue_is_functional_template__$1 = undefined;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$1 = /*#__PURE__*/__vue_normalize__({}, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, false, undefined, undefined, undefined);

function noop() {}
var script = {
  name: 'ElUpload',
  mixins: [Migrating],
  components: {
    ElProgress: ElProgress,
    UploadList: __vue_component__$3,
    Upload: __vue_component__$1
  },
  provide: function provide() {
    return {
      uploader: this
    };
  },
  inject: {
    elForm: {
      default: ''
    }
  },
  props: {
    action: {
      type: String,
      required: true
    },
    headers: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    data: Object,
    multiple: Boolean,
    name: {
      type: String,
      default: 'file'
    },
    drag: Boolean,
    dragger: Boolean,
    withCredentials: Boolean,
    showFileList: {
      type: Boolean,
      default: true
    },
    accept: String,
    type: {
      type: String,
      default: 'select'
    },
    beforeUpload: Function,
    beforeRemove: Function,
    onRemove: {
      type: Function,
      default: noop
    },
    onChange: {
      type: Function,
      default: noop
    },
    onPreview: {
      type: Function
    },
    onSuccess: {
      type: Function,
      default: noop
    },
    onProgress: {
      type: Function,
      default: noop
    },
    onError: {
      type: Function,
      default: noop
    },
    fileList: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    autoUpload: {
      type: Boolean,
      default: true
    },
    listType: {
      type: String,
      default: 'text' // text,picture,picture-card
    },
    httpRequest: Function,
    disabled: Boolean,
    limit: Number,
    onExceed: {
      type: Function,
      default: noop
    }
  },
  data: function data() {
    return {
      uploadFiles: [],
      dragOver: false,
      draging: false,
      tempIndex: 1
    };
  },
  computed: {
    uploadDisabled: function uploadDisabled() {
      return this.disabled || (this.elForm || {}).disabled;
    }
  },
  watch: {
    listType: function listType(type) {
      if (type === 'picture-card' || type === 'picture') {
        this.uploadFiles = this.uploadFiles.map(function (file) {
          if (!file.url && file.raw) {
            try {
              file.url = URL.createObjectURL(file.raw);
            } catch (err) {
              console.error('[Element Error][Upload]', err);
            }
          }
          return file;
        });
      }
    },
    fileList: {
      immediate: true,
      handler: function handler(fileList) {
        var _this = this;
        this.uploadFiles = fileList.map(function (item) {
          item.uid = item.uid || Date.now() + _this.tempIndex++;
          item.status = item.status || 'success';
          return item;
        });
      }
    }
  },
  methods: {
    handleStart: function handleStart(rawFile) {
      rawFile.uid = Date.now() + this.tempIndex++;
      var file = {
        status: 'ready',
        name: rawFile.name,
        size: rawFile.size,
        percentage: 0,
        uid: rawFile.uid,
        raw: rawFile
      };
      if (this.listType === 'picture-card' || this.listType === 'picture') {
        try {
          file.url = URL.createObjectURL(rawFile);
        } catch (err) {
          console.error('[Element Error][Upload]', err);
          return;
        }
      }
      this.uploadFiles.push(file);
      this.onChange(file, this.uploadFiles);
    },
    handleProgress: function handleProgress(ev, rawFile) {
      var file = this.getFile(rawFile);
      this.onProgress(ev, file, this.uploadFiles);
      file.status = 'uploading';
      file.percentage = ev.percent || 0;
    },
    handleSuccess: function handleSuccess(res, rawFile) {
      var file = this.getFile(rawFile);
      if (file) {
        file.status = 'success';
        file.response = res;
        this.onSuccess(res, file, this.uploadFiles);
        this.onChange(file, this.uploadFiles);
      }
    },
    handleError: function handleError(err, rawFile) {
      var file = this.getFile(rawFile);
      var fileList = this.uploadFiles;
      file.status = 'fail';
      fileList.splice(fileList.indexOf(file), 1);
      this.onError(err, file, this.uploadFiles);
      this.onChange(file, this.uploadFiles);
    },
    handleRemove: function handleRemove(file, raw) {
      var _this2 = this;
      if (raw) {
        file = this.getFile(raw);
      }
      var doRemove = function doRemove() {
        _this2.abort(file);
        var fileList = _this2.uploadFiles;
        fileList.splice(fileList.indexOf(file), 1);
        _this2.onRemove(file, fileList);
      };
      if (!this.beforeRemove) {
        doRemove();
      } else if (typeof this.beforeRemove === 'function') {
        var before = this.beforeRemove(file, this.uploadFiles);
        if (before && before.then) {
          before.then(function () {
            doRemove();
          }, noop);
        } else if (before !== false) {
          doRemove();
        }
      }
    },
    getFile: function getFile(rawFile) {
      var fileList = this.uploadFiles;
      var target;
      fileList.every(function (item) {
        target = rawFile.uid === item.uid ? item : null;
        return !target;
      });
      return target;
    },
    abort: function abort(file) {
      this.$refs['upload-inner'].abort(file);
    },
    clearFiles: function clearFiles() {
      this.uploadFiles = [];
    },
    submit: function submit() {
      var _this3 = this;
      this.uploadFiles.filter(function (file) {
        return file.status === 'ready';
      }).forEach(function (file) {
        _this3.$refs['upload-inner'].upload(file.raw);
      });
    },
    getMigratingConfig: function getMigratingConfig() {
      return {
        props: {
          'default-file-list': 'default-file-list is renamed to file-list.',
          'show-upload-list': 'show-upload-list is renamed to show-file-list.',
          'thumbnail-mode': 'thumbnail-mode has been deprecated, you can implement the same effect according to this case: http://element.eleme.io/#/zh-CN/component/upload#yong-hu-tou-xiang-shang-chuan'
        }
      };
    }
  },
  beforeDestroy: function beforeDestroy() {
    this.uploadFiles.forEach(function (file) {
      if (file.url && file.url.indexOf('blob:') === 0) {
        URL.revokeObjectURL(file.url);
      }
    });
  },
  render: function render(h) {
    var _this4 = this;
    var uploadList;
    if (this.showFileList) {
      uploadList = h(__vue_component__$3, {
        "attrs": {
          "disabled": this.uploadDisabled,
          "listType": this.listType,
          "files": this.uploadFiles,
          "handlePreview": this.onPreview
        },
        "on": {
          "remove": this.handleRemove
        }
      }, [function (props) {
        if (_this4.$scopedSlots.file) {
          return _this4.$scopedSlots.file({
            file: props.file
          });
        }
      }]);
    }
    var uploadData = {
      props: {
        type: this.type,
        drag: this.drag,
        action: this.action,
        multiple: this.multiple,
        'before-upload': this.beforeUpload,
        'with-credentials': this.withCredentials,
        headers: this.headers,
        name: this.name,
        data: this.data,
        accept: this.accept,
        fileList: this.uploadFiles,
        autoUpload: this.autoUpload,
        listType: this.listType,
        disabled: this.uploadDisabled,
        limit: this.limit,
        'on-exceed': this.onExceed,
        'on-start': this.handleStart,
        'on-progress': this.handleProgress,
        'on-success': this.handleSuccess,
        'on-error': this.handleError,
        'on-preview': this.onPreview,
        'on-remove': this.handleRemove,
        'http-request': this.httpRequest
      },
      ref: 'upload-inner'
    };
    var trigger = this.$slots.trigger || this.$slots.default;
    var uploadComponent = h("upload", helper([{}, uploadData]), [trigger]);
    return h("div", [this.listType === 'picture-card' ? uploadList : '', this.$slots.trigger ? [uploadComponent, this.$slots.default] : uploadComponent, this.$slots.tip, this.listType !== 'picture-card' ? uploadList : '']);
  }
};

/* script */
var __vue_script__ = script;

/* template */

/* style */
var __vue_inject_styles__ = undefined;
/* scoped */
var __vue_scope_id__ = undefined;
/* module identifier */
var __vue_module_identifier__ = undefined;
/* functional template */
var __vue_is_functional_template__ = undefined;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__ = /*#__PURE__*/__vue_normalize__({}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, undefined, undefined);

/* istanbul ignore next */
__vue_component__.install = function (Vue) {
  Vue.component(__vue_component__.name, __vue_component__);
};

export { __vue_component__ as default };
