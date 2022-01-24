
//CANVAS
var framerate = 120;
var canvas_width = 800;
var canvas_height = 600;
var center_x = canvas_width/2;
var center_y = canvas_height/2;


//WORLD
var gravity = 250;
var floorpos = (canvas_height * 0.8)


//Entities
var dots = [];
var lines = [];


//KEYBINDS
var slider;
var key;



function line(a, b, distance){
	this.a = a;
	this.b = b;
	this.distance = distance;
	
	this.currentDistance = function() {
		let dx = this.a.x - this.b.x;
		let dy = this.a.y - this.b.y;
		return Math.sqrt(dx**2+dy**2);
	}
	
	this.update = function() {
		let delta = this.distance - this.currentDistance();
		let nx = (this.a.x - this.b.x)/this.currentDistance();
		let ny = (this.a.y - this.b.y)/this.currentDistance();
		
		this.a.x += nx * delta/2;
		this.a.y += ny * delta/2;
		this.b.x -= nx * delta/2;
		this.b.y -= ny * delta/2;
	}
	
	this.draw = function() {
		ctx = myGameArea.context;
		ctx.beginPath();
		ctx.moveTo(this.a.x, this.a.y);
		ctx.lineTo(this.b.x, this.b.y);
		ctx.stroke();
	}
}



function startGame() {
	var x, y, normal;
	var cx = center_x;
	var cy = center_y;
	
	let a = new component(-50 + canvas_width/2,  50 + canvas_height/3, (Math.random()-0.5) * 10, -2, 0, gravity);
	let b = new component( 50 + canvas_width/2,  50 + canvas_height/3, (Math.random()-0.5) * 10, -2, 0, gravity);
	let c = new component(-50 + canvas_width/2, -50 + canvas_height/3, (Math.random()-0.5) * 10, -2, 0, gravity);
	let d = new component( 50 + canvas_width/2, -50 + canvas_height/3, (Math.random()-0.5) * 10, -2, 0, gravity);
	
	dots.push(a);
	dots.push(b);
	dots.push(c);
	dots.push(d);
	
	let ab = new line(a, b, 100);
	let bc = new line(b, c, 100);
	let cd = new line(c, d, 100);
	let da = new line(a, d, 100);
	let ac = new line(a, c, 100*Math.sqrt(2));
	let bd = new line(b, d, 100*Math.sqrt(2));
	
	lines.push(ab);
	lines.push(bc);
	lines.push(cd);
	lines.push(da);
	lines.push(ac);
	lines.push(bd);
	
	
	
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = canvas_width;
        this.canvas.height = canvas_height;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 1000/framerate);
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}



function component(x, y, xvel, yvel, xacc, yacc) {
    this.x = x;
    this.oldx = x-xvel;
    this.xacc = xacc;
	
    this.y = y;
    this.oldy = y-yvel;
    this.yacc = yacc;
	
	this.tempx;
	this.tempy;
	
    this.update = function() {
		
		if(this.y > floorpos){
			this.oldy = this.y;
			this.y = canvas_height * 0.8 - 0.01;
			this.oldx = (this.x + this.oldx)/2
		}
		
		if(this.x < 0){
			this.oldx = this.x;
			this.x = 0;
		}
		
		if(this.x > canvas_width){
			this.oldx = this.x;
			this.x = canvas_width;
		}
		
		
		this.tempx = this.x;
		this.tempy = this.y;
		this.x += (this.x - this.oldx) + this.xacc/(framerate*framerate);
		this.y += (this.y - this.oldy) + this.yacc/(framerate*framerate);
		this.oldx = this.tempx;
		this.oldy = this.tempy;
		

		/* //uncomment to draw dots on points
		ctx = myGameArea.context;
		ctx.beginPath();
		ctx.arc(this.x, this.y, 5, 0, 2*Math.PI);
		ctx.fillStyle = "red"
		ctx.fill();
		*/
    }
}




function updateGameArea() {	
    myGameArea.clear();
    myGameArea.frameNo += 1;
	
	ctx = myGameArea.context;
	ctx.beginPath();
	ctx.moveTo(0, floorpos);
	ctx.lineTo(canvas_width, floorpos);
	ctx.stroke();
	
	for(var n=0; n<2; n++){
		for(var i = 0; i < dots.length; i++){
			dots[i].update();
		}
		
		for(var j = 0; j<1; j++){
			for(var i =0; i < lines.length; i++){
				lines[i].update();
			}
		}
	}
	for(var i =0; i < lines.length; i++){
		lines[i].draw ();
	}

	
    //myGamePiece.update();
}