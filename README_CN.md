[![npm version](https://badge.fury.io/js/h5-floating-menu.svg)](https://badge.fury.io/js/h5-floating-menu)

### 简介
通用的H5浮动菜单，独立运行不依赖于第三方库，兼容PC端Web，根据菜单在页面的位置以不被遮挡的方式展示菜单项的图标和文字，支持拖动与配置。

![](https://raw.githubusercontent.com/congzhou09/h5-floating-menu/HEAD/snapshot/autoadaptation.gif)

### 使用

下载或通过npm（__npm install h5-floating-menu__）安装，
```
// 初始化，指定配置
import H5FloatingMenu from 'h5-floating-menu';
new H5FloatingMenu([_menuConfig_]);

```
或者通过script标签引入，
```
<script src="_path/to/h5-floating-menu.min.js_"></script>
<script>
// 初始化，指定配置
new H5FloatingMenu([_menuConfig_]);
</script>
```

可配置项如下：

|配置项|描述|类型|默认值|
|:-:|:-:|:-:|:-:|
|zIndex|css属性的z-index|数字|11|
|initialLeft|菜单初始位置，css属性的left|数字或字符串|'50%'|
|initialTop|菜单初始位置，css属性的top|数字或字符串|'50%'|
|menuItemSize|菜单项的大小|字符串|'50px'|
|menuItemGap|菜单项的间距|字符串|'6px'|
|menuItemBackgroundColor|菜单项的背景色|字符串|'#fcfcfd'|
|menuItemTextColor|菜单项的字体颜色|字符串|'#eaffee'|
|menuItemTextFontSize|菜单项的字体大小|字符串|'14px'|
|mainIconClose|菜单未展开时的主图标|字符串|'<svg ...此处省略.../svg>'|
|mainIconOpen|菜单展开时的主图标|字符串|'<svg ...此处省略.../svg>'|
|menuItems|菜单项|对象数组|[{...每个对象的属性如下...}]|

菜单项对象的属性如下：

|属性|描述|类型|
|:-:|:-:|:-:|
|icon|菜单项图标|字符串|
|text|菜单项文字|字符串|
|callback|菜单项点击回调JS|字符串，如 \`console.log('客服');\`|

