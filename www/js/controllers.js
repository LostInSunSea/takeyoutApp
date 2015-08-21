angular.module('starter.controllers', ['ngCordova' ,'ngCordovaOauth'])






  .controller('LoginCtrl',function($scope, $cordovaOauth,$state){
    $scope.login = function() {
      //console.log("something called");
      $cordovaOauth.linkedin('75raqzxpgqo73n','hLVHrUKJRsBNSfAG',['r_basicprofile'],'spaghettiandmeatballs248').then(function(result) {
        $.get("https://api.linkedin.com/v1/people/~:(id,location,formatted-name,industry,summary,specialties,positions,headline,picture-urls::(original),picture-url,interests,languages,skills,date-of-birth)?oauth2_access_token=" + result.access_token + "&format=json", {}, function(data)
        {
	        alert(JSON.stringify(data));
        })
        //console.log(window.location.href);
        //$state.go("tab.connect");
        //console.log("why arent you working");
      }, function(error) {
        console.log(error);
      });
    }
  })

  .controller('ConnectTabCtrl', function($scope) {
    console.log('ConnectTabCtrl');
    $scope.trips = [];

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
  })

  .controller('MessagesTabCtrl', function($scope) {
    console.log('MessagesTabCtrl');
  })

  .controller('CalendarTabCtrl', function($scope) {
    console.log('CalendarTabCtrl');
  })

  .controller('SetupTabCtrl', function($scope) {
    console.log('SetupTabCtrl');
    var city;
    var country;
    autocomplete = new google.maps.places.Autocomplete(
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
    })
  })

  .controller('NewTripTabCtrl', function($scope) {
    console.log('NewTripTabCtrl');
    var city;
    var country;
    autocomplete = new google.maps.places.Autocomplete(
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
    })
  })

  .controller('MeTabCtrl', function($scope) {
    console.log('MeTabCtrl');
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
      $scope.$digest();
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
