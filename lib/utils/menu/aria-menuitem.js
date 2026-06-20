import AriaUtils from '../aria-utils.js';
import SubMenu from './aria-submenu.js';

var MenuItem = function MenuItem(domNode) {
  this.domNode = domNode;
  this.submenu = null;
  this.init();
};
MenuItem.prototype.init = function () {
  this.domNode.setAttribute('tabindex', '0');
  var menuChild = this.domNode.querySelector('.el-menu');
  if (menuChild) {
    this.submenu = new SubMenu(this, menuChild);
  }
  this.addListeners();
};
MenuItem.prototype.addListeners = function () {
  var keys = AriaUtils.keys;
  this.domNode.addEventListener('keydown', event => {
    var prevDef = false;
    switch (event.keyCode) {
      case keys.down:
        AriaUtils.triggerEvent(event.currentTarget, 'mouseenter');
        this.submenu && this.submenu.gotoSubIndex(0);
        prevDef = true;
        break;
      case keys.up:
        AriaUtils.triggerEvent(event.currentTarget, 'mouseenter');
        this.submenu && this.submenu.gotoSubIndex(this.submenu.subMenuItems.length - 1);
        prevDef = true;
        break;
      case keys.tab:
        AriaUtils.triggerEvent(event.currentTarget, 'mouseleave');
        break;
      case keys.enter:
      case keys.space:
        prevDef = true;
        event.currentTarget.click();
        break;
    }
    if (prevDef) {
      event.preventDefault();
    }
  });
};

export { MenuItem as default };
