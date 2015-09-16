//Global var, the current 10 matches
var matches;

var currFriends;
var chatInfo;
var myInfo;
var curTripId;
var curCity;
var curCountry;
angular.module('starter.controllers', ['ngCordova' ,'ngCordovaOauth'])

  .controller('LoginCtrl',function($scope, $cordovaOauth,$state){
    $scope.login = function() {
      //console.log("something called");
      $cordovaOauth.linkedin('75raqzxpgqo73n','hLVHrUKJRsBNSfAG',['r_basicprofile'],'spaghettiandmeatballs248').then(function(result) {
        $.get("https://api.linkedin.com/v1/people/~:(id,location,formatted-name,industry,summary,specialties,positions,headline,picture-urls::(original),picture-url,interests,languages,skills,date-of-birth)?oauth2_access_token=" + result.access_token + "&format=json", {}, function(data)
        	{
	        	$.post("http://kawaiikrew.net/www/php/login.php", 
	        	{  formattedName:data.formattedName,
		           id:data.id,
		           headline:data.headline,
		           pictureUrl:data.pictureUrl,
		           pictureUrls:data.pictureUrls,
		           industry:data.industry,
		           positions:data.positions,
		           summary:data.summary
	        	}, function(returnMessage)
	        	{
		        	if (returnMessage == "connect")
		        	{
			        	$state.go("tab.connect");
		        	}
		        	else if (returnMessage == "setup")
		        	{
			        	//test
			        	$state.go("setup");
		        	}
	        	});
        	});
        //$state.go("tab.connect");
      }, function(error) {
        console.log(error);
      });
    }
  })

  .controller('ConnectTabCtrl', function($scope, $state, $timeout) {
    console.log('ConnectTabCtrl');  
	$scope.trips = [];

        $.get("http://kawaiikrew.net/www/php/get_user_data.php").done(function(data){
            data=JSON.parse(data);
            myInfo={};
            myInfo["name"]=data.name;
            myInfo["pic"]=data.picFull;
            myInfo['id']=data.id;
            console.log("my own data is:"+myName+"   "+myID+"   "+myPic);
            console.log(data);
        })



    $.get("http://kawaiikrew.net/www/php/get_trips.php", {}, function(data) {
      var parsed = JSON.parse(data);
      if (parsed.length == 1)
      {
        var connectEmpty = document.getElementById("ty-connect-empty");
        connectEmpty.style.visibility = "visible";
      }

      for(var i = 0; i < parsed.length; i++)
      {
        var obj = parsed[i];
        var fullPlaceName = obj.city + ", " + obj.country;
        if (obj.startDate == null)
        {
          $scope.trips.push(
            {
	          id:obj.id,  
              displayString:fullPlaceName,
              tripClass:"ty-trip-icon ty-hometown ty-vertical",
              icon:"ty-vertical icon ion-heart",
              dateString:"Hometown",
              backgroundImage:obj.backgroundImage,
              city:obj.city,
              country:obj.country
            });  
        }
        else
        {
          $scope.trips.push(
            {
	          id:obj.id,
              displayString:fullPlaceName,
              tripClass:"ty-trip-icon ty-trip ty-vertical",
              icon:"ty-vertical icon ion-plane",
              dateString:convertDate(obj.startDate) + " - " + convertDate(obj.endDate),
              backgroundImage:obj.backgroundImage,
              city:obj.city,
              country:obj.country
            });
        }
      }
      $scope.$digest();
    });
    
    $scope.goToMatch = function(type, id, city, country) {
		if( deleteOn ){
			return;
		}
	
	    if (!id)
	    {
		    id = 0;
	    }
	    curTripId = id;
	    curCity = city;
	    curCountry = country;
	    var key = id;
        if (type != "Hometown")
        {
            type = "Travel";
        }
        else
        {
	        key = "user";
        }
	    matches = [];
	    $.get("http://kawaiikrew.net/www/php/match.php", 
	    {
            type:type,
            key:key
	    }, function(data){
		    if (data)
		    {
			    matches = JSON.parse(data);
		    }
		  $state.go("tab.user_profile");
	    })
    }
	
	// Delete trips
	var deleteOn = false;
	var deleteTripsId = [];
	var numDelete = 0;
	
	$scope.deleteTrips = function() {
		numDelete = 0;
		deleteTripsId = [];
		
		if( !deleteOn ) {
			$( ".ty-add-button" ).css( "display", "none" );
			$( ".ty-delete-button" ).css( "display", "inline-block" );
			$( ".ty-delete-button" ).text( "Delete 0 Trips" ); 
			$( ".ty-trip-next" ).css( "display", "none" );
			
			deleteOn = true;
		}
		else {
			$( ".ty-delete-overlay" ).css( "opacity", 0 );
			$( ".ty-checkbox-placeholder" ).removeClass( "ty-vertical ty-delete-checkbox icon ion-checkmark-circled" );
			$( ".ty-delete-button" ).css( "display", "none" );
			$( ".ty-add-button" ).css( "display", "inline-block" );
			$( ".ty-trip-next" ).css( "display", "inline-block" );
			
			deleteOn = false;
		}
	}
	
	$scope.hideTrip = function() {
		if( numDelete > 0 ) {
			for(var i = 0; i < deleteTripsId.length; i++) {
				console.log("i");
				for(var j = 0; j < $scope.trips.length; j++) {
					console.log("i'm here");
					if( $scope.trips[j].id === deleteTripsId[i] ) {
						console.log("deleting " + $scope.trips[j].id);
						$scope.trips.splice(j, 1);
					}
				}
				
				$timeout(function() {
					$scope.$apply();
				});
				
				$.post("http://kawaiikrew.net/www/php/delete_trip.php", 
				{
					tripId:deleteTripsId[i]
				}, function(data){
				})
			}
			
			$( ".ty-delete-overlay" ).css( "opacity", 0 );
			$( ".ty-checkbox-placeholder" ).removeClass( "ty-vertical ty-delete-checkbox icon ion-checkmark-circled" );
			$( ".ty-delete-button" ).css( "display", "none" );
			$( ".ty-add-button" ).css( "display", "inline-block" );
			$( ".ty-trip-next" ).css( "display", "inline-block" );
			
			deleteTripsId = [];
			deleteOn = false;
		}
	}
	
	$scope.updateTripsNum = function() {
		if( numDelete == 1 ) { 
			$( ".ty-delete-button" ).text( "Delete " + numDelete + " Trip" ); 
		}
		else { 
			$( ".ty-delete-button" ).text( "Delete " + numDelete + " Trips" ); 
		}
	}
	
	$scope.deleteSelect = function(id){
		if( !deleteOn ) { return; }
		else {
			var tripIndex = deleteTripsId.indexOf(id);
			if( tripIndex != -1 ) {
				numDelete--;
				$( "#" + id + " .ty-delete-overlay" ).css( "opacity", 0 );
				$( "#" + id + " .ty-checkbox-placeholder" ).removeClass( "ty-vertical ty-delete-checkbox icon ion-checkmark-circled" );
				$scope.updateTripsNum();
				deleteTripsId.splice(tripIndex, 1);
			}
			else {
				deleteTripsId.push(id);
				numDelete++;
				$scope.updateTripsNum();
				//console.log( id );
				
				$( "#" + id + " .ty-delete-overlay" ).css( "opacity", 0.25 );
				$( "#" + id + " .ty-checkbox-placeholder" ).addClass( "ty-vertical ty-delete-checkbox icon ion-checkmark-circled" );
			}
		}
	}
  })

  .controller('MessagesTabCtrl', function($scope, $state) {
        console.log('MessagesTabCtrl');
        currFriends=[];
        $scope.trips = [];
        $.get("http://kawaiikrew.net/www/php/get_trips.php", {}, function(data) {
            var parsed = JSON.parse(data);

            for(var i = 0; i < parsed.length; i++)
            {
                var obj = parsed[i];
                var fullPlaceName = obj.city + ", " + obj.country;
                if (obj.startDate == null)
                {
                    $scope.trips.push(
                        {
                            id:0,
                            displayString:fullPlaceName,
                            tripClass:"ty-trip-icon ty-hometown ty-vertical",
                            icon:"ty-vertical icon ion-heart",
                            dateString:"Hometown",
                            backgroundImage:obj.backgroundImage
                        });
                }
                else
                {
                    $scope.trips.push(
                        {
                            id:obj.id,
                            displayString:fullPlaceName,
                            tripClass:"ty-trip-icon ty-trip ty-vertical",
                            icon:"ty-vertical icon ion-plane",
                            dateString:convertDate(obj.startDate) + " - " + convertDate(obj.endDate),
                            backgroundImage:obj.backgroundImage
                        });
                }
            }
            $scope.$digest();
        });

        $scope.getConversations=function(tripId){
            console.log(tripId);
            $.get("http://kawaiikrew.net/www/php/get_friends.php",
            {
                trip:tripId
            }).done(function(data){
                currFriends=JSON.parse(data);
                console.log(currFriends)
                if(data.length>0){
                    $state.go('tab.conversations');
                }
                else{
                    $state.go('tab.conversations');
                }
                })
        }
    })

  .controller('CalendarTabCtrl', function($scope) {
    console.log('CalendarTabCtrl');
    $scope.meetings = [];
    $scope.requestNum = 0;
    $scope.requestText = "requests.";
    $.get("http://kawaiikrew.net/www/php/get_meetings.php", {}, function(data){
	    var parsed = JSON.parse(data);
		for(var i = 0; i < parsed.length; i++)
		{
		  var obj = parsed[i];
		  var date = convertDate(obj.date);
		  var dateFields = date.split(" ");
		  $scope.meetings.push(
		  {
			id:obj.id,
			date:date,
			day:dateFields[1],
			month:dateFields[0],
			time:obj.time,
			place:obj.place,
			picFull:obj.picFull,
			name:obj.name
		  });
	    }
	    $scope.$digest();
    })
    
    $.get("http://kawaiikrew.net/www/php/get_num_meeting_request.php", {}, function(data){
	    $scope.requestNum = data;
	    if (data == 1)
	    {
		    $scope.requestText = "request.";
	    }
	    else
	    {
		    $scope.requestText = "requests.";
	    }
	    $scope.$digest();
    })
  })
  
  .controller('MakeMeetingCtrl', function($scope, $state) {
	  console.log('MakeMeetingCtrl');
	  $scope.trips = [];
	  $scope.friends = [];
	  $scope.picture;
	  $scope.name;
	  var trips = document.getElementById('trips-list');
	  var friends = document.getElementById('friendlist');
	  var meeting = document.getElementById('add-meeting');
	  var friendID;
	  
	  trips.style.display = "block";
	  friends.style.display = "none";
	  meeting.style.display = "none";
	  
	  $.get("http://kawaiikrew.net/www/php/get_trips.php", {}, function(data) 
	  {
		  var id;
		  var dateString;
		  var icon;
		  var tripClass;
		  var conversationId;
		  
	      var parsed = JSON.parse(data);
		  	for(var i = 0; i < parsed.length; i++)
		  	{
		  		var obj = parsed[i];
		  		if (i == 0)
		  		{
			  		id = 0;
			  		dateString = "Hometown";
			  		icon = "ty-vertical icon ion-heart";
			  		tripClass = "ty-trip-icon ty-hometown ty-vertical";
		  		}
		  		else
		  		{
			  		id = obj.id;
			  		dateString = convertDate(obj.startDate) + " - " + convertDate(obj.endDate);
			  		icon = "ty-vertical icon ion-plane";
			  		tripClass = "ty-trip-icon ty-trip ty-vertical";
		  		}
		  		var fullPlaceName = obj.city + ", " + obj.country;
		        $scope.trips.push(
		        {
			      id:id,
	              displayString:fullPlaceName,
	              tripClass:tripClass,
	              icon:icon,
	              dateString:dateString,
	              backgroundImage:obj.backgroundImage
		        });
	        }
	        $scope.$digest();
	  });
	  
	  $scope.goToFriends = function(id)
	  {		  
		  trips.style.display = "none";
		  friends.style.display = "block";
		  meeting.style.display = "none";
		  
		  $.get("http://kawaiikrew.net/www/php/get_friends.php", {trip:id}, function(friendData)
		  {
			 var parsedFriends = JSON.parse(friendData);
			 for (var i = 0; i < parsedFriends.length; i++)
			 {
				 var friend = parsedFriends[i];
				 $scope.friends.push({
					 id:friend.id,
					 name:friend.name,
					 picFull:friend.picFull,
					 conversation:friend.conversationId 
				 });
			 }
			 
			 $scope.$digest(); 
		  });
	  }
	  
	  $scope.goToPlan = function(id, name, picture, convo)
	  {
		  trips.style.display = "none";
		  friends.style.display = "none";
		  meeting.style.display = "block";
		  
		  $scope.name = name;
		  $scope.picture = picture;
		  
		  friendID = id;
		  conversationId = convo;
	  }
	  
	  $scope.makeMeeting = function()
	  {
		  var date = document.getElementById('date').value;
		  var time = document.getElementById('time').value;
		  var place = document.getElementById('place').value;
		  
		  
		  $.post("http://kawaiikrew.net/www/php/request_meeting.php", 
		  {
			  date:date,
			  time:time,
			  place:place,
			  userId:friendID,
			  conversationId:conversationId
		  }, function (data)
		  {
		  	if (data == "Success")
		  	{
			  	$state.go('tab.calendar');
		  	}
		  });
	  }
  })

  .controller('RequestCtrl', function($scope) {
	  console.log('RequestCtrl');
	  $scope.requests = [];
	  $.get("http://kawaiikrew.net/www/php/get_meeting_requests.php", {}, function(data){
		var parsed = JSON.parse(data);
		for (var i = 0; i < parsed.length; i++)
		{
			var obj = parsed[i];
			var date = convertDate(obj.date);
		    var dateFields = date.split(" ");
			$scope.requests.push({
				meetingId:obj.meetingId,
				userId:obj.userId,
				name:obj.name,
				picFull:obj.picFull,
				date:date,
				fullDate:obj.date,
				time:obj.time,
				place:obj.place,
				month:dateFields[0],
				day:dateFields[1],
				conversationId:obj.conversationId
			});
			
		}
			 
		$scope.$digest(); 
	  })
	  
	  $scope.accept = function(request)
	  {
		  $.post("http://kawaiikrew.net/www/php/add_meeting.php", 
		  {
			  userId:request.userId,
			  date:request.fullDate,
			  time:request.time,
			  place:request.place,
			  conversationId:request.conversationId
		  }, function(data){
			  if (data == "Success")
			  {
				$.post("http://kawaiikrew.net/www/php/delete_meeting_request.php", 
				{
					requestId:request.meetingId,
		  		}, function(data){
		  			if (data == "Success")
		  			{
		  				for (var f = 0; f < ($scope.requests).length; f++)
		  				{
		  					if (request.id == ($scope.requests[f]).id)
		  					{
		  						($scope.requests).splice(f, 1);
		  						$scope.$digest();
					  		}
				  		}
			  		}
			  		else
			  		{
			  			alert(data);
			  		}
		  		})
		  	  }
		  	  else
		  	  {
			  	alert(data);
		  	  }
		  })
	  }
	  
	  $scope.reject = function(request)
	  {
		  $.post("http://kawaiikrew.net/www/php/delete_meeting_request.php", 
		  {
			  requestId:request.meetingId,
		  }, function(data){
			  if (data == "Success")
			  {
				  for (var f = 0; f < ($scope.requests).length; f++)
				  {
					  if (request.id == ($scope.requests[f]).id)
					  {
						  ($scope.requests).splice(f, 1);
						  $scope.$digest();
					  }
				  }
			  }
			  else
			  {
				  alert(data);
			  }
		  })
	  }
  })

  .controller('SetupTabCtrl', function($scope, $state) {
    console.log('SetupTabCtrl');
    var city;
    var country;
    var preferences;
    var interests;
    var languages;
    var bio;
    
    var firstPage = document.getElementById('ty-setup-step-1');
    var secondPage = document.getElementById('ty-setup-step-2');
    var thirdPage = document.getElementById('ty-setup-step-3');
	
    var firstPageIcon = document.getElementById('ty-setup-icon-1');
    var secondPageIcon = document.getElementById('ty-setup-icon-2');
    var thirdPageIcon = document.getElementById('ty-setup-icon-3');
	
    var firstBar = document.getElementById('ty-bar-1');
    var secondBar = document.getElementById('ty-bar-2');
	
	
    $scope.firstToSecondPage = function() {
	    var location = document.getElementById('hometownTextField');
	    var locationSplit = (location.value).split(", ");
	    city = locationSplit[0];
	    country = locationSplit[1];
	    firstPage.style.display = "none";
	    secondPage.style.display = "block";
	    thirdPage.style.display = "none";
		firstBar.className += " ty-setup-current";
		secondPageIcon.className += " ty-setup-current";
    }
    
    $scope.secondToThirdPage = function() {
	    preferences = document.getElementById('ty-pref1').value;
	    firstPage.style.display = "none";
	    secondPage.style.display = "none";
	    thirdPage.style.display = "block";
		secondBar.className += " ty-setup-current";
		thirdPageIcon.className += " ty-setup-current";
    }
    
    $scope.secondToFirstPage = function() {
	  	firstPage.style.display = "block";
	    secondPage.style.display = "none";
	    thirdPage.style.display = "none";
		firstBar.className = "ty-prog-bar";
		secondBar.className = "ty-prog-bar";
		secondPageIcon.className = "ty-setup-icon"; 
		thirdPageIcon.className = "ty-setup-icon"; 
    }
    
    $scope.thirdToSecondPage = function() {
	    firstPage.style.display = "none";
	    secondPage.style.display = "block";
	    thirdPage.style.display = "none"; 
		secondBar.className = "ty-prog-bar";
		thirdPageIcon.className = "ty-setup-icon";
    }
    
    $scope.finish = function(){
	    interests = document.getElementById('interests').value;
	    bio = document.getElementById('ty-about-input').value;
	    if (bio.length > 140)
	    {
		    alert("Please enter a bio less than 140 characters. Your current bio has " + bio.length + " characters");
		    return;
	    }
	    languages = document.getElementById('ty-language-input').value;
	    
	    $.post("http://kawaiikrew.net/www/php/add_profile_info.php", 
	    {
		    bio:bio,
		    city:city,
		    country:country,
		    preferences:preferences,
		    languages:languages,
		    interests:interests
	    }, function(data) 
	    {
		    if (data=="Success")
		    {
				$state.go("tab.connect");
			}
	    });
    }
    
    //TODO: figure out a way to get autocomplete for this
    /*autocomplete = new google.maps.places.Autocomplete(
      (document.getElementById('hometownTextField')),
      {types: ['(cities)']});
    google.maps.event.addListener(autocomplete, 'place_changed', function()
    {
      var place = autocomplete.getPlace();
      for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        if (addressType == 'locality')
        {
          var val = place.address_components[i]['long_name'];
          alert("adding city of " + val);
          city = val;
        }
        if (addressType == 'country')
        {
          var val = place.address_components[i]['long_name'];
          alert("Adding country of " + val);
          country = val;
        }
      }
    })*/
  })

  .controller('NewTripTabCtrl', function($scope, $state) {
    console.log('NewTripTabCtrl');
    
	$scope.makeTrip = function() {
		var location = document.getElementById('cityTextField').value;
		var locationSplit = location.split(", ");
	    var city = locationSplit[0];
	    var country = locationSplit[1];
	    var startDate = document.getElementById('start-date').value;
	    var endDate = document.getElementById('end-date').value;
	    if (startDate != null && endDate != null)
	    {
		    $.post("http://kawaiikrew.net/www/php/add_trip.php", 
		    {
			    Start:startDate,
			    End:endDate,
			    Country:country,
			    City:city
		    },
		    function(data)
		    {
			    if (data == "Successfully inserted")
			    {
				    $state.go('tab.connect');
			    }
		    });
	    }
	    else
	    {
		    //TODO: print error message
	    }
	}

    /*autocomplete = new google.maps.places.Autocomplete(
      (document.getElementById('cityTextField')),
      {types: ['(cities)']});
    google.maps.event.addListener(autocomplete, 'place_changed', function()
    {
      var place = autocomplete.getPlace();
      for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        if (addressType == 'locality')
        {
          var val = place.address_components[i]['long_name'];
          alert("adding city of " + val);
          city = val;
        }
        if (addressType == 'country')
        {
          var val = place.address_components[i]['long_name'];
          alert("Adding country of " + val);
          country = val;
        }
      }
    })*/
  })

  .controller('MatchCtrl', function($scope, $state, $ionicModal) {
	  console.log("MatchCtrl");
	  
	  $.get("http://kawaiikrew.net/www/php/get_user_pic.php", {}, function(data)
	  {
		  var self = JSON.parse(data);
		  $scope.selfPic = self.picThumbnail;
	  });
	  
	  var profilePage = document.getElementById('user-profile');
	  var buttons = document.getElementById('acceptreject');
	  var emptyPage = document.getElementById('empty');
	  profilePage.style.display = "block";
	  buttons.style.display = "block";
	  emptyPage.style.display = "none";
	  
	  $scope.modalPic;
	  $scope.modalName;
	  $scope.modalFirstName;

	  if (matches.length == 0)
	  {
		profilePage.style.display = "none";
		buttons.style.display = "none";
		emptyPage.style.display = "block";
		return;
	  }
	  else
	  {
	  	  var user = matches[0];
		  $scope.name = user.name;
	      fullName = (user.name).split(" ");
	      $scope.firstName = fullName[0];
	      $scope.headline = user.headline;
	      $scope.hometown = user.city + ", " + user.country;
	      $scope.bio = user.bio;
	      $scope.picFull = user.picFull;
	      $scope.interests = user.interests;
	      $scope.languages = user.languages;
	      $scope.id = user.id; 
	  }
      
      $scope.accept = function(){
	      $scope.modalPic = $scope.picFull;
	      $scope.modalName = $scope.name;
	      $scope.modalFirstName = $scope.firstName;
		  //$scope.openModal();
		  $.get("http://kawaiikrew.net/www/php/accept.php", 
		  {
			  otherUser:matches[0].id,
			  trip:curTripId,
			  city:curCity,
			  country:curCountry
		  }, function(data) {
			  if (data == "New conversation made")
              {
                  $scope.openModal();
              }
		  });
	      matches.shift();
	      if (matches.length == 0)
	      {
		    profilePage.style.display = "none";
			buttons.style.display = "none";
			emptyPage.style.display = "block";
		    return;
	      }
	      user = matches[0];
		  $scope.name = user.name;
	      fullName = (user.name).split(" ");
	      $scope.firstName = fullName[0];
	      $scope.hometown = user.city + ", " + user.country;
	      $scope.headline = user.headline;
	      $scope.bio = user.bio;
	      $scope.picFull = user.picFull;
	      $scope.favoriteFoods = user.favoriteFoods;
	      $scope.languages = user.languages;
	      $scope.id = user.id;
      }
      
      $scope.reject = function(){
	      $.post("http://kawaiikrew.net/www/php/reject.php",
          {
              otherUser:matches[0].id,
              trip:curTripId,
              city:curCity,
              country:curCountry
          }, function(data)
          {
              //alert(data);
          });
	      matches.shift();
	      if (matches.length == 0)
	      {
		      profilePage.style.display = "none";
			  buttons.style.display = "none";
			  emptyPage.style.display = "block";
		      return;
	      }
	      user = matches[0];
		  $scope.name = user.name;
	      fullName = (user.name).split(" ");
	      $scope.firstName = fullName[0];
	      $scope.headline = user.headline;
	      $scope.hometown = user.city + ", " + user.country;
	      $scope.bio = user.bio;
	      $scope.picFull = user.picFull;
	      $scope.favoriteFoods = user.favoriteFoods;
	      $scope.languages = user.languages;
	      $scope.id = user.id; 
      }
    
      $scope.message = function()
      {
	      $state.go("tab.messages");
      }
    
      $ionicModal.fromTemplateUrl('match-modal.html', {
		scope: $scope,
		animation: 'fade-in'
	  }).then(function(modal) {
		$scope.modal = modal;
	  });
	  $scope.openModal = function() {
		$scope.modal.show();
		$( ".ty-match" ).fadeIn( "slow" );
		$( ".ty-match-left" ).animate( { "margin-left":"+=5em" }, "slow" );
		$( ".ty-match-right" ).animate( { "margin-right":"+=5em" }, "slow" );
	  };
	  $scope.closeModal = function() {
		$scope.modal.hide();
	  };
	  //Cleanup the modal when we're done with it!
	  $scope.$on('$destroy', function() {
		$scope.modal.remove();
	  });
	  // Execute action on hide modal
	  $scope.$on('modal.hidden', function() {
		// Execute action
		$( ".ty-match-left" ).animate( { "margin-left":"-5em" }, "slow" );
		$( ".ty-match-right" ).animate( { "margin-right":"-5em" }, "slow" );
	  });
	  // Execute action on remove modal
	  $scope.$on('modal.removed', function() {
		// Execute action
	  });	
  })

  .controller('EditProfileCtrl', function($scope, $state) {
	console.log('EditProfileCtrl');
	$scope.update = function() {
		$.get("http://kawaiikrew.net/www/php/get_user_data.php", {}, function(data)
		{
			var user = JSON.parse(data);
			var favoriteFoods = user.favoriteFoods;
			var bio = user.bio;
			var languages = user.languages;
			var city = user.city;
			var country = user.country;
			var preferences = user.preferences;
			
			if (document.getElementById('cityTextField').value != "")
			{
				var location = (document.getElementById('cityTextField').value).split(", ");
				city = location[0];
				country = location[1];	
			}
			if (document.getElementById('favoriteFoodsTextField').value != "")
			{
				favoriteFoods = document.getElementById('favoriteFoodsTextField').value;
			}
			if (document.getElementById('ty-language-input').value != "")
			{
				languages = document.getElementById('ty-language-input').value;
			}
			if (document.getElementById('ty-about-input').value != "")
			{
				bio = document.getElementById('ty-about-input').value;
			}
			
			$.post("http://kawaiikrew.net/www/php/add_profile_info.php", 
			{
				bio:bio,
				city:city,
				country:country,
				preferences:preferences,
				languages:languages,
				favoriteFoods:favoriteFoods
			}, function(data) 
			{
				if (data=="Success")
				{
					$state.go("tab.me");
				}
			});
	    });
	}
  })

	.controller('ChatCtrl', function($scope,$interval) {
        console.log(chatInfo);
        var myID=myInfo.id;
        var convoID=chatInfo.tripId;
        //-------------------
        //get my own info
        //---------------------
        var otherID=chatInfo.id;
		$scope.inputMessage=" ";
		var lastMessageIndex=0;

		//me
		$scope.me={
			name:myInfo.name,
			id:myInfo.id,
			pic:"../img/white.png",
            class:"ty-me"
		};
		//other person
		$scope.other={
			name:chatInfo.name,
			id:otherID,
			pic:chatInfo.pic,
            class:"ty-other-person"
		};
		//initial message load----------------------------------------
		$scope.messages=[];
		$.get( "http://kawaiikrew.net/www/php/retrieve_message.php", { conversationID: convoID, limit: 30 } )
			.done(function( data ) {
				data=JSON.parse(data);
                console.log("------------------")
                console.log("all messages");
                console.log(data);
				for(var i =0; i<data.length;i++){

					if(data[i].from==myID){
						$scope.messages.push({
							time:data[i].time,
							message:data[i].message,
							person:$scope.me.name,
							pic:$scope.me.pic,
                            class: $scope.me.class
						})
					}
					else{
						$scope.messages.push({
							time:data[i].time,
							message:data[i].message,
							person:$scope.other.name,
							pic:$scope.other.pic,
                            class:$scope.other.class
						})
					}
					if(data[i].id>lastMessageIndex){
						lastMessageIndex=data[i].id;
					}
				}
			})
		//send messages--------------------------------------------------
		$scope.sendMessage=function(){
			$scope.messages.push({
				time:"2015-3-10",
				message:$scope.inputMessage,
				person:$scope.me.name,
				pic: $scope.me.pic,
                class: $scope.me.class
			});
            console.log($scope.inputMessage);
			$.post( "http://kawaiikrew.net/www/php/add_message.php", { text: $scope.inputMessage, to:$scope.other.id, convoID:convoID, time:"2015-08-26", id:convoID}, function(data, status){
				lastMessageIndex = data;
			});
			$scope.inputMessage=" ";
            console.log($scope.inputMessage);
		}
		//update messages------------------------------------------------
		$interval(function(){
			$.get("http://kawaiikrew.net/www/php/update_message.php",
				{conversationID : convoID, index:lastMessageIndex},
				function(data) {
					var parsed = JSON.parse(data);
					for(var i = 0; i < parsed.length; i++) {
						var obj = parsed[i];
						lastMessageIndex = obj.id;
						if (obj.from == $scope.me.id)
						{
							$scope.messages.push({
								message: obj.message,
								time:obj.time,
								person:$scope.me.name,
								pic:$scope.me.pic,
                                class:$scope.me.class
							});
						}
						else
						{
							$scope.messages.push({
								message:obj.message,
								time:obj.time,
								person:$scope.other.name,
								pic:$scope.other.pic,
                                class:$scope.other.class
							});
						}
					}
                    console.log($scope.messages)
					$scope.$digest();
				}
			);},5000)
		})


	.controller('ConversationsCtrl',function($scope,$state){
		//console.log("ConversationsCtrl");
        $scope.friends=currFriends;
        console.log("currFriends");
        console.log(currFriends);
        $scope.goToChat=function(tripId,id,pic,name){
            console.log("id for go to chat is"+id);
            chatInfo={};
            chatInfo["tripId"]=tripId;
            chatInfo["id"]=id;
            chatInfo["pic"]=pic;
            chatInfo["name"]=name;
            $state.go("tab.chat");
        }
	})


  .controller('MeTabCtrl', function($scope) {
    //console.log('MeTabCtrl');
    $.get("http://kawaiikrew.net/www/php/get_user_data.php", {}, function(data)
    {
      var user = JSON.parse(data);
      $scope.name = user.name;
      fullName = (user.name).split(" ");
      $scope.firstName = fullName[0];
      $scope.headline = user.headline;
      $scope.hometown = user.city + ", " + user.country;
      $scope.bio = user.bio;
      $scope.picFull = user.picFull;
      $scope.interests = user.interests;
      $scope.languages = user.languages;
      $scope.$digest();
    });
  })
  
  .controller('ShowReviewsCtrl', function($scope, $ionicModal) {
	  $ionicModal.fromTemplateUrl('review-modal.html', {
		scope: $scope,
		animation: 'slide-in-up'
	  }).then(function(modal) {
		$scope.modal = modal;
	  });
	  $scope.openReviewModal = function() {
		//console.log("i got called");
		$scope.modal.show();
	  };
	  $scope.closeReviewModal = function() {
		$scope.modal.hide();
	  };
	  //Cleanup the modal when we're done with it!
	  $scope.$on('$destroy', function() {
		$scope.modal.remove();
	  });
	  // Execute action on hide modal
	  $scope.$on('modal.hidden', function() {
		// Execute action
	  });
	  // Execute action on remove modal
	  $scope.$on('modal.removed', function() {
		// Execute action
	  });
	})
	
	.controller('TypeReviewsCtrl', function($scope, $ionicModal) {
	  $ionicModal.fromTemplateUrl('type-review-modal.html', {
		scope: $scope,
		animation: 'slide-in-up'
	  }).then(function(modal) {
		$scope.modal = modal;
	  });
	  
		/*var isNeg = false;
		var isNeu = false;
		var isPos = false;*/
		  
	  $scope.openTypeReviewModal = function() {
		$scope.modal.show();
		
		var starOn = function(starNum) {
			$( "#ty-star-" + starNum ).addClass( "ty-star-selected" );
		}
		
		var starOff = function(starNum) {
			$( "#ty-star-" + starNum ).removeClass( "ty-star-selected" );
		}
		
		$( "#ty-star-1" ).on( "click", function() {
			starOn(1);
			starOff(2);
			starOff(3);
			starOff(4);
			starOff(5);
		});
		
		$( "#ty-star-2" ).on( "click", function() {
			starOn(1);
			starOn(2);
			starOff(3);
			starOff(4);
			starOff(5);
		});
		
		$( "#ty-star-3" ).on( "click", function() {
			starOn(1);
			starOn(2);
			starOn(3);
			starOff(4);
			starOff(5);
		});
		
		$( "#ty-star-4" ).on( "click", function() {
			starOn(1);
			starOn(2);
			starOn(3);
			starOn(4);
			starOff(5);
		});
		
		$( "#ty-star-5" ).on( "click", function() {
			starOn(1);
			starOn(2);
			starOn(3);
			starOn(4);
			starOn(5);
		});
		
		/*$( "#ty-sad-face" ).on("click", function() {
			if( !isNeg ){
				if( isPos ) { 
					$( "#ty-happy-face h6" ).css("font-weight", 400);  
					$( "#ty-happy-face img" ).attr("src", "img/happy-unselected.svg");
					isPos = false; 
				} 
				else { 
					$( "#ty-neutral-face h6" ).css("font-weight", 400);
					$( "#ty-neutral-face img" ).attr("src", "img/neutral-unselected.svg"); 
					isNeu = false;
				}
			
				$( "#ty-sad-face img" ).attr("src", "img/sad.svg");
				$( "#ty-sad-face h6" ).css("font-weight", 800);
				isNeg = true;
			}
		});
		$( "#ty-happy-face" ).on("click", function() {
			if( !isPos ){
				if( isNeg ) {
					$( "#ty-sad-face h6" ).css("font-weight", 400); 
					$( "#ty-sad-face img" ).attr("src", "img/sad-unselected.svg");
					isNeg = false; 
				} 
				else { 
					$( "#ty-neutral-face h6" ).css("font-weight", 400);
					$( "#ty-neutral-face img" ).attr("src", "img/neutral-unselected.svg"); 
					isNeu = false;
				}
			
				$( "#ty-happy-face img" ).attr("src", "img/happy.svg");
				$( "#ty-happy-face h6" ).css("font-weight", 800);
				isPos = true;
			}
		});
		$( "#ty-neutral-face" ).on("click", function() {
			if( !isNeu ){
				if( isNeg ) {
					$( "#ty-sad-face h6" ).css("font-weight", 400); 
					$( "#ty-sad-face img" ).attr("src", "img/sad-unselected.svg");
					isNeg = false; 
				} 
				else { 
					$( "#ty-happy-face h6" ).css("font-weight", 400);  
					$( "#ty-happy-face img" ).attr("src", "img/happy-unselected.svg");
					isPos = false; 
				}
				
				$( "#ty-neutral-face img" ).attr("src", "img/neutral.svg");
				$( "#ty-neutral-face h6" ).css("font-weight", 800);
				isNeu = true;
			}
		});*/
	  };
	  $scope.closeTypeReviewModal = function() {
		$scope.modal.hide();
		
		/*if( isNeg ) {
			$( "#ty-sad-face h6" ).css("font-weight", 400); 
			$( "#ty-sad-face img" ).attr("src", "img/sad-unselected.svg");
			isNeg = false; 
		} 
		else if ( isPos ) { 
			$( "#ty-happy-face h6" ).css("font-weight", 400);  
			$( "#ty-happy-face img" ).attr("src", "img/happy-unselected.svg");
			isPos = false; 
		}
		else { 
			$( "#ty-neutral-face h6" ).css("font-weight", 400);
			$( "#ty-neutral-face img" ).attr("src", "img/neutral-unselected.svg"); 
			isNeu = false;
		}*/
	  };
	  //Cleanup the modal when we're done with it!
	  $scope.$on('$destroy', function() {
		$scope.modal.remove();
	  });
	  // Execute action on hide modal
	  $scope.$on('modal.hidden', function() {
		// Execute action
	  });
	  // Execute action on remove modal
	  $scope.$on('modal.removed', function() {
		// Execute action
	  });
	})
	
//In the connect controller, convert the sql date string in the format yyyy-mm-dd to a more readable format
function convertDate(initial)
{
  values = initial.split("-");
  switch(values[1])
  {
    case '01':
      return "Jan " + values[2];
      break;
    case '02':
      return "Feb " + values[2];
      break;
    case '03':
      return "Mar " + values[2];
      break;
    case '04':
      return "Apr " + values[2];
      break;
    case '05':
      return "May " + values[2];
      break;
    case '06':
      return "Jun " + values[2];
      break;
    case '07':
      return "Jul " + values[2];
      break;
    case '08':
      return "Aug " + values[2];
      break;
    case '09':
      return "Sep " + values[2];
      break;
    case '10':
      return "Oct " + values[2];
      break;
    case '11':
      return "Nov " + values[2];
      break;
    case '12':
      return "Dec " + values[2];
      break;
  }
}
