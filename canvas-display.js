
var CanvasDisplay = function(canvas){

	this.canvas = canvas
	this.ctx = canvas.getContext("2d");
	this.xoffset = 0
	this.yoffset = 0
	this.scale = 1
	this.px = 0
	this.py = 0
	this.ox = 0
	this.oy = 0
	this.dragging = false
	this.clientWidth = 1
	this.clientHeight = 1
	this.onClick = null
	this.onDraw = null

	// prevent right click on canvas
	canvas.addEventListener("contextmenu", function(e){
	    e.preventDefault();
	}, false);

	this.clear = function(color){
		this.ctx.fillStyle = color;
		this.ctx.setTransform(1,0,0,1,0,0);
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	}

	this.begin = function(){
		this.ctx.setTransform(this.scale,0,0,this.scale, this.xoffset, this.yoffset);
	}

	this.init = function(){
		var self = this
		$('#canvas').on('mousewheel', function (jqe) {
			e = jqe.originalEvent
		    self.zoom(e.x, e.y, e.wheelDeltaY < 0 ? 0.5 : 2.0)
		})
		$('#canvas').on('mousemove', function (jqe) {
			e = jqe.originalEvent
			if(e.which == 1) // left click
			{
				self.dragging = true
				self.pan(e.x-self.px, e.y-self.py)
			}
			else if(e.which != 0) // middle click (2) right click (3)
			{
				self.dragging = true
				self.zoom(self.ox, self.oy, self.py - e.y < 0 ? 1.02 : 0.98)
			}		    
		    self.px = e.x
		    self.py = e.y
		})
		$('#canvas').on('mousedown', function (jqe) {
			e = jqe.originalEvent
		    self.dragging = false
			self.ox = e.x
			self.oy = e.y
		})
		$('#canvas').on('click', function (jqe) {
			e = jqe.originalEvent
		    if(!self.dragging)
			{
				x = Math.floor((e.x - self.xoffset) / self.scale)
				y = Math.floor((e.y - self.yoffset) / self.scale)
				if(self.onClick)
				{
					self.onClick(x, y)
				}
			}
			self.dragging = false
		})
		$( window ).resize(function() {self.resize()})
	}

	this.pan = function(dx, dy)
	{
		this.xoffset += dx
		this.yoffset += dy
		this.redraw()
	}

	this.zoom = function (ox, oy, rate)
	{
		sx = (ox - this.xoffset) / this.scale
		sy = (oy - this.yoffset) / this.scale
		this.xoffset += sx * this.scale
		this.yoffset += sy * this.scale
		this.scale *= rate
		this.xoffset -= sx * this.scale
		this.yoffset -= sy * this.scale
		this.redraw()
	}

	this.reset = function()
	{
		this.xoffset = this.yoffset = 0
		this.resize()
	}

	this.changeSize = function(width, height){
		this.clientWidth = width
		this.clientHeight = height
		this.resize()
	}

	this.resize = function(){
		this.canvas.width = window.innerWidth;
    	this.canvas.height = window.innerHeight;

    	this.scale = Math.min(canvas.width / this.clientWidth, canvas.height / this.clientHeight)
    	this.redraw()
	}

	this.redraw = function()
	{
		if(this.onDraw)
		{
			this.onDraw()
		}
	}

}