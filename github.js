/* 
 * https://developer.github.com/v3/
 */

/*
TODO
GET /repos/:owner/:repo/stats/commit_activity
GET /repos/:owner/:repo/stats/participation
https://api.github.com/users/mgsx-dev/events/public
/search/issues
GET /repos/:owner/:repo/forks
GET /orgs/:org/members
https://developer.github.com/v3/search/#search-code
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

	this.onStats = function(callback){this.onStatsCallback = callback}

	this.commits = function(user, repository, callback){
		return this.path("/repos/" + user + "/" + repository + "/commits", callback)
	}
	this.searchUserRepositories = function(user, options, callback){
		return this.searchRepositories("user:" + user, options, callback)
	}
	this.searchRepositories = function(q, options, callback){
		return this.path("search/repositories?q=" + q, callback)
	}
	this.path = function(path, callback){
		return this.get("https://api.github.com/" + path, callback)
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
