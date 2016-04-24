$(function() {
	CanvasDisplay.init()
});

// TODO better way ? in POO ?
document.addEventListener("contextmenu", function(e){
    e.preventDefault();
}, false);

var CanvasDisplay = {

	canvas: null,
	xoffset: 0,
	yoffset: 0,
	scale: 1,
	px: 0,
	py: 0,
	ox: 0,
	oy: 0,
	dragging: false,
	clientWidth: 1,
	clientHeight: 1,

	clear: function(color){
		ctx.fillStyle = color;
		ctx.setTransform(1,0,0,1,0,0);
		ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	},

	begin: function(){
		ctx.setTransform(this.scale,0,0,this.scale, this.xoffset, this.yoffset);
	},

	init: function(){
		this.canvas = $('#canvas')[0] // TODO param
		var self = this
		$('#canvas').on('mousewheel', function (jqe) {
			e = jqe.originalEvent
		    CanvasDisplay.zoom(e.x, e.y, e.wheelDeltaY < 0 ? 0.5 : 2.0)
		})
		$('#canvas').on('mousemove', function (jqe) {
			e = jqe.originalEvent
			if(e.which == 1) // left click
			{
				self.dragging = true
				CanvasDisplay.pan(e.x-CanvasDisplay.px, e.y-CanvasDisplay.py)
			}
			else if(e.which != 0) // middle click (2) right click (3)
			{
				self.dragging = true
				CanvasDisplay.zoom(CanvasDisplay.ox, CanvasDisplay.oy, CanvasDisplay.py - e.y < 0 ? 1.02 : 0.98)
			}		    
		    CanvasDisplay.px = e.x
		    CanvasDisplay.py = e.y
		})
		$('#canvas').on('mousedown', function (jqe) {
			e = jqe.originalEvent
		    self.dragging = false
			CanvasDisplay.ox = e.x
			CanvasDisplay.oy = e.y
		})
		$('#canvas').on('click', function (jqe) {
			e = jqe.originalEvent
		    if(!self.dragging)
			{
				x = Math.floor((e.x - CanvasDisplay.xoffset) / self.scale)
				y = Math.floor((e.y - CanvasDisplay.yoffset) / self.scale)
				clickGraph(x, y) // TODO POO
			}
			self.dragging = false
		})
		$( window ).resize(function() {CanvasDisplay.resize()})
	},

	pan: function(dx, dy)
	{
		this.xoffset += dx
		this.yoffset += dy
		this.redraw()
	},

	zoom: function (ox, oy, rate)
	{
		sx = (ox - this.xoffset) / this.scale
		sy = (oy - this.yoffset) / this.scale
		this.xoffset += sx * this.scale
		this.yoffset += sy * this.scale
		this.scale *= rate
		this.xoffset -= sx * this.scale
		this.yoffset -= sy * this.scale
		this.redraw()
	},

	reset: function()
	{
		this.xoffset = this.yoffset = 0
		this.resize()
	},

	changeSize: function(width, height){
		this.clientWidth = width
		this.clientHeight = height
		this.resize()
	},

	resize: function(){
		this.canvas.width = window.innerWidth;
    	this.canvas.height = window.innerHeight;

    	this.scale = Math.min(canvas.width / this.clientWidth, canvas.height / this.clientHeight)
    	this.redraw()
	},

	redraw: function()
	{
		// TODO set matrix
		// TODO POO
		drawStuff()
	}

}