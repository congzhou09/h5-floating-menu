import defaultConfig from './defaultConfig.js';

/**
 * @description 定义悬浮菜单的类
 **/
class H5FloatingMenu {
  /**
   * @constructor
   * @param {Obj} customConfig 初始化配置
   **/
  constructor(customConfig) {
    this.containerDOM = document.createElement('div');
    this.styleDOM = document.createElement('style');
    this.styleDOM.type = 'text/css';
    this.menuEntryDOM = null;
    this.maskDOM = document.createElement('div');
    this.menuItemsDOM = null;
    this.isDraggable = true;
    this.theConfig = !!customConfig && typeof customConfig === 'object' ? Object.assign(defaultConfig, customConfig) : defaultConfig; // 读取配置
    this.shellPositionTop = localStorage.getItem('h5-floating-menu-top');
    if (!this.shellPositionTop) {
      this.shellPositionTop = 0;
    }
    this.shellPositionLeft = localStorage.getItem('h5-floating-menu-left');
    if (!this.shellPositionLeft) {
      this.shellPositionLeft = 0;
    }

    // 页面载入完成时执行
    if (document.readyState === 'complete') {
      this.init();
    } else {
      window.addEventListener('load', () => {
        this.init();
      });
    }
  }
  /**
   * 初始化：创建元素，增加事件监听
   */
  init() {
    const menuItemsDOM = document.createElement('ul');
    menuItemsDOM.style.cssText = `position: absolute;display:none;padding:0;list-style-type:none;margin: calc(${this.theConfig.menuItemGap} + 1px) 0;`;
    for (let i = 0; i < this.theConfig.menuItems.length; i++) {
      const oneMenuItemDOM = document.createElement('li');
      oneMenuItemDOM.className = 'h5-floating-menu-item';
      if (H5FloatingMenu.supportTouch()) {
        oneMenuItemDOM.addEventListener('touchend', () => {
          eval(`${this.theConfig.menuItems[i].callback}`);
        });
      } else {
        oneMenuItemDOM.addEventListener('click', () => {
          eval(`${this.theConfig.menuItems[i].callback}`);
        });
      }

      oneMenuItemDOM.innerHTML = `
            ${this.theConfig.menuItems[i].icon}
            <span class="h5-floating-menu-item-text" style="position:absolute;width:max-content;font-size:${this.theConfig.menuItemTextFontSize}">
                    ${this.theConfig.menuItems[i].text}
                </span>`;
      menuItemsDOM.appendChild(oneMenuItemDOM);
    }

    // 添加元素
    this.containerDOM.className = 'h5-floating-menu-shell';
    this.containerDOM.innerHTML = `<div class="h5-floating-menu-item">${this.theConfig.mainIconClose}</div>`;
    this.containerDOM.style.cssText = '';
    this.containerDOM.appendChild(menuItemsDOM);
    this.menuEntryDOM = this.containerDOM.querySelector('.h5-floating-menu-item:nth-child(1)');
    this.menuItemsDOM = this.containerDOM.querySelector('ul:nth-of-type(1)');
    document.body.appendChild(this.containerDOM);

    this.maskDOM.className = 'h5-floating-menu-mask';
    this.maskDOM.style.cssText = `display:none;position:fixed;width:100%;height:100%;background-color:rgba(10, 10, 10, 0.69);top:0;left:0;z-index:${this.theConfig.zIndex};`;
    document.body.appendChild(this.maskDOM);
    // 可拖动
    this.makeDraggable(this.containerDOM);
    // 添加样式
    this.styleDOM.innerHTML = `
        .h5-floating-menu-shell::after{
            content:'';
            display:block;
            clear:both;
        }
        .h5-floating-menu-shell{
            position: fixed;
            top: ${this.shellPositionTop ? this.shellPositionTop : this.theConfig.initialTop};
            left: ${this.shellPositionLeft ? this.shellPositionLeft : this.theConfig.initialLeft};
            z-index:${this.theConfig.zIndex + 1};
            display: flex;
            flex-direction: column-reverse;
            justify-content: space-between;
            ${
              this.theConfig.landscopeMode
                ? 'transform: rotate(90deg);-ms-transform:rotate(90deg);-moz-transform:rotate(90deg);-webkit-transform:rotate(90deg);-o-transform:rotate(90deg);'
                : ''
            }
        }
        .h5-floating-menu-container-A, .h5-floating-menu-container-B{
            top: ${this.theConfig.menuItemSize};
        }
        .h5-floating-menu-container-C, .h5-floating-menu-container-D{
            bottom: ${this.theConfig.menuItemSize};
        }
        .h5-floating-menu-container-A .h5-floating-menu-item-text, .h5-floating-menu-container-C .h5-floating-menu-item-text{
            left:calc(${this.theConfig.menuItemSize} + 10px);
        }
        .h5-floating-menu-container-B .h5-floating-menu-item-text, .h5-floating-menu-container-D .h5-floating-menu-item-text{
            right:calc(${this.theConfig.menuItemSize} + 10px);
        }
        .h5-floating-menu-item{
            width: ${this.theConfig.menuItemSize};
            height: ${this.theConfig.menuItemSize};
            background-color: ${this.theConfig.menuItemBackgroundColor};
            color: ${this.theConfig.menuItemTextColor};
            border-radius: 50%;
            border: 1px solid #cfcccc;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: ${this.theConfig.menuItemGap} 0;
        }`;
    document.head.appendChild(this.styleDOM);
    // 子菜单弹出
    let isMenuShow = false;
    const halfWidth = document.documentElement.clientWidth / 2;
    const halfHeight = document.documentElement.clientHeight / 2;
    this.menuEntryDOM.addEventListener('h5-floating-menu-click', (e) => {
      if (!isMenuShow) {
        this.showMenu();
        this.menuItemsDOM.style.display = 'block';
        if (e.clientX < halfWidth) {
          if (e.clientY < halfHeight) {
            this.menuItemsDOM.className = this.theConfig.landscopeMode ? 'h5-floating-menu-container-C' : 'h5-floating-menu-container-A';
          } else {
            this.menuItemsDOM.className = this.theConfig.landscopeMode ? 'h5-floating-menu-container-D' : 'h5-floating-menu-container-C';
          }
        } else {
          if (e.clientY < halfHeight) {
            this.menuItemsDOM.className = this.theConfig.landscopeMode ? 'h5-floating-menu-container-A' : 'h5-floating-menu-container-B';
          } else {
            this.menuItemsDOM.className = this.theConfig.landscopeMode ? 'h5-floating-menu-container-B' : 'h5-floating-menu-container-D';
          }
        }
        isMenuShow = true;
        this.isDraggable = false;
      } else {
        this.hideMenu();
        this.menuItemsDOM.style.display = 'none';
        isMenuShow = false;
        this.isDraggable = true;
      }
    });
  }
  /**
   * 菜单整体隐藏
   */
  hideWhole() {
    this.containerDOM.style.display = 'none';
  }
  /**
   * 菜单整体显现
   */
  showWhole() {
    this.containerDOM.style.display = 'block';
  }
  /**
   * @return {boolean} 当前是否支持触摸
   */
  static supportTouch() {
    return 'ontouchstart' in document.documentElement;
  }
  /**
   * 展开菜单子菜单
   */
  showMenu() {
    if (this.maskDOM) {
      this.maskDOM.style.display = 'block';
      this.menuEntryDOM.innerHTML = this.theConfig.mainIconOpen;
    }
  }
  /**
   * 收起菜单子菜单
   */
  hideMenu() {
    if (this.maskDOM) {
      this.maskDOM.style.display = 'none';
      this.menuEntryDOM.innerHTML = this.theConfig.mainIconClose;
    }
  }
  /**
   * 使某个html元素可拖拽（支持触摸与非触摸情况）
   * @param {htmlElement} oneHtmlDOM 使可拖拽的html元素
   */
  makeDraggable(oneHtmlDOM) {
    let distanceX;
    let distanceY;
    let isMouseDown = false;
    let hasMouseMoved = false;
    let startX;
    let startY;

    /**
     * 记录起始信息
     * @param {event} e 事件回调函数参数
     * startX 鼠标点击或触摸的起始位置的X坐标
     * distanceX 被拖拽元素的左边缘的X坐标
     * isMouseDown 鼠标被按下或触摸屏被压下
     */
    const startFun = (e) => {
      hasMouseMoved = false;
      if (e.type === 'touchstart') {
        startX = e.touches[0].pageX;
        startY = e.touches[0].pageY;
      } else {
        startX = e.pageX;
        startY = e.pageY;
      }
      distanceX = startX - oneHtmlDOM.offsetLeft;
      distanceY = startY - oneHtmlDOM.offsetTop;
      isMouseDown = true;
    };
    /**
     * 记录拖拽or长按期间信息
     * @param {event} e 事件回调函数参数
     * curX 鼠标或触摸点的当前位置的X坐标
     * hasMouseMoved 鼠标或触摸点是否有位移，用于区分拖拽和点击
     */
    const moveFun = (e) => {
      if (isMouseDown && this.isDraggable) {
        let curX;
        let curY;
        if (e.type === 'touchmove') {
          curX = e.touches[0].pageX;
          curY = e.touches[0].pageY;
        } else {
          curX = e.pageX;
          curY = e.pageY;
        }
        if (startX !== curX || startY !== curY) {
          hasMouseMoved = true;
        }
        let elemLeft = curX - distanceX < 0 ? 0 : curX - distanceX;
        let elemTop = curY - distanceY < 0 ? 0 : curY - distanceY;
        if (elemLeft + oneHtmlDOM.offsetWidth > document.documentElement.clientWidth) {
          elemLeft = document.documentElement.clientWidth - oneHtmlDOM.offsetWidth;
        }
        if (elemTop + oneHtmlDOM.offsetHeight > document.documentElement.clientHeight) {
          elemTop = document.documentElement.clientHeight - oneHtmlDOM.offsetHeight;
        }
        oneHtmlDOM.style.left = elemLeft + 'px';
        oneHtmlDOM.style.top = elemTop + 'px';
        e.preventDefault();
      }
    };
    /**
     * 拖拽结束处理
     * @param {event} e 事件回调函数参数
     * curX 鼠标或触摸点的当前位置的X坐标
     * hasMouseMoved 鼠标或触摸点是否有位移，用于区分拖拽和点击
     */
    const endFun = (e) => {
      // 触发自定义click事件
      if (!hasMouseMoved) {
        // if (e.changedTouches) {
        /* ontouchend之后，系统会判断接收到事件的element的内容是否被改变，如果内容被改变，接下来的事 件都不会触发，如果没有改变，会按照mousedown，mouseup，click的顺序触发事件*/
        // touchend和mouseup都触发的时候只处理mouseup
        // return;
        // 某些前端库(如fastclick)会阻止这个触发mouse相关事件的默认行为，不再使用之前的过滤机制
        // }
        if (isMouseDown) {
          let clickX;
          let clickY;
          if (e.type === 'touchend') {
            clickX = e.changedTouches[0].clientX;
            clickY = e.changedTouches[0].clientY;
          } else {
            clickX = e.clientX;
            clickY = e.clientY;
          }

          // 触发自定义click事件
          this.menuEntryDOM.dispatchEvent(
            new MouseEvent('h5-floating-menu-click', {
              bubbles: true,
              cancelable: true,
              view: window,
              clientX: clickX,
              clientY: clickY
            })
          );
        }
      } else {
        localStorage.setItem('h5-floating-menu-top', oneHtmlDOM.style.top);
        localStorage.setItem('h5-floating-menu-left', oneHtmlDOM.style.left);
      }
      isMouseDown = false;
    };

    if (H5FloatingMenu.supportTouch()) {
      oneHtmlDOM.addEventListener('touchstart', startFun);
      oneHtmlDOM.addEventListener('touchmove', moveFun);
      oneHtmlDOM.addEventListener('touchend', endFun);
    } else {
      oneHtmlDOM.addEventListener('mousedown', startFun);
      document.addEventListener('mousemove', moveFun);
      document.addEventListener('mouseup', endFun);
    }
  }
}

export default H5FloatingMenu;
