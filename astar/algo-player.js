
var timer = null

function task()
{
	AlgoPlayer.nextStep()
}

var AlgoPlayer = {

	algo: null,
	stepMode: false,
	autoStart: true,
	running: false,

	init: function()
	{
		if(this.autoStart)
		{
			this.start()
		}
	},

	start: function()
	{
		this.pause()

		if(!this.running)
		{
			this.algo.reset()
			this.algo.init()
		}

		this.running = true

		this.nextStep()
	},

	nextStep: function()
	{
		if(!this.algo.step())
		{
			this.algo.reset()
			this.algo.init()
		}

		this.algo.draw()

		if(!this.stepMode)
		{
			timer = window.setTimeout(task, 1000.0 / timeScale)
		}

	},

	stop: function()
	{
		this.pause()
		this.running = false
		if(this.algo != null)
		{
			this.algo.reset()
			this.algo.draw()			
		}
	},

	pause: function()
	{
		if(timer != null)
	    {
	    	window.clearTimeout(timer)
	    	timer = null
	    }
	}


}