
// graph variables
var graph = []
var obstacleRate = 0.2
var elevationRate = 0.5
var optDiagLinks = false
var weight = 50 // 100000000
var cstcost = 1

var optimistic = 0.5
var funnyTalkingRate = 0.5
var funnyGlobalTalkingRate = 0.5

// all pathfinding variables
var total_paths = 0

// path finding variables
var src = null
var dst = null
var head = null
var neighbors = []
var neighbor = null
var candidates = []
var current = null
var path = []
var path_index = 0

var aiWords = null
var aiFunnyWords = null

var subject = null

var evaluateDistance

var contextualAIThought = null


function node(x,y)
{
	return graph[y*gridWidth+x]
}

function computeCost(a, b)
{
	if(false)
	{
		// version Z = height
		dx = a.x - b.x
		dy = a.y - b.y
		dz = (a.z - b.z) * weight
		return Math.sqrt(dx*dx+dy*dy+dz*dz)
	}
	// version Z = difficulty !
	dx = a.x - b.x
	dy = a.y - b.y
	factor = 1 + ((1 - a.z) + (1 - b.z)) * weight * 0.5
	return Math.sqrt(dx*dx+dy*dy) * factor
}

function createGraph()
{
	total_paths = 0

	zmin=obstacleRate
	zmax=obstacleRate + (1 - obstacleRate) * elevationRate

	graph = []
	for (var i=0 ; i<gridHeight ; i++)
	{
		for(var j=0 ; j<gridWidth ; j++)
		{
			id = i*gridWidth + j
			z = Math.random()
			if(z < zmin) z = 0
			else if(z > zmax) z = 1
			else z = (z-zmin+0.5)/(zmax-zmin+0.5)
			graph.push({id: id, x: j, y: i, z: z, visited: false, head: false, complete: false, parent: null, path: false, path_amount: 0})
		}
	}
}