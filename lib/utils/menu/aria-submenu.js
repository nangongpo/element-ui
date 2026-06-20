import AriaUtils from '../aria-utils.js';

var SubMenu = function SubMenu(parent, domNode) {
  this.domNode = domNode;
  this.parent = parent;
  this.subMenuItems = [];
  this.subIndex = 0;
  this.init();
};
SubMenu.prototype.init = function () {
  this.subMenuItems = this.domNode.querySelectorAll('li');
  this.addListeners();
};
SubMenu.prototype.gotoSubIndex = function (idx) {
  if (idx === this.subMenuItems.length) {
    idx = 0;
  } else if (idx < 0) {
    idx = this.subMenuItems.length - 1;
  }
  this.subMenuItems[idx].focus();
  this.subIndex = idx;
};
SubMenu.prototype.addListeners = function () {
  var keys = AriaUtils.keys;
  var parentNode = this.parent.domNode;
  Array.prototype.forEach.call(this.subMenuItems, el => {
    el.addEventListener('keydown', event => {
      var prevDef = false;
      switch (event.keyCode) {
        case keys.down:
          this.gotoSubIndex(this.subIndex + 1);
          prevDef = true;
          break;
        case keys.up:
          this.gotoSubIndex(this.subIndex - 1);
          prevDef = true;
          break;
        case keys.tab:
          AriaUtils.triggerEvent(parentNode, 'mouseleave');
          break;
        case keys.enter:
        case keys.space:
          prevDef = true;
          event.currentTarget.click();
          break;
      }
      if (prevDef) {
        event.preventDefault();
        event.stopPropagation();
      }
      return false;
    });
  });
};

export { SubMenu as default };
