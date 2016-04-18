
var AIThoughts = [
	"Do you really undertand why I'm doing this ? Cause I'm not.",
	"I Know, it looks like a cross-words map, but it's not.",
	"Do you even look at what I'm sayin ?",
	"I'm pretty confident on this one !",
	"I'm a little tired doing this, but who cares ?",
	"Are you an AI ? cause I'm wondering if I am too !",
	"You know you can tweak me, right?",
	"This is the A-STAR Algorithm, does it make me a star ?",
	"Do you get I can say weird thing or not ?"
]

var contextualAIThoughts = {
	obstacle: {
		hint: function(node){
			return ["I can't go there, it's an obstacle."]
		},
		funny: [
			"Would you notice if I pass throw sometimes ?",
			"Obstacles ... I definitely hate them !"
	]},
	complete: {
		hint: function(node){
			return ["I already know a good path to this one, It can't be better from here."]
		},
		funny: [
			"Maybe I should check again ... did you changed my environnement ?",
			"I know the good path, no doubt !"
	]},
	better: {
		hint: function(node){
			return ["This path seams better from here ... I reevaluate it"]
		},
		funny: [
			"I wasn't wrong, it's just I didn't know there was a better one ...",
			"Sometimes you have to change your mind, it can prevent to be stuck.",
			"Old path to it is maybe the worse path ever !"
		]
	},
	worse: {
		hint: function(node){
			return ["This path doesn't worth it. I know better path to it."]
		},
		funny: [
			"Let's give it up this time ...",
			"I know a lot of things as you can see !"
		]
	},
	best: {
		hint: function(node){
			return ["This one might be on the best path, so let's continue with it."]
		},
		funny: [
			"This decision is based on my optimism. It worth what it worth ...",
			"Numbers speaks, there's no black magik here !"
		]
	},
	evaluate: {
		hint: function(node){
			words = []
			words.push(String.format("Cost from source to this one is {0}", node.cost.toFixed(2)))
			if(node.z >= 1)
				words.push("this one is clear, it won't cost me so much") // TODO diagonal !
			else
				words.push("this one is forest, it will cost me more") // TODO diagonal !
			words.push(String.format("Cost to destination is evaluated to {0}", node.h.toFixed(2)))
			words.push(String.format("So total cost from source to destination might be {0}", node.dist.toFixed(2)))
			return words
		},
		funny: [
			"This kind of computation give me artificial headake !",
			"Double check numbers if you don't trust me.",
			"If you understand that, good for you ! You don't need me anymore."
		]
	},
	destination: {
		hint: function(node){
			return ["Destination found ! Let's go backward following the bread crumps."]
		},
		funny: [
			"Then what the meaning of all this ? What's the goal ? What's my goal ... ?",
			".... Finally !!",
			"It reminds me Hop-o'-My-Thumb, you ?"
		]
	},
	parent: {
		hint: function(node){
			return ["Best path lead from here"]
		},
		funny: [
			"I hope it lead to the source ... if not there's something wrong in my algorithm.",
			"Nothing clever here, I just follow the track actually"
		]
	},
	parentSource : {
		hint: function(node){
			return ["Best path lead from here, which is the source, Won !"]
		},
		funny: [
			"We did it ! I was pretty confident in my algorithm.",
			"What I won ? To retry again and again right ?"
		]
	},
	impossible: {
		hint: function(node){
			return ["Destination can't be reached"]
		},
		funny: [
			"That happens sometimes, sorry.",
			"Ooops",
			"Damn obstacles !!"
		]
	},
	explore: {
		hint: function(node){
			if(node == src)
				return ["Let's start from here ! And see what's around, GO !"]
			else
				return [String.format("Path to this one cost {0}, let's explore neighborhood !", node.cost)]
		},
		funny: [
			"I hope it's a good neighborhood though ...",
			"I hope reach the destination soon ..."
		]
	}
}