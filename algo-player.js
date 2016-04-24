
var AlgoPlayer = function()
{
	this.algo = null
	this.stepMode = false
	this.autoStart = true
	this.running = false
	this.timer = null
	this.stepPerSeconds = 1

	this.init = function()
	{
		if(this.autoStart)
		{
			this.start()
		}
	},

	this.start = function()
	{
		this.pause()

		if(!this.running)
		{
			this.algo.reset()
			this.algo.init()
		}

		this.running = true

		this.nextStep()
	}

	this.nextStep = function()
	{
		if(!this.algo.step())
		{
			this.algo.reset()
			this.algo.init()
		}

		this.algo.draw()

		if(!this.stepMode)
		{
			self = this
			this.timer = window.setTimeout(function(){self.nextStep()}, 1000.0 / this.stepPerSeconds)
		}

	}

	this.stop = function()
	{
		this.pause()
		this.running = false
		if(this.algo != null)
		{
			this.algo.reset()
			this.algo.draw()			
		}
	}

	this.pause = function()
	{
		if(this.timer != null)
	    {
	    	window.clearTimeout(this.timer)
	    	this.timer = null
	    }
	}


}