var INSTA_API_BASE_URL = "https://api.instagram.com/v1";
var app = angular.module('Instamood',[]);

app.controller('MainCtrl', function($scope, $http) {
  // get the access token if it exists
	$scope.hasToken = true;
	var token = window.location.hash;
	console.log(token);
  if (!token) {
    $scope.hasToken = false;
  }
  token = token.split("=")[1];

  // $scope.getInstaPics = function() {
	  var path = "/users/self/media/recent";
	  var mediaUrl = INSTA_API_BASE_URL + path;
	  $http({
	    method: "JSONP",
	    url: mediaUrl,
	    params: {
	    	callback: "JSON_CALLBACK",
	    	access_token: "525930119.8ae6b7d.72297cc60b804c2ebb5250c3532e24ff"
	    }
	  }).then(function(response) {
	  console.log(response);
      $scope.picArray = response.data.data;

      var total_likes=0;
      var ego_likes=0;
      var cap_length=0;
      var hashtags=0;
      var daysOfWeek = [0,0,0,0,0,0,0];
      	for (var i=0; i<$scope.picArray.length; i++) {
      		total_likes+= $scope.picArray[i].likes.count;
      		if ($scope.picArray[i].user_has_liked === true) {
      			ego_likes+= 1;
      		}
      		var timestamp = $scope.picArray[i].created_time;
      		var n = new Date(timestamp*1000);
      		var weekday = ["Sunday","Monday","Tuesday", "Wednesday", "Thursday","Friday", "Saturday"];
      		var a = weekday[n.getDay()];
      		// $scope.picArray[i]["day"]=a;
      		console.log($scope.picArray[i]);
      		if(a === "Sunday") {
      			daysOfWeek[0]= daysOfWeek[0] +1;
      		} else if (a === "Monday") {
      			daysOfWeek[1]= daysOfWeek[1] +1;
      		} else if (a === "Tuesday") {
      			daysOfWeek[2]= daysOfWeek[2] +1;
      		} else if (a === "Wednesday") {
      			daysOfWeek[3]= daysOfWeek[3] +1;
      		} else if (a === "Thursday") {
      			daysOfWeek[4]= daysOfWeek[4] +1;
      		} else if (a === "Friday") {
      			daysOfWeek[5]= daysOfWeek[5] +1;
      		} else if (a === "Saturday") {
      			daysOfWeek[6]= daysOfWeek[6] +1;
      			}					
      		cap_length+= $scope.picArray[i].caption.text.length;
      		hashtags+= $scope.picArray[i].tags.length;
      	}
      	$scope.maxDay = daysOfWeek[0];
      	for (var j=0; j < daysOfWeek.length; j++) {
      		if (daysOfWeek[j] > $scope.maxDay) {
      			$scope.maxDay = weekday[j];
      		}
      	}

      	$scope.average_likes = total_likes/$scope.picArray.length;
      	$scope.ego_score = (ego_likes/$scope.picArray.length)*100;
      	$scope.brev_score = cap_length/$scope.picArray.length;
      	$scope.avg_hashs = hashtags/$scope.picArray.length;
      
      // sentiments
      var captions = "";
      for (var i=0; i < $scope.picArray.length; i++) {
      	captions+= $scope.picArray[i].caption.text;
      	analyzeSentiments(captions);
      	captions = "";
      }
      $scope.positivityArray = [];

	  });
   // };

var analyzeSentiments = function(i) {
// when you call this function, $scope.picArray should have an array of all 
// your instas. Use the sentiment analysis API to get a score of how positive your 
// captions are
	$http({
		method: 'GET',
		url: 'https://twinword-sentiment-analysis.p.mashape.com/analyze/',
		headers: {
				'X-Mashape-Key': 'Yhmp35boZ8mshGOC72fOoyPjh6UAp1a99LyjsnRsAa7PFxhbDl'
			},
		params: {
			text: i
		}
	}).then(function(response) {
		console.log(response);
		$scope.positivityArray.push(response.data.score);
		var currPos = 0;
		for (var i=0; i<$scope.positivityArray.length; i++) {
			currPos+=  $scope.positivityArray[i];
		}
		$scope.avg_pos = currPos/$scope.positivityArray.length;

	});
	



}


});
