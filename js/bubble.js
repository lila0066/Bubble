setup();

var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext('2d');

var mouse = {
	x: undefined,
	y: undefined
}

var maxRadius = 40;
var colorGet = [];

window.addEventListener('touchstart', function(e){
	var touchobj = e.targetTouches[0];
	mouse.x = parseInt(touchobj.clientX);
	mouse.y = parseInt(touchobj.clientY);
}, false);

window.addEventListener('touchend', function(e){
	colorCheckFun(colorGet);
}, false);

window.addEventListener('resize', function(){
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	init();
});

function Circle(x, y, dx, dy, radius, color){
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.radius = radius;
	this.minRadius = radius;
	this.color = color;
	this.range = 15;

	this.draw = function(){
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		c.fillStyle = "rgb(" + this.color + ")";
		c.fill();
	}

	this.update = function(){
		if(this.x+this.radius>innerWidth || this.x-this.radius<0){
			this.dx = -this.dx;
		}//touch the edge

		if(this.y+this.radius>innerHeight || this.y-this.radius<0){
			this.dy = -this.dy;
		}//touch the edge

		this.x += this.dx;
		this.y += this.dy;

		//interactivity
		if(mouse.x-this.x<this.range && mouse.x-this.x>-this.range && mouse.y-this.y<this.range && mouse.y-this.y>-this.range){
			if(this.radius<maxRadius){
				this.radius += 10;

					colorGet.push(this.color);
					mouse.x = undefined;
					mouse.y = undefined;

					//set LED color
					//if(cpf){
						//cpf.setChainableLed("0," + this.color + ";");
						//var ret = cpf.request('["grove_setColorRGB", 7,' + this.color + ']');
					//}

			}				
		}else if(this.radius>this.minRadius){
			this.radius -=1;
		}
		this.draw();
	}

}

//if touched rhe same color or not
function colorCheckFun(getArray) {

	var colorCheck = [0,0,0,0,0,0];

	for(var i=0; i<getArray.length; i++){
		for(var j=0; j<colorArray.length; j++){

			if((getArray[i]==colorArray[j])&&(colorCheck[j]!=0)){
				setTimeout(function(){
					alert('game over');
					location.reload();
				}, 500);
			}else if(getArray[i]==colorArray[j]){
				colorCheck[j]++;
			}

		}
	}

	var count = 0;
	for(var j=0; j<colorCheck.length; j++){
		if(colorCheck[j]==1) count++;
	}

	if(count==colorCheck.length){
		setTimeout(function(){
			alert(msg);
			window.location = site;
		}, 500);
	}

}

var circleArray = [];

function init() {
	circleArray=[];

	for(var i = 0; i<30; i++){
		var radius = Math.random() * 10 + 10;
		var x = Math.random() * (window.innerWidth - radius*2) + radius;
		var y = Math.random() * (window.innerHeight -  radius*2) + radius;
		var dx = (Math.random() - 0.5) * 3;
		var dy = (Math.random() - 0.5) * 3;

		var color = (i<6) ? (colorArray[i]) : (colorArray[Math.floor(Math.random() * colorArray.length)]);

		circleArray.push(new Circle(x, y, dx, dy, radius, color));
	}

}

function animate(){
	requestAnimationFrame(animate);
	c.clearRect(0, 0, innerWidth, innerHeight);

	for(var i = 0; i<circleArray.length; i++){
		circleArray[i].update();
	}
}

init();
animate();

// cpf setup
function setup(){
	//if(cpf) var ret = cpf.setPinMode('["resetPin"],["grove_newChainableLED", 7, 8, 1]'); 
	//document.getElementById("demo").innerHTML += ret + "<br>";
}