/* Magic Mirror
    * Module: MMM-NHL
    *
    * By cowboysdude
    * 
    */
   
Module.register("MMM-NHL", {
       
        requiresVersion: "2.1.0",
       
       // Module config defaults.
       defaults: {
           updateInterval: 60*1000, // every 10 minutes
           animationSpeed: 10,
           initialLoadDelay: 4950, // 0 seconds delay
           retryDelay: 1500,
           maxWidth: "25%",
           fadeSpeed: 11,
           rotateInterval: 5 * 1000, //20 seconds
           header: false,
           focus_on: [],
           
           
           teamsArray: {
      "1":"Devils",
      "2":"Islanders",
      "3":"Rangers",
      "4":"Flyers",
      "5":"Penguins",
      "6":"Bruins",
      "7":"Sabres",
      "8":"Canadiens",
      "9":"Senators",
      "10":"Maple Leafs",
      "12":"Hurricanes",
      "13":"Panthers",
      "14":"Lightning",
      "15":"Capitals",
      "16":"Black Hawks",
      "17":"Red Wings",
      "18":"Predators",
      "19":"Blues",
      "20":"Flames",
      "21":"Avalanche",
      "22":"Oilers",
      "23":"Canucks",
      "24":"Ducks",
      "25":"Stars",
      "26":"Kings",
      "28":"Sharks",
      "29":"Blue Jackets",
      "30":"Wild",
      "52":"Jets",
      "53":"Coyotes",
      "54":"Golden Knights"
    },
    
    logoArray: {
      "1":"NJD.svg",
      "2":"NYI.svg",
      "3":"NYR.svg",
      "4":"PHI.svg",
      "5":"PIT.svg",
      "6":"BOS.svg",
      "7":"BUF.svg",
      "8":"MTL.svg",
      "9":"OTT.svg",
      "10":"TOR.svg",
      "12":"CAR.svg",
      "13":"FLA.svg",
      "14":"TBL.svg",
      "15":"WSH.svg",
      "16":"CHI.svg",
      "17":"DET.svg",
      "18":"NSH.svg",
      "19":"STL.svg",
      "20":"CGY.svg",
      "21":"COL.svg",
      "22":"EDM.svg",
      "23":"VAN.svg",
      "24":"ANA.svg",
      "25":"DAL.svg",
      "26":"LAK.svg",
      "28":"SJS.svg",
      "29":"CBJ.svg",
      "30":"MIN.svg",
      "52":"WPG.svg",
      "53":"ARI.svg",
      "54":"VGK.svg"
    }
       },
       
       // Define required scripts.
       getScripts: function() {
           return ["moment.js"];
       },
       
       getStyles: function() {
           return ["MMM-NHL.css"];
       },

       // Define start sequence.
       start: function() {
           Log.info("Starting module: " + this.name);
           this.sendSocketNotification('CONFIG', this.config);
            var start_time=moment().format("YYYY-MM-DD");
            var new_date=moment(start_time, "YYYY-MM-DD").add(1,'days');
            var day = new_date.format('DD');
            var month = new_date.format('MM');
            var year = new_date.format('YYYY');
            var end_time = year + '-' + month + '-' + day;
           
           // Set locale.
           this.url = "https://statsapi.web.nhl.com/api/v1/schedule?startDate=2017-02-04&endDate=2017-02-05&expand=schedule.linescore";
           //this.url = "https://statsapi.web.nhl.com/api/v1/schedule?startDate=2017-10-04&endDate=2017-10-05&expand=schedule.linescore";
           //this.url = "https://statsapi.web.nhl.com/api/v1/schedule?startDate="+start_time+"&endDate="+end_time+"&expand=schedule.linescore";
           this.nhl = {};
           this.today = "";
           this.activeItem = 0;
           this.rotateInterval = null;
           this.scheduleUpdate();
       },
       
    processNHL: function(data) {
         this.nhl = data.games;              
         this.loaded = true;
     },
     
    scheduleCarousel: function() {
       		console.log("Scheduling NHL board");
	   		this.rotateInterval = setInterval(() => {
				this.activeItem++;
				this.updateDom(this.config.animationSpeed);
			}, this.config.rotateInterval);
	   },
     
     scheduleUpdate: function() {
         setInterval(() => {
             this.getNHL();
         }, this.config.updateInterval);
         this.getNHL(this.config.initialLoadDelay);
         var self = this;
     },

     getNHL: function() {
         this.sendSocketNotification('GET_NHL', this.url);
     },

     socketNotificationReceived: function(notification, payload) {
         if (notification === "NHL_RESULT") {
             this.processNHL(payload);
             if(this.rotateInterval == null){
			   	this.scheduleCarousel();
			   }
               this.updateDom(this.config.animationSpeed);
         }
         this.updateDom(this.config.initialLoadDelay);
     },

      getDom: function() {
      	
      	
      	var pDir = "<img src=modules/MMM-NHL/images/";

         var humordiv = document.createElement("div");
           humordiv.classList.add("light", "small");
           humordiv.style.maxWidth = this.config.maxWidth;
           
           var today = moment().format('M-D-YYYY');
          var wrapper = document.createElement("div");
          if (this.config.header == true){
		   var header = document.createElement("header");
		   header.style.maxWidth = "30%";
		   header.innerHTML = "<img src=modules/MMM-NHL/images/nhlsmall.png>&nbsp;&nbsp;NHL "+today;
          wrapper.appendChild(header);	
		  }
console.log(this.nhl);
		  
          if (!this.loaded) {
             wrapper.innerHTML = "<img src = modules/MMM-NHL/images/nhl.png>"+ " " +"Dropping the puck...";
             return wrapper;
			}  

          var keys = Object.keys(this.nhl);
              if (keys.length > 0) {
            if (this.activeItem >= keys.length) {
                this.activeItem = 0;
           }
           var nhl = this.nhl[keys[this.activeItem]];
           
    //if (this.nhl != null || undefined || "" && this.config.focus_on != null || undefined || ""){
            var NHLTable = document.createElement("table");
            NHLTable.setAttribute('style', 'table-layout:fixed;');
           
            var Row = document.createElement("tr");
            var tcolumn = document.createElement("th");
                tcolumn.setAttribute("colspan", 9);
		        tcolumn.classList.add("align-left", "bright", "small");
		        if (nhl.linescore.currentPeriodTimeRemaining == null || undefined) {
		            tcolumn.innerHTML = "Preview";
		            } else if  (nhl.linescore.currentPeriod  > 3){
		            tcolumn.innerHTML = nhl.linescore.currentPeriodTimeRemaining+ " OT";
					} else if (nhl.linescore.currentPeriod == "Final"){
					tcolumn.innerHTML = "Final";
					} else{
					tcolumn.innerHTML = nhl.linescore.currentPeriodTimeRemaining;	
					}
		        
		        Row.appendChild(tcolumn);
		        NHLTable.appendChild(Row);
            
            var locationRow = document.createElement("tr");
            var dposition = document.createElement("th");
            dposition.setAttribute("colspan", 9);
			dposition.innerHTML = "";
			locationRow.appendChild(dposition);
			NHLTable.appendChild(locationRow);

            var dspace = document.createElement("th");
            dspace.setAttribute("colspan", 5);
			dspace.innerHTML = "";
			locationRow.appendChild(dspace);
			NHLTable.appendChild(locationRow);
	        
	        
	        var Tpoints = document.createElement("th");
			Tpoints.classList.add("small","bright");
			Tpoints.innerHTML = "1";
			locationRow.appendChild(Tpoints);
			NHLTable.appendChild(locationRow);

			var playpoints = document.createElement("th");
			playpoints.classList.add("small","bright");
			playpoints.innerHTML = "2";
			locationRow.appendChild(playpoints);
			NHLTable.appendChild(locationRow);
			
			var playrank = document.createElement("th");
			playrank.classList.add("small","bright");
			playrank.innerHTML = "3";
			locationRow.appendChild(playrank);
			NHLTable.appendChild(locationRow);
			
			if (nhl.linescore.currentPeriod > 3){
			var OTP = document.createElement("th");
			//OTP.setAttribute("colspan", 1);
			OTP.classList.add("small","bright");
			OTP.innerHTML = "OT";
			locationRow.appendChild(OTP);
			NHLTable.appendChild(locationRow);
			}
			
			humordiv.appendChild(NHLTable);
			wrapper.appendChild(humordiv);
			
			var Homerow = document.createElement("tr");
			
		    var aimage = document.createElement("td");
		    aimage.setAttribute("colspan", 11);
		    aimage.classList.add("align-left","small","bright");
	        aimage.innerHTML = pDir+this.config.logoArray[nhl.teams.away.team.id]+" width=19% height=18%> "+this.config.teamsArray[nhl.teams.away.team.id]+ " <font color=#76D7C4>("+nhl.teams.away.leagueRecord.wins+" - "+nhl.teams.away.leagueRecord.losses+")</font>";	
			Homerow.appendChild(aimage);
			NHLTable.appendChild(Homerow);
			
			
			// logo pDir+this.config.logoArray[nhl.teams.away.team.id]+"> "+
			//+ " <font size=2%>("+nhl.teams.away.leagueRecord.wins+" - "+nhl.teams.away.leagueRecord.losses+")</font>"
			
			
			var aspacer = document.createElement("td");
			aspacer.setAttribute("colspan", 3);
			aspacer.classList.add("small","bright");
	        aspacer.innerHTML = "";	
			Homerow.appendChild(aspacer);
			NHLTable.appendChild(Homerow);
			
			
			var apts = document.createElement("td");
			
			apts.classList.add("small","bright");
			if (nhl.linescore.currentPeriod != "0"){
			apts.innerHTML = nhl.linescore.periods[0].home.goals;	
			} else{
			apts.innerHTML = "0";	
			}
			Homerow.appendChild(apts);
			NHLTable.appendChild(Homerow);
			
			var appts = document.createElement("td");
			appts.classList.add("small","bright");
			if (nhl.linescore.currentPeriod != "0"){
	        appts.innerHTML = nhl.linescore.periods[1].home.goals;
	        } else{
	         appts.innerHTML = "0";
			}	
			Homerow.appendChild(appts);
			NHLTable.appendChild(Homerow);
			
			var aprank = document.createElement("td");
			aprank.classList.add("small","bright");
			if (nhl.linescore.currentPeriod != "0"){
	        aprank.innerHTML = nhl.linescore.periods[2].home.goals;
	        } else{
	        aprank.innerHTML = "0";
			}	
			Homerow.appendChild(aprank);
			NHLTable.appendChild(Homerow);
			
			if (nhl.linescore.currentPeriod  > 3){
			var abpts = document.createElement("td");
			abpts.classList.add("small","bright");
	        abpts.innerHTML = nhl.linescore.periods[3].home.goals;	
			Homerow.appendChild(abpts);
			NHLTable.appendChild(Homerow);
				}
			
			var Awayrow = document.createElement("tr");
		    var himage = document.createElement("td");
		    himage.setAttribute("colspan", 11);
		    himage.classList.add("align-left","small","bright");
	        himage.innerHTML = pDir+this.config.logoArray[nhl.teams.home.team.id]+" width=19% height=19%> "+this.config.teamsArray[nhl.teams.home.team.id]+ " <font color=#76D7C4>("+nhl.teams.home.leagueRecord.wins+" - "+nhl.teams.home.leagueRecord.losses+")</font>";	
			Awayrow.appendChild(himage);
			NHLTable.appendChild(Awayrow);
			
			//logo pDir+this.config.logoArray[nhl.teams.home.team.id]+"> "+
			//+ " <font size=2%>("+nhl.teams.home.leagueRecord.wins+" - "+nhl.teams.home.leagueRecord.losses+")</font>"
			
			var hspacer = document.createElement("td");
			hspacer.setAttribute("colspan", 3);
			hspacer.classList.add("small","bright");
	        hspacer.innerHTML = "";	
			Awayrow.appendChild(hspacer);
			NHLTable.appendChild(Homerow);
			
			
			var pts = document.createElement("td");
			pts.setAttribute("colspan", 1);
			pts.classList.add("small","bright");
			if (nhl.linescore.currentPeriod != "0"){
	        pts.innerHTML = nhl.linescore.periods[0].away.goals;
			}else{
			pts.innerHTML = "0";		
			}	
			Awayrow.appendChild(pts);
			NHLTable.appendChild(Awayrow);
			
			var ppts = document.createElement("td");
			ppts.setAttribute("colspan", 1);
			ppts.classList.add("small","bright");
			if (nhl.linescore.currentPeriod != "0"){
	        ppts.innerHTML = nhl.linescore.periods[1].away.goals;
	        }else{
	        ppts.innerHTML = "0";
			}
			Awayrow.appendChild(ppts);
			NHLTable.appendChild(Awayrow);
			
			var prank = document.createElement("td");
			prank.setAttribute("colspan", 1);
			prank.classList.add("small","bright");
			if (nhl.linescore.currentPeriod != "0"){
	        prank.innerHTML = nhl.linescore.periods[2].away.goals;
	        }else{
	        prank.innerHTML = "0";
			}
			Awayrow.appendChild(prank);
			NHLTable.appendChild(Awayrow);
	
			if (nhl.linescore.currentPeriod  > 3){
			var bpts = document.createElement("td");
			bpts.setAttribute("colspan", 1);
			bpts.classList.add("small","bright");
	        bpts.innerHTML = nhl.linescore.periods[3].away.goals;	
			Awayrow.appendChild(bpts);
			NHLTable.appendChild(Awayrow);
			}
			
			var homeTeam = this.config.teamsArray[nhl.teams.home.team.id];
			var visitTeam = this.config.teamsArray[nhl.teams.away.team.id];
			
			
			
			var HomeTemp = document.createElement("tr");
			var homesog = document.createElement("td");
			homesog.setAttribute("colspan", 12);
			homesog.classList.add("small","bright");
			if (nhl.linescore.currentPeriodTimeRemaining != "Final" || null && nhl.linescore.currentPeriod === "0"){
			var gameDate = moment(nhl.gameDate).format("MM-DD-YYYY");
			var gameDay =  moment(gameDate).format('dddd');
			var gameTime = moment(nhl.gameDate).format("h:mm a");
	        homesog.innerHTML =  "Upcoming<br> "+gameDay+" "+gameDate+ " @ "+gameTime;
	        }else {
	        var hSog = nhl.linescore.periods[1].home.shotsOnGoal;
			var aSog = nhl.linescore.periods[1].away.shotsOnGoal;	
	        homesog.innerHTML = "Shots on Goal: <br>"+homeTeam+ " ~"+hSog+ " / "+visitTeam+"  ~"+aSog;
			}
			HomeTemp.appendChild(homesog);
			NHLTable.appendChild(HomeTemp);
			
			if(nhl.linescore.currentPeriod != "Final")
			var VenueTemp = document.createElement("tr");
			var venueHome = document.createElement("td");
			venueHome.setAttribute("colspan", 12);
			venueHome.classList.add("small","bright");
			venueHome.innerHTML = "Venue: "+nhl.venue.name;
			VenueTemp.appendChild(venueHome);
			NHLTable.appendChild(VenueTemp);
			}
			
		//} else {
		//	var noGame = document.createElement("div");
		//	noGame.setAttribute("colspan", 12);
		//	noGame.classList.add("small","bright");
	      //  noGame.innerHTML = "No Matches scheduled";	
			//NHLTable.appendChild(noGame);
	//	  }
			return wrapper;
			},
 });