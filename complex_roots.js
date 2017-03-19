GameBox = function()
    {
        this.lastFrameTime = Date.now();
        this.currentFrameTime = Date.now();
        this.timeElapsed = 0;
    }

ComplexNum = function(__re,__img)
{
    var __arg = function(re,img)
    {
        if ((re*img) >0) //Same Sign
        {
            if (re >0)
            {
                //1st Quadrant
                return Math.atan(img/re);
            } 
            else 
            {
                //3rd Quadrant
                return Math.atan(img/re) + Math.PI;
            }
        }
        else //Different Sign
        { 
            if (re <0)
            {
                //2nd Quadrant
                return Math.atan(img/re) + Math.PI;
            }
            else 
            {
                //4th Quadrant
                return Math.atan(img/re) + 2 * Math.PI;
            }
        }
    }

    this.real = __re;
    this.imaginary = __img;
    this.module = Math.sqrt(  Math.pow(__re,2) + Math.pow(__img,2)  );
    this.argument = __arg(__re,__img);
    this.showX  = canvasCenter.x + __re * 200 ;
    this.showY  = canvasCenter.y + __img * -200 ;
}

ComplexNum.prototype.fromPolar = function(z,fi)
{
    return new ComplexNum(z * Math.cos(fi), z * Math.sin(fi));
}

GameBox.prototype.gameLoop = function()
{
    window.requestAnimationFrame(this.gameLoop.bind(this));
    this.lastFrameTime = this.currentFrameTime;
    this.currentFrameTime = Date.now();
    this.timeElapsed +=  this.currentFrameTime - this.lastFrameTime ;

    this.update(this.timeElapsed / 100); 
    this.render(this.timeElapsed / 100);
    this.timeElapsed = 0;
}

let MaxX = 400;
let MinX = 100;
let MaxY = 400;
let MinY = 100;
let canvasHeight = 600;
let canvasWidth = 600;

let canvasCenter = { x: canvasWidth / 2 ,y: canvasHeight / 2}

var complex = new ComplexNum(1, 1);

let rootColor = "#ff0000";
let circleColor =  "#b0b0b0"
let poligonColor = "#00ff00"
let complexColor = "#707070"

var ctx = {};
var calcRoots = true;
var roots = [];

var mousePos = {x: 400, y: 400}
var dragging = false;

GameBox.prototype.update = function(timeElapsed)
{
    var real = ( mousePos.x - canvasCenter.x ) / 200 ;
    var imag = ( mousePos.y - canvasCenter.y ) / -200 ;

    complex = new ComplexNum(real, imag);
    this.getRoots(complex);

    document.getElementById('Real').textContent = this.padString(complex.real.toString(),10);
    document.getElementById('Imaginary').textContent = this.padString(complex.imaginary.toString(),10);
}

GameBox.prototype.padString = function(aString,length)
{
    if ( aString.length >= length) return aString;

    for (var i = 0; i <= length - aString.length; i++) 
    {
            aString = " "+aString;
    }
    return aString;
}

GameBox.prototype.getRoots = function(complex)
{
    var n = document.getElementById('Roots').value;
    if (n<2)
    {
        return;
    }

    roots = [];
    var z = Math.pow(complex.module,1/n);

    var deltaFi = 2 * Math.PI / n;

    var fi0 = complex.argument / n

    for (var i = 0; i <= n - 1; i++) 
    {
        roots[i] = new ComplexNum().fromPolar(z,fi0 + i * deltaFi);
    }
}

GameBox.prototype.render= function(timeElapsed)
{

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Y Axis
    ctx.beginPath();
    ctx.moveTo(canvasCenter.x , 0);
    ctx.lineTo(canvasCenter.x, canvasHeight);
    ctx.stroke();

    //X Axis
    ctx.moveTo(0, canvasCenter.y );
    ctx.lineTo(canvasWidth, canvasCenter.y );
    ctx.stroke();

    //Perimeter
    if(document.getElementById('Circle').checked)
    {
        ctx.beginPath();
        ctx.arc(canvasCenter.x, canvasCenter.y, roots[0].module * 200  , 0, 2 * Math.PI, true);
        ctx.stroke();
    }

    //Roots
    if (document.getElementById('Poligon').checked)
    {
        var ptoAnterior = roots[0];
        var primerPunto = roots[0];

        roots.forEach(function(complexRoot) 
        {
            ctx.moveTo(complexRoot.showX , complexRoot.showY);
            ctx.lineTo(ptoAnterior.showX, ptoAnterior.showY);
            ctx.stroke();
            ptoAnterior = complexRoot;
        });

        ctx.moveTo(primerPunto.showX , primerPunto.showY);
        ctx.lineTo(ptoAnterior.showX, ptoAnterior.showY);
        ctx.stroke();
    }
        
    roots.forEach(function(complexRoot) 
    {
        ctx.beginPath();
        ctx.arc(complexRoot.showX, complexRoot.showY, 4 , 0, 2 * Math.PI, true);
        ctx.fill();
    });


    // Complex
    ctx.fillStyle = rootColor;

    ctx.beginPath();
    ctx.arc(complex.showX , complex.showY , 4 , 0, 2 * Math.PI, true);
    ctx.fill();

    //Borders
    ctx.strokeStyle = '#000000';
    ctx.rect(0,0,600,600);
    ctx.stroke();
}

function getMousePos(a_canvas, evt) {
        var rect = a_canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      }

function Init(){
    var canvas = document.getElementById('canvas');
    ctx = canvas.getContext("2d");
    
 
canvas.addEventListener('mousedown', function(evt) {
        dragging = true;
      }, false);
 

canvas.addEventListener('mouseup', function(evt) {
        dragging = false;
      }, false);

    canvas.addEventListener('mousemove', function(evt) {
        if (!!dragging)
        {
            mousePos = getMousePos(canvas, evt);
        }
      }, false);

    var game = new GameBox();
    game.gameLoop();

}


