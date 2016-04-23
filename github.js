/**
 * This is an uncomplete JS implementation of GitHub API V3
 * https://developer.github.com/v3/
 */
var Github = function(username, password){

	var RateLimit = function(){
		this.limit = null
		this.remaining = null
		this.reset = null
		this.counter = 0
		this.checkRequest = function(){
			if(this.remaining != null && this.remaining == 0 && new Date(this.reset * 1000) > new Date()){
				return false
			}
			this.counter++
			return true
		}
		this.checkResponse = function(request){
			this.limit = parseInt(request.getResponseHeader('X-RateLimit-Limit'))
			this.remaining = parseInt(request.getResponseHeader('X-RateLimit-Remaining'))
			this.reset = parseInt(request.getResponseHeader('X-RateLimit-Reset'))
		}
	}

	this.username = username
	this.password = password
	this.searchRateLimit = new RateLimit()
	this.rateLimit = new RateLimit()
	this.onStatsCallback = null

	// callbacks

	this.onStats = function(callback){this.onStatsCallback = callback}


	// Low level API

	var main = this

	this.activity = {
		user: {
			// https://developer.github.com/v3/activity/events/#list-events-performed-by-a-user
			public_events: function(user, callback){
				return main.path("/users/" + user + "/events/public", callback)
			},
		}
	}
	this.gists = {}
	this.gitdata = {}
	this.issues = {}
	this.migration = {}
	this.miscellaneous = {}
	this.organizations = {
		// https://developer.github.com/v3/orgs/members/#members-list
		members: {
			all: function(organization, options, callback){
				return main.path("/orgs/" + organization + "/members", options, callback)
			}
		}
	}
	this.pullrequests = {}
	this.repositories = {
		// https://developer.github.com/v3/repos/commits/
		commits: function(user, repository, options, callback){
			return main.path("/repos/" + user + "/" + repository + "/commits", options, callback)
		},
		statistics: {
			// https://developer.github.com/v3/repos/statistics/#get-contributors-list-with-additions-deletions-and-commit-counts
			contributors: function(user, repository, callback){
				return main.path("/repos/" + user + "/" + repository + "/stats/contributors", {}, callback)
			},
			// https://developer.github.com/v3/repos/statistics/#get-the-last-year-of-commit-activity-data
			commits: function(user, repository, callback){
				return main.path("/repos/" + user + "/" + repository + "/stats/commit_activity", {}, callback)
			},
			// https://developer.github.com/v3/repos/statistics/#get-the-weekly-commit-count-for-the-repository-owner-and-everyone-else
			participation: function(user, repository, callback){
				return main.path("/repos/" + user + "/" + repository + "/stats/participation", {}, callback)
			}
		},
		// https://developer.github.com/v3/repos/forks/#list-forks
		forks: function(user, repository, options, callback){
			return main.path("/repos/" + user + "/" + repository + "/forks", options, callback)
		},
		collaborators: {
			// TODO is contributors are collaborators ???
			// https://developer.github.com/v3/repos/collaborators/#list-collaborators
			all: function(user, repository, callback){
				return main.path("/repos/" + user + "/" + repository + "/collaborators", {}, callback)
			},
		}
		

	}
	this.search = {
		// https://developer.github.com/v3/search/#search-repositories
		repositories: function(options, callback){return main.path("/search/repositories", options, callback)},
		// https://developer.github.com/v3/search/#search-issues
		issues: function(options, callback){return main.path("/search/issues", options, callback)},
		// https://developer.github.com/v3/search/#search-code
		code: function(options, callback){return main.path("/search/code", options, callback)},
		// https://developer.github.com/v3/search/#search-users
		users: function(options, callback){return main.path("/search/users", options, callback)},
	}
	this.users = {}
	this.enterprise = {}

	// High level API

	this.searchUserRepositories = function(user, callback){
		return this.search.repositories({q: "user:" + user}, callback)
	}

	// HTTP API

	this.path = function(path, options, callback){
		var url = "https://api.github.com" + path
		if(options != null)
		{
			var list = []
			for(var key in options){
				list.push(key + "=" + options[key])
			}
			if(list.length > 0){
				url += "?" + list.join("&")
			}
		}
		return this.get(url, callback)
	}
	this.get = function(url, callback){
		var isSearch = url.indexOf("https://api.github.com/search/") === 0
		var rateLimit = isSearch ? this.searchRateLimit : this.rateLimit
		if(!rateLimit.checkRequest()){
			console.warn("Github API limit reached, retry later.")
			return false
		}
		self = this
		$.ajax({
			url: url,
			beforeSend: function (xhr){ 
				if(self.username) xhr.setRequestHeader('Authorization', make_base_auth(self.username, self.password)); 
		    }
		}).done(function(data, status, request){
			rateLimit.checkResponse(request)
			if(self.onStatsCallback) self.onStatsCallback()
			meta = {}
			linkString = request.getResponseHeader('Link')
			if(linkString) 
			{
				links = linkString.split(",")
				for(var i in links)
				{
					groups = /<(.+)>; rel="(.+)"/.exec(links[i]);
					url = groups[1]
					cmd = groups[2]
					meta[cmd] = url
				}
			}
			callback(data, meta)
		}).fail(function(status) {
		    console.error(status)
		});
	}
}

function make_base_auth(user, password) {
  var tok = user + ':' + password;
  var hash = btoa(tok);
  return "Basic " + hash;
}
