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
var picks = null
var pickCounter = 0
var insider = null
var insiders = null

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
	player.stepPerSeconds = 12
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
	insider = null
	insiders = []
	pickCounter = 0
	picks = []
	current = null
	nodes = []
	unvisited = []
	links = []
	for(var y=0 ; y<gridH ; y++)
	{
		var line = []
		for(var x=0 ; x<gridW ; x++)
		{
			var cell = {x: x, y: y, visited: false, links: [], picked: false, inside: false, pole: false}
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
function findLenInside(x, y, dx, dy){
	var len = 0
	while(true)
	{
		x+=dx
		y+=dy
		if(x<0||x>=gridW||y<0||y>=gridH)
		{
			break
		}
		if(!nodes[y][x].visited)
		{
			break
		}
		len++
	}
	return len
}

function step(){

	// start at 0 to leave introdution
	if(pickCounter % (2*(1+Math.floor(Math.random() * 8))) == 0)
	{
		var node = unvisited.splice(Math.floor(Math.random() * unvisited.length), 1)[0]
		node.visited = true
		node.picked = true
		// node.inside = true
		Pd.send("pick", [])
	}
	pickCounter++ 
	
	if(insider == null && insiders.length > 0 && pickCounter % (2*(1+Math.floor(Math.random() * 8))) == 0)
	{
		insider = insiders.splice(Math.floor(Math.random() * insiders.length), 1)[0]
		insider.inside = true
		Pd.send("ins", [Math.random() * 10])
		var gx = Math.floor(Math.random() * gridW) / 6 + 1
		var gy = Math.floor(Math.random() * gridH)/ 6 + 1
		for(var cy=0 ; cy<gy ; cy++)
		{
			for(var cx=0 ; cx<gx ; cx++)
			{
				var x = insider.x + cx
				var y = insider.y + cy
				if(x<0||x>=gridW||y<0||y>=gridH)
					{}else{
						nodes[y][x].pole = !nodes[y][x].pole
					}
			}
		}
		insider = null
	}
	if(false && insider != null)
	{
		var dirs = []
		for(var i=0 ; i<4 ; i++)
		{
			var vec = VEC[i]
			var len = findLenInside(insider.x, insider.y, vec[0], vec[1])
			if(len > 0)
			{
				dirs.push({vec: vec, len: len})
			}

		}
		insider.inside = true
		// choose a direction
		if(dirs.length > 0)
		{
			dir = dirs[Math.floor(Math.random() * dirs.length)]
			len = 1 + Math.floor(Math.random() * dir.len)
			x = insider.x
			y = insider.y
			var next = null
			for(var i=0 ; i<len ; i++)
			{
				x += dir.vec[0]
				y += dir.vec[1]
				next = nodes[y][x]
				next.inside = true
				insiders.splice(insiders.indexOf(next), 1)
				insider = next
			}
		}
		else
		{
			
		}	
		insider = null
	}

	if(current == null && unvisited.length > 0)
	{
		Pd.send("head", [])
		current = unvisited.splice(Math.floor(Math.random() * unvisited.length), 1)[0]
		insiders.push(current)
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
				insiders.push(current)
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

	var linkSize = 0.1

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
			var cellSize = 0.3
			//var cellMargin = (1 - cellSize)/2
			var node = nodes[y][x]
			if(node.picked)
			{
				cellSize = 0.4

				ctx.fillStyle = node.pole ? "rgb(255,255,0)" : "rgb(230,200,30)"
			}
			else if(node.visited)
			{
				ctx.fillStyle = node.pole ? "rgb(255,0,0)" : "rgb(128,0,0)"
			}
			else if(node.pole)
			{
				ctx.fillStyle = "rgb(70,70,80)"
			}
			else
			{
				ctx.fillStyle = "rgb(40,40,40)"
			}
			cellSize = node.pole ? cellSize * 1.3 : cellSize
			var cellMargin = (1 - cellSize)/2
			ctx.fillRect(x+cellMargin, y+cellMargin, cellSize, cellSize)
		}	
	}
}