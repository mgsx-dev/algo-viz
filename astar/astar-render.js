

var optPathPersistence = false
var optShowDistance = false
var optAITalkings = false
var optAIFunnyTalkings = false

var margin = 2 // grid margin ... 


function drawStuff() {
     
     if(src != null && dst != null)
     {
     	dx = src.x - dst.x
		dy = src.y - dst.y
		dstBase = Math.sqrt(dx*dx+dy*dy) 
     }
     else
     {
		dstBase = gridWidth + gridHeight
     }
	



	ctx.fillStyle = "rgb(0,0,0)";
	ctx.setTransform(1,0,0,1,0,0);
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.setTransform(1,0,0,1, CanvasDisplay.xoffset, CanvasDisplay.yoffset);



	ctx.fillStyle = "rgb(40,40,40)";

	for (var i=0 ; i<gridHeight ; i++)
	{
		for(var j=0 ; j<gridWidth ; j++)
		{
			n = node(j,i)
			id = i*gridWidth + j
			
			if(n.z <= 0)
			{
				ctx.fillStyle = "rgb(0,0,0)";
			}
			else if(n.z >= 1)
			{
				ctx.fillStyle = "rgb(255,255,255)";
			}
			else
			{
				val = (1 - n.z) * weight / 100

				g = 0.2 * val + (1 - val) * 1
				r = 0.9 * (1 - val) * (1 - val)

				base = Math.floor(255 * r)
				full = Math.floor(255 * g)

					
				ctx.fillStyle = "rgb(" + base + ","+full+"," + base + ")";
			}

			ctx.fillRect (j*cellSize + margin/2, i*cellSize + margin/2, cellSize-margin, cellSize-margin);
			if(optPathPersistence && n.path_amount > 0)
			{
				pm = n.path_amount / (1 + total_paths)
				ctx.fillStyle = "rgba(255,127,0," + pm + ")";
				ctx.beginPath()
				ctx.arc((j+0.5)*cellSize, (i+0.5)*cellSize, cellSize / 3,0,2*Math.PI)
				ctx.fill()
			}
			if(n.path)
			{
				ctx.fillStyle = "rgb(255,127,0)";
				ctx.beginPath()
				ctx.arc((j+0.5)*cellSize, (i+0.5)*cellSize, cellSize / 4,0,2*Math.PI)
				ctx.fill()
			}
			else if(n == dst)
			{
				ctx.fillStyle = "rgb(255,0,0)";
				ctx.beginPath()
				ctx.arc((j+0.5)*cellSize, (i+0.5)*cellSize, cellSize / 4,0,2*Math.PI)
				ctx.fill()
			}
			else if(n.complete)
			{
				radius = 0.25
				ctx.fillStyle = "rgb(0,120,200)";
				ctx.beginPath()
				ctx.arc((j+0.5)*cellSize, (i+0.5)*cellSize, cellSize * radius,0,2*Math.PI)
				ctx.fill()
			}
			else if(n.head)
			{
				radius = 0.15
				ctx.fillStyle = "rgb(64,200,255)";
				ctx.beginPath()
				ctx.arc((j+0.5)*cellSize, (i+0.5)*cellSize, cellSize * radius,0,2*Math.PI)
				ctx.fill()
			}


			if(optShowDistance)
			{
				var text = null
				var size = 0
				var color = "white"
				if(n.complete)
				{
					size = 0.20
					text = "" + n.cost.toFixed(2)
				}
				else if(n.head)
				{
					size = 0.12
					text = "" + n.dist.toFixed(2)
				}

				if(text != null)
				{
					measures = ctx.measureText(text)

					scale = cellSize * size / measures.width

					ctx.save();
					ctx.fillStyle = color
					ctx.font="20px Verdana";
					ctx.translate((j+0.5)*cellSize, (i+0.5)*cellSize);
					ctx.scale(scale, scale);
					
					ctx.textAlign = "center";
					ctx.fillText(text, 0, 7);
					ctx.restore();

				}
			}
		}
	}

	for (var i=0 ; i<gridHeight ; i++)
	{
		for(var j=0 ; j<gridWidth ; j++)
		{
			n = node(j,i)

			if (n == src || n == dst)
			{
				ctx.strokeStyle = n == src ? "rgb(0,0,255)" : "rgb(255,0,0)";
				ctx.lineWidth = 2;
				ctx.beginPath()
				ctx.arc((n.x+0.5)*cellSize, (n.y+0.5)*cellSize, cellSize / 3,0,2*Math.PI)
				ctx.stroke()
			}
			if (n == current)
			{
				ctx.strokeStyle = "rgb(255,0,255)";
				ctx.lineWidth = 2;
				ctx.beginPath()
				ctx.arc((n.x+0.5)*cellSize, (n.y+0.5)*cellSize, cellSize / 3,0,2*Math.PI)
				ctx.stroke()
			}

			if(n.parent)
			{
				var scale = 0.1
				var lscale = 0.3
				var dx = (n.x - n.parent.x)
				var dy = (n.y - n.parent.y)

				angle = Math.atan2(dy, dx)
				dist = Math.sqrt(dx*dx+dy*dy)

				ctx.fillStyle = "rgb(50,250,190)";

				ctx.save();
				ctx.translate((n.parent.x+0.5)*cellSize, (n.parent.y+0.5)*cellSize);
				ctx.rotate(angle);
				ctx.translate(cellSize*(dist-1)/2, 0)

				ctx.beginPath();
				ctx.moveTo(cellSize * lscale, 0);
				ctx.lineTo(cellSize * (1 - lscale), cellSize * scale);
				ctx.lineTo(cellSize * (1 - lscale), -cellSize * scale);
				ctx.fill();

				ctx.restore();

				


				
				
			}
		}
	}


	if(neighbor != null)
	{
		radius = 0.35
		ctx.strokeStyle = "rgb(255,255,0)";
		ctx.lineWidth = 5;
		ctx.beginPath()
		ctx.arc((neighbor.x+0.5)*cellSize, (neighbor.y+0.5)*cellSize, cellSize * radius,0,2*Math.PI)
		ctx.stroke()

		radius = 0.35
		ctx.strokeStyle = "rgb(255,128,0)";
		ctx.lineWidth = 5;
		ctx.beginPath()
		ctx.arc((neighbor.from.x+0.5)*cellSize, (neighbor.from.y+0.5)*cellSize, cellSize * radius,0,2*Math.PI)
		ctx.stroke()
	}
	if(head != null)
	{
		radius = 0.35
		ctx.strokeStyle = "rgb(255,128,0)";
		ctx.lineWidth = 5;
		ctx.beginPath()
		ctx.arc((head.x+0.5)*cellSize, (head.y+0.5)*cellSize, cellSize * radius,0,2*Math.PI)
		ctx.stroke()
	}


	if(neighbor && evaluateDistance)
	{
		var from = {x: (neighbor.x+0.5)*cellSize, y: (neighbor.y+0.5)*cellSize}
		var to   = {x: (dst.x+0.5)*cellSize,      y: (dst.y+0.5)*cellSize}

		// add offset to not overlap text
		dx = to.x - from.x
		dy = to.y - from.y
		l = Math.sqrt(dx*dx+dy*dy)
		if(l>0)
		{
			from.x += cellSize * 0.35 * dx/l
			from.y += cellSize * 0.35 * dy/l
		}

		var grad= ctx.createLinearGradient(from.x, from.y, to.x, to.y);
		grad.addColorStop(0, "yellow");
		grad.addColorStop(1, "red");

		ctx.strokeStyle = grad;
		ctx.lineWidth = 5;
		
		ctx.beginPath();
		ctx.moveTo(from.x, from.y);
		ctx.lineTo(to.x, to.y);
		ctx.stroke();

		if(optShowDistance)
		{
			var left, right;
			if(from.x < to.x)
			{
				left = from
				right = to 
			}
			else
			{
				left = to 
				right = from
			}
			dx = right.x-left.x
			dy = right.y-left.y
			angle = Math.atan2(dy, dx)
			l = Math.sqrt(dx*dx+dy*dy)


			ctx.save();
			ctx.fillStyle = "orange" // ctx.createLinearGradient(0, 0, l, 0);
			ctx.font="20px Verdana";
			ctx.translate(left.x, left.y);
			ctx.rotate(angle);
			
			ctx.textAlign = "center";
			ctx.fillText(String.format("{0}", neighbor.h.toFixed(2)), l/2, -5);
			ctx.restore();
		}
	}
	if(optAITalkings && subject && aiWords != null)
	{
		padding = 4
		textHeight = 10

    	ctx.font="10px Verdana";

		box = {
			x: (subject.x + 1.5) * cellSize,
			y: (subject.y - 0.5) * cellSize,
			w: 0,
			h: padding}

		for(var index in aiWords)
		{
			aiWord = aiWords[index]
			measures = ctx.measureText(aiWord)
			box.w = Math.max(box.w, measures.width + 2 * padding)
			box.h += textHeight + padding
		}

		if(aiFunnyWords != null)
		{
			measures = ctx.measureText(aiFunnyWords)
			box.w = Math.max(box.w, measures.width + 2 * padding)
			box.h += textHeight + padding
		}

    	ctx.strokeStyle = "rgb(0,0,0)";
		ctx.lineWidth = 3;
    	ctx.fillStyle = "rgb(255,255,255)";

		ctx.fillRect (box.x, box.y, box.w, box.h);
		ctx.strokeRect (box.x, box.y, box.w, box.h);

		offset = 0.5 * 0.35 * Math.SQRT2
		ctx.beginPath();
		ctx.moveTo((subject.x + 0.5 + offset) * cellSize, (subject.y + 0.5 - offset) * cellSize); // offset a little
		ctx.lineTo(box.x, box.y + box.h);
		ctx.stroke();

		ctx.fillStyle = "rgb(0,0,0)";

		var y = 1
		for(var index in aiWords)
		{
			aiWord = aiWords[index]
			ctx.fillText(aiWord, box.x + padding, box.y + (padding + textHeight) * y);
			y += 1
		}

    	if(aiFunnyWords != null)
		{
			ctx.font="italic 10px Verdana";
			ctx.fillStyle = "rgb(127,127,127)";
    		ctx.fillText(aiFunnyWords, box.x + padding, box.y + (padding + textHeight) * y);
		}
	}

}