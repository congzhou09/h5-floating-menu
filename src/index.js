import defaultConfig from './defaultConfig.js'

if(!window||!document)
{
    throw new Error('h5-floating-menu info: only support for browser!');
}

//位置
let switchPos = {
    x: 10, // right
    y: 10, // bottom
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0
};

//读取配置
let theConfig = (window.H5FloatingMenuConfig)?window.H5FloatingMenuConfig:defaultConfig;

//页面载入完成时执行
if(document.readyState === 'complete')
{
    onLoaded();
}
else
{
    window.addEventListener('load', onLoaded);
}


function onLoaded() {
    render();
}

function render(){
    let theHtmlTemplate = `<div class=""></div>`;
    
    //添加元素
    let theHtmlDOM = document.createElement('div');
    theHtmlDOM.className = 'h5-floating-menu-container';
    theHtmlDOM.innerHTML = `<span style="position:absolute;left: 50%;top:50%;transform: translateX(-50%) translateY(-50%);">${theConfig.outerContent}</span>`;
    document.body.appendChild(theHtmlDOM);
    //可拖动
    makeDraggable(theHtmlDOM);
   
    //添加样式
    if(theConfig.outerCssStyle)
    {
        let theStyleDOM = document.createElement('style');
        theStyleDOM.type = 'text/css';
        theStyleDOM.innerHTML = `.h5-floating-menu-container${theConfig.outerCssStyle}`;
        document.head.appendChild(theStyleDOM);
    }
}

function makeDraggable(oneHtmlDOM){
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