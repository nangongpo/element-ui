import MenuItem from 'element-ui/lib/utils/menu/aria-menuitem';

var Menu = function Menu(domNode) {
  this.domNode = domNode;
  this.init();
};
Menu.prototype.init = function () {
  var menuChildren = this.domNode.childNodes;
  [].filter.call(menuChildren, function (child) {
    return child.nodeType === 1;
  }).forEach(function (child) {
    new MenuItem(child); // eslint-disable-line
  });
};

export { Menu as default };
