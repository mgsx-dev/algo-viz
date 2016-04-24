var canvas = null
var display = null
var gridH = 20
var gridW = gridW = Math.floor(window.innerWidth * gridH / window.innerHeight)
var player = null
var nodes = null
var unvisited = null
var VEC = [[0,-1], [-1, 0], [0, 1], [1, 0]] // ULDR vectors
var current = null
var links = null

$(function() {
	$.get('labyrinthe.pd', function(patchStr) {
	  patch = Pd.loadPatch(patchStr)
	  Pd.start()
	})
});

$(function() {
	canvas = $('#canvas')[0]
	display = new CanvasDisplay(canvas)
	display.init()
	display.changeSize(gridW, gridH)
	display.onDraw = draw
	display.resize()

	player = new AlgoPlayer()
	player.algo = {
		init: init,
		reset: reset,
		step: step,
		draw: draw,
	}
	player.stepPerSeconds = 10
	player.start()

	$('#sliderSize').change(function(){
		gridH = this.value
		gridW = Math.floor(window.innerWidth * gridH / window.innerHeight)
		player.stop()
		display.changeSize(gridW, gridH)
		player.start()
	})
});

function reset(){
	current = null
	nodes = []
	unvisited = []
	links = []
	for(var y=0 ; y<gridH ; y++)
	{
		var line = []
		for(var x=0 ; x<gridW ; x++)
		{
			var cell = {x: x, y: y, visited: false, links: []}
			line.push(cell)
			unvisited.push(cell)
		}	
		nodes.push(line)
	}	
}

function init(){

}

function findLen(x, y, dx, dy){
	var len = 0
	while(true)
	{
		x+=dx
		y+=dy
		if(x<0||x>=gridW||y<0||y>=gridH)
		{
			break
		}
		if(nodes[y][x].visited)
		{
			break
		}
		len++
	}
	return len
}

function step(){

	if(current == null && unvisited.length > 0)
	{
		current = unvisited.splice(Math.floor(Math.random() * unvisited.length), 1)[0]
	}
	else if(current != null)
	{
		// find all directions
		var dirs = []
		for(var i=0 ; i<4 ; i++)
		{
			var vec = VEC[i]
			var len = findLen(current.x, current.y, vec[0], vec[1])
			if(len > 0)
			{
				dirs.push({vec: vec, len: len})
			}
		}
		current.visited = true
		// choose a direction
		if(dirs.length > 0)
		{
			dir = dirs[Math.floor(Math.random() * dirs.length)]
			len = 1 + Math.floor(Math.random() * dir.len)
			x = current.x
			y = current.y
			var next = null
			for(var i=0 ; i<len ; i++)
			{
				x += dir.vec[0]
				y += dir.vec[1]
				next = nodes[y][x]
				next.visited = true
				unvisited.splice(unvisited.indexOf(next), 1)
				links.push([current, next])
				current = next
			}
			Pd.send("seg", [len])
		}
		else
		{
			Pd.send("seg", [8 + (Math.random()>0.8?1:0)])
			current = null
		}
	}
	else
	{
		return false
	}
	return true
}

function draw()
{
	display.clear("rgb(0,0,0)")
	display.begin()

	ctx = canvas.getContext("2d");
	
	if(nodes == null)
		return

	var cellSize = 0.3
	var linkSize = 0.1
	var cellMargin = (1 - cellSize)/2

	ctx.strokeStyle = "rgb(158,0,0)"
	ctx.lineWidth = linkSize
	for(var i in links)
	{
		var link = links[i]
		var from = link[0]
		var to = link[1]
		ctx.beginPath()
		ctx.moveTo(from.x+0.5, from.y+0.5)
		ctx.lineTo(to.x+0.5, to.y+0.5)
		ctx.stroke()
	}

	for(var y=0 ; y<gridH ; y++)
	{
		for(var x=0 ; x<gridW ; x++)
		{
			var node = nodes[y][x]
			if(node.visited)
			{
				ctx.fillStyle = "rgb(128,0,0)"
			}
			else
			{
				ctx.fillStyle = "rgb(128,128,128)"
			}
			ctx.fillRect(x+cellMargin, y+cellMargin, cellSize, cellSize)
		}	
	}
}