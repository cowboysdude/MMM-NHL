/* Magic Mirror
 * Module: MMM-NHL
 *
 * By Cowboysdude
 *
 */
const NodeHelper = require('node_helper');

const request = require('request');

module.exports = NodeHelper.create({
	  
    start: function() {
    	console.log("Starting module: " + this.name);
    },
    
    getNHL: function(url) {
    	
    	
        request({
            url: url,
            method: 'GET'
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                var result = JSON.parse(body).dates[1];
                if(this.config.focus_on.length > 0){
                	result.games = result.games.filter((games) => {
if(this.config.focus_on.includes(this.config.teamsArray[games.teams.home.team.id]) || this.config.focus_on.includes(this.config.teamsArray[games.teams.away.team.id])){
	                	return true;
						} else {
						return false;
						}
					});
				}	
                this.sendSocketNotification('NHL_RESULT', result);
                
            }
        });
    },
    
    socketNotificationReceived: function(notification, payload) {
    	if(notification === 'CONFIG'){
			this.config = payload;
			} else if (notification === 'GET_NHL') {
                this.getNHL(payload);
            }
         }  
    });