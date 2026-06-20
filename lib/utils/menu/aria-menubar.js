import MenuItem from './aria-menuitem.js';
import '../aria-utils.js';
import './aria-submenu.js';

var Menu = function Menu(domNode) {
  this.domNode = domNode;
  this.init();
};
Menu.prototype.init = function () {
  var menuChildren = this.domNode.childNodes;
  [].filter.call(menuChildren, child => child.nodeType === 1).forEach(child => {
    new MenuItem(child); // eslint-disable-line
  });
};

export { Menu as default };
