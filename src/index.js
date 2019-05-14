import defaultConfig from './defaultConfig.js'

//检查浏览器环境
if(!window||!document)
{
    throw new Error('h5-floating-menu info: only support for browser!');
}

//读取配置
let theConfig = (window.H5FloatingMenuConfig)?window.H5FloatingMenuConfig:defaultConfig;

class H5FloatingMenu{
    constructor(){
        this.containerDOM = document.createElement('div');
        this.maskDOM = document.createElement('div');
    }
    init(){
        let theHtmlTemplate = `<div class=""></div>`;
    
        //添加元素
        this.containerDOM.className = 'h5-floating-menu-container';
        this.containerDOM.innerHTML = theConfig.outerIcon;
        document.body.appendChild(this.containerDOM);
        
        this.maskDOM.className = 'h5-floating-menu-mask';
        this.maskDOM.style.cssText = 'display:none;position:fixed;width:100%;height:100%;background-color:rgba(10, 10, 10, 0.69);top:0;left:0;z-index:10;';
        document.body.appendChild(this.maskDOM);
        //可拖动
        this.makeDraggable(this.containerDOM);
        //添加样式
        if(theConfig.outerCssStyle)
        {
            let theStyleDOM = document.createElement('style');
            theStyleDOM.type = 'text/css';
            theStyleDOM.innerHTML = `.h5-floating-menu-container${theConfig.outerCssStyle}`;
            document.head.appendChild(theStyleDOM);
        }
        //子菜单弹出
        let isMenuShow = false;
        this.containerDOM.addEventListener('click', ()=>{
            if(!isMenuShow)
            {
                this.showMenu();
                isMenuShow = true;
            }
            else
            {
                this.hideMenu();
                isMenuShow = false;
            }
        });
    }
    showMenu(){
        if(this.maskDOM)
        {
            this.maskDOM.style.display = "block";
            this.containerDOM.innerHTML = theConfig.outerIconClose;
        }
    }
    
    hideMenu(){
        if(this.maskDOM)
        {
            this.maskDOM.style.display = "none";
            this.containerDOM.innerHTML = theConfig.outerIcon;
        }
    }
    
    makeDraggable(oneHtmlDOM){
        let distanceX, distanceY;
        let isMouseDown = false;
        let startFun = (e)=>{
            let startX, startY;
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
        };
        
        oneHtmlDOM.addEventListener('touchstart', startFun);
        oneHtmlDOM.addEventListener('touchmove', moveFun);
        oneHtmlDOM.addEventListener('touchend', (e)=>{
            isMouseDown = false;
        });
        
        oneHtmlDOM.addEventListener('mousedown', startFun);
        document.addEventListener('mousemove', moveFun);
        document.addEventListener('mouseup', (e)=>{
            isMouseDown = false;
        });
    }
}

const h5FloatingMenu = new H5FloatingMenu();

//页面载入完成时执行
if(document.readyState === 'complete')
{
    h5FloatingMenu.init();
}
else
{
    window.addEventListener('load', ()=>{
        h5FloatingMenu.init();
    });
}