import defaultConfig from './defaultConfig.js'

//检查浏览器环境
if(!window||!document)
{
    throw new Error('h5-floating-menu info: only support for browser!');
}

class H5FloatingMenu{
    constructor(customConfig){
        this.containerDOM = document.createElement('div');
        this.menuEntryDOM = null;
        this.maskDOM = document.createElement('div');
        this.menuItemsDOM = null;
        this.isDraggable = true;
        this.theConfig =(!!customConfig&&typeof(customConfig)==='object')?Object.assign(defaultConfig, customConfig):defaultConfig;//读取配置
    
        //页面载入完成时执行
        if(document.readyState === 'complete')
        {
            this.init();
        }
        else
        {
            window.addEventListener('load', ()=>{
                this.init();
            });
        }
    }
    init(){
        let menuItemsHTML= `<ul style="position: absolute;display:none;padding:0;list-style-type:none;margin: calc(${this.theConfig.menuItemGap} + 1px) 0;">`;
        for(let i=0;i<this.theConfig.menuItems.length;i++)
        {
            menuItemsHTML += `<div class="h5-floating-menu-item" style="" onclick="${this.theConfig.menuItems[i].callback}">
                ${this.theConfig.menuItems[i].icon}
                <span class="h5-floating-menu-item-text" style="position:absolute;width:max-content;font-size:${this.theConfig.menuItemTextFontSize}">
                    ${this.theConfig.menuItems[i].text}
                </span>
            </div>`;
        }
        menuItemsHTML += `</ul>`;
    
        //添加元素
        this.containerDOM.className = 'h5-floating-menu-shell';
        this.containerDOM.innerHTML = `<div class="h5-floating-menu-item">${this.theConfig.mainIconClose}</div>${menuItemsHTML}`;
        this.containerDOM.style.cssText = '';
        this.menuEntryDOM = this.containerDOM.querySelector('.h5-floating-menu-item:nth-child(1)');
        this.menuItemsDOM = this.containerDOM.querySelector('ul:nth-of-type(1)');
        document.body.appendChild(this.containerDOM);
        
        this.maskDOM.className = 'h5-floating-menu-mask';
        this.maskDOM.style.cssText = `display:none;position:fixed;width:100%;height:100%;background-color:rgba(10, 10, 10, 0.69);top:0;left:0;z-index:${this.theConfig.zIndex};`;
        document.body.appendChild(this.maskDOM);
        //可拖动
        this.makeDraggable(this.containerDOM);
        //添加样式
        let theStyleDOM = document.createElement('style');
        theStyleDOM.type = 'text/css';
        theStyleDOM.innerHTML = `
        .h5-floating-menu-shell::after{
            content:'';
            display:block;
            clear:both;
        }
        .h5-floating-menu-shell{
            position: fixed;
            top: ${this.theConfig.initialTop};
            left: ${this.theConfig.initialLeft};
            z-index:${this.theConfig.zIndex+1};
            display: flex;
            flex-direction: column-reverse;
            justify-content: space-between;
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
        document.head.appendChild(theStyleDOM);
        //子菜单弹出
        let isMenuShow = false;
        let halfWidth = (document.documentElement.clientWidth)/2;
        let halfHeight = (document.documentElement.clientHeight)/2;
        this.menuEntryDOM.addEventListener('h5-floating-menu-click', (e)=>{
            if(!isMenuShow)
            {
                this.showMenu();
                this.menuItemsDOM.style.display = "block";
                if(e.clientX< halfWidth)
                {
                    if(e.clientY< halfHeight)
                    {
                        this.menuItemsDOM.className = "h5-floating-menu-container-A";
                    }
                    else
                    {
                        this.menuItemsDOM.className = "h5-floating-menu-container-C";
                    }
                }
                else
                {
                    if(e.clientY< halfHeight)
                    {
                        this.menuItemsDOM.className = "h5-floating-menu-container-B";
                    }
                    else
                    {
                        this.menuItemsDOM.className = "h5-floating-menu-container-D";
                    }
                }
                isMenuShow = true;
                this.isDraggable = false;
            }
            else
            {
                this.hideMenu();
                this.menuItemsDOM.style.display = "none";
                isMenuShow = false;
                this.isDraggable = true;
            }
        });
    }
    showMenu(){
        if(this.maskDOM)
        {
            this.maskDOM.style.display = "block";
            this.menuEntryDOM.innerHTML = this.theConfig.mainIconOpen;
        }
    }
    
    hideMenu(){
        if(this.maskDOM)
        {
            this.maskDOM.style.display = "none";
            this.menuEntryDOM.innerHTML = this.theConfig.mainIconClose;
        }
    }
    
    makeDraggable(oneHtmlDOM){
        let distanceX, distanceY;
        let isMouseDown = false;
        let hasMouseMoved = false;
        let startFun = (e)=>{
            let startX, startY;
            hasMouseMoved = false;
            if(e.type === 'touchstart')
            {
                startX = e.touches[0].pageX;
                startY = e.touches[0].pageY;
            }
            else
            {
                startX = e.pageX;
                startY = e.pageY;
            }
            distanceX = startX - oneHtmlDOM.offsetLeft;
            distanceY = startY - oneHtmlDOM.offsetTop;
            isMouseDown = true;
        };
        let moveFun = (e)=>{
            if(isMouseDown)
            {
                hasMouseMoved = true;
                if(this.isDraggable)
                {
                    let curX, curY;
                    if(e.type === 'touchmove')
                    {
                        curX = e.touches[0].pageX;
                        curY = e.touches[0].pageY;
                    }
                    else
                    {
                        curX = e.pageX;
                        curY = e.pageY;
                    }
                    let elemLeft = (curX - distanceX < 0)?0:curX - distanceX;
                    let elemTop = (curY - distanceY < 0)?0:curY - distanceY;
                    if(elemLeft + oneHtmlDOM.offsetWidth > document.documentElement.clientWidth)
                    {
                        elemLeft = document.documentElement.clientWidth - oneHtmlDOM.offsetWidth;
                    }
                    if(elemTop + oneHtmlDOM.offsetHeight > document.documentElement.clientHeight)
                    {
                        elemTop = document.documentElement.clientHeight - oneHtmlDOM.offsetHeight;
                    }
                    oneHtmlDOM.style.left =  elemLeft + 'px';
                    oneHtmlDOM.style.top = elemTop + 'px';
                    e.preventDefault();
                }
            }
        };
        let endFun = (e)=>{
            if(isMouseDown&&!hasMouseMoved)
            {
                let clickX, clickY;
                if(e.type === 'touchend')
                {
                    clickX = e.changedTouches[0].clientX;
                    clickY = e.changedTouches[0].clientY;
                }
                else
                {
                    clickX = e.clientX;
                    clickY = e.clientY;
                }
                
                //触发自定义click事件
                this.menuEntryDOM.dispatchEvent(new MouseEvent('h5-floating-menu-click', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    clientX: clickX,
                    clientY: clickY
                }));
            }
            isMouseDown = false;
        };
        
        oneHtmlDOM.addEventListener('touchstart', startFun);
        oneHtmlDOM.addEventListener('touchmove', moveFun);
        // oneHtmlDOM.addEventListener('touchend', endFun);
        
        oneHtmlDOM.addEventListener('mousedown', startFun);
        document.addEventListener('mousemove', moveFun);
        document.addEventListener('mouseup', endFun);
    }
}

export default H5FloatingMenu;