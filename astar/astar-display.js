$(function() {
	CanvasDisplay.init()
});

// TODO better way ? in POO ?
document.addEventListener("contextmenu", function(e){
    e.preventDefault();
}, false);

// TODO private
var dragging = false
var cellSize = 0
var gridHeight = null
var gridWidth = null


var CanvasDisplay = {

	canvas: null,
	xoffset: 0,
	yoffset: 0,
	scale: 1,
	px: 0,
	py: 0,
	ox: 0,
	oy: 0,

	init: function(){
		this.canvas = $('#canvas')[0]
		$('#canvas').on('mousewheel', function (jqe) {
			e = jqe.originalEvent
		    CanvasDisplay.zoom(e.x, e.y, e.wheelDeltaY < 0 ? 0.5 : 2.0)
		})
		$('#canvas').on('mousemove', function (jqe) {
			e = jqe.originalEvent
			if(e.which == 1) // left click
			{
				dragging = true
				CanvasDisplay.pan(e.x-CanvasDisplay.px, e.y-CanvasDisplay.py)
			}
			else if(e.which != 0) // middle click (2) right click (3)
			{
				dragging = true
				CanvasDisplay.zoom(CanvasDisplay.ox, CanvasDisplay.oy, CanvasDisplay.py - e.y < 0 ? 1.02 : 0.98)
			}		    
		    CanvasDisplay.px = e.x
		    CanvasDisplay.py = e.y
		})
		$('#canvas').on('mousedown', function (jqe) {
			e = jqe.originalEvent
		    dragging = false
			CanvasDisplay.ox = e.x
			CanvasDisplay.oy = e.y
		})
		$('#canvas').on('click', function (jqe) {
			e = jqe.originalEvent
		    if(!dragging)
			{
				x = Math.floor((e.x - CanvasDisplay.xoffset) / cellSize)
				y = Math.floor((e.y - CanvasDisplay.yoffset) / cellSize)
				clickGraph(x, y) // TODO POO
			}
			dragging = false
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
		sx = (ox - this.xoffset) / cellSize
		sy = (oy - this.yoffset) / cellSize
		this.xoffset += sx * cellSize
		this.yoffset += sy * cellSize
		cellSize *= rate
		this.xoffset -= sx * cellSize
		this.yoffset -= sy * cellSize
		this.redraw()
	},

	reset: function()
	{
		this.xoffset = this.yoffset = 0
		this.resize()
		// TODO recompute scale !
		// TODO redraw ...
	},

	resize: function(){
		this.canvas.width = window.innerWidth;
    	this.canvas.height = window.innerHeight;

    	cellSize = Math.min(canvas.width / gridWidth, canvas.height / gridHeight)
    	this.redraw()
	},

	redraw: function()
	{
		// TODO POO
		drawStuff()
	}

}