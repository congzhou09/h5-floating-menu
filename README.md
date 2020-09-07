English | [简体中文](https://github.com/congzhou09/h5-floating-menu/blob/HEAD/README_CN.md)

[![npm version](https://badge.fury.io/js/h5-floating-menu.svg)](https://badge.fury.io/js/h5-floating-menu)

### Intro
A common floating H5 menu, independent of any third-part libraries, compatibility with PC Web, showing the text and icon of menu items in a no-blocked way based on the location of the menu, support for drag and configuration.

![autoadaptation demo gif](https://congzhou09.github.io/h5-floating-menu/snapshot/autoadaptation.gif)

### Usage

Download or install via npm (__npm install h5-floating-menu__)
```
// initialization, set the configuration
import H5FloatingMenu from 'h5-floating-menu';
new H5FloatingMenu([_menuConfig_]);
```
Or import via script element:
```
<script src="_path/to/h5-floating-menu.min.js_"></script>
<script>
// initialization, set the configuration
new H5FloatingMenu([_menuConfig_]);
</script>
```

the configuration properties are as follows：

|property|description|type|default|
|:-:|:-:|:-:|:-:|
|zIndex|'z-index' property in css|number|11|
|landscopeMode|whether 'landscope' mode|boolean|false|
|initialLeft|initial location of the menu, 'left'property in css|number or string|'50%'|
|initialTop|initial location of the menu, 'top'property in css|number or string|'50%'|
|menuItemSize|size of the menu item|string|'50px'|
|menuItemGap|gap size of the menu item|string|'6px'|
|menuItemBackgroundColor|background color of the menu item|string|'#fcfcfd'|
|menuItemTextColor|font color of the menu item|string|'#eaffee'|
|menuItemTextFontSize|font size of of the menu item|string|'14px'|
|mainIconClose|main icon of the menu when the menu is folded |string|'<svg ...omitted.../svg>'|
|mainIconOpen|main icon of the menu when the menu is unfolded|string|'<svg ...omitted.../svg>'|
|menuItems|menu items|object array|[{...properties of each object is blow...}]|

properties of the menuItems is as follows：

|property|description|type|
|:-:|:-:|:-:|
|icon|icon of the menu item|string|
|text|text of the menu item|string|
|callback|callback js script of the menu item after clicking|string. e.g, \`console.log('customer service');\`|

### Function

#### hideWhole()
hide the whole menu.

#### showWhole()
show the whole menu.
