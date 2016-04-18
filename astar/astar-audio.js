
$(function() {
	$.get('astar.pd', function(patchStr) {
	  patch = Pd.loadPatch(patchStr)
	  Pd.start()
	})
});

var AStarAudio = {

	_enabled: true,

	enabled: function(){
		return this._enabled
	},

	enable: function(state){
		if(state)
			Pd.start()
		else
			Pd.stop()
		_enabled = state
	},

}

// TODO POO

function pd_event(name){
	
	if(head)
	{
		Pd.send("pan", [head.x / gridWidth])
	}
	else
	{
		Pd.send("pan", [0.5])
	}
	// Pd.send(name, [500 / timeSlider.value])
	Pd.send(name, [500 / timeSlider.value])
}

function pd_free(freq, duration){
	
	Pd.send("pan", [0.5])
	Pd.send("free", [duration / timeSlider.value, freq])
}

function soundFromDistance(node, freq_min, freq_max, duration)
{
	dx = src.x - dst.x
	dy = src.y - dst.y
	dstBase = Math.sqrt(dx*dx+dy*dy)
	dx = node.x - dst.x
	dy = node.y - dst.y
	dstNode = Math.sqrt(dx*dx+dy*dy)
	rate = dstNode / dstBase
	freq = freq_min + (freq_max - freq_min) * (1 - rate)
	pd_free(freq , duration)
}