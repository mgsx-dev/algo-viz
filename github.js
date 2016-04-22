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

	this.username = username
	this.password = password
	this.searchRequestsLimit = null
	this.searchRequestsRemaining = null
	this.requestsLimit = null
	this.requestsRemaining = null
	this.onStatsCallback = null
	this.requestCount = 0

	this.onStats = function(callback){this.onStatsCallback = callback}

	this.commits = function(user, repository, callback){
		this.path("/repos/" + user + "/" + repository + "/commits", callback)
	}
	this.searchUserRepositories = function(user, options, callback){
		this.searchRepositories("user:" + user, options, callback)
	}
	this.searchRepositories = function(q, options, callback){
		this.path("search/repositories?q=" + q, callback)
	}
	this.path = function(path, callback){
		this.get("https://api.github.com/" + path, callback)
	}
	this.get = function(url, callback){
		self = this
		this.requestCount++
		$.ajax({
			url: url,
			beforeSend: function (xhr){ 
				console.log(self.username)
				if(self.username) xhr.setRequestHeader('Authorization', make_base_auth(self.username, self.password)); 
		    }
		}).done(function(data, status, request){
			remaining = request.getResponseHeader('X-RateLimit-Remaining')
			limit = request.getResponseHeader('X-RateLimit-Limit')
			if(url.indexOf("https://api.github.com/search/") === 0)
			{
				self.searchRequestsLimit = limit
				self.searchRequestsRemaining = remaining
			}
			else
			{
				self.requestsLimit = limit
				self.requestsRemaining = remaining
			}
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
  console.log(atob(hash))
  return "Basic " + hash;
}
