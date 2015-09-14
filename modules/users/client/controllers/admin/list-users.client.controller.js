'use strict';

angular.module('users.admin').controller('UserListController', ['$scope', '$filter', 'Admin', '$state', '$interval',
  function ($scope, $filter, Admin, $state, $interval) {
    Admin.query(function (data) {
      $scope.users = data;
      $scope.buildPager();
    });

    $scope.buildPager = function () {
      $scope.timezoneGroups = [];
      $scope.timezoneList = [];
      $scope.figureOutItemsToDisplay();
    };

    $scope.figureOutItemsToDisplay = function () {
      $scope.users = $filter('filter')($scope.users, {
        $: $scope.search
      });
      $scope.timezoneGrouper();
    };
      
      //reload route periodically to check for updates
    $scope.autoRefresh = function () {
        $state.reload();
    };
    var reloader = $interval  (function(){
        $scope.autoRefresh();
    }, 10000);
      
      //takes in pre-searched array of users
      //sorts by user.timezoneOffset
      //creates array(timezones) of arrays(users in each timezone)
    $scope.timezoneGrouper =  function () {
        $scope.users = $filter('orderBy')($scope.users, 'timezoneOffset'); //this can easily be reversed
        var whichTimezone = 0;
        for (var kk=0; kk<$scope.users.length; kk++){
            whichTimezone = $scope.timezoneList.indexOf( $scope.users[kk].timezoneOffset );    
            if(whichTimezone !== -1 ){
                $scope.timezoneGroups[whichTimezone] = [].concat($scope.timezoneGroups[whichTimezone], $scope.users[kk]);
            }
            else{
                $scope.timezoneGroups[$scope.timezoneGroups.length] = [].concat($scope.users[kk]);
                $scope.timezoneList.push( $scope.users[kk].timezoneOffset );
                $scope.timezoneGroups[$scope.timezoneGroups.length - 1].UTCDelta = $scope.users[kk].timezoneOffset;
            }
        }
        
        $scope.timezoneListStrings = $scope.timezoneList.map(function(d){
            var output = "";
            output = d >= 0 ? "+" : "-";
            return output.concat(Math.abs(d).toString());
        });
        
        $scope.$watch($scope.timeFromOffset);
        
        $scope.timeFromOffset = function(UTCDelta){
            var temp = new Date();
            var output = new Date(temp.getUTCFullYear(), temp.getUTCMonth(), temp.getUTCDate(), (temp.getUTCHours() + UTCDelta), temp.getUTCMinutes(), temp.getUTCSeconds());
            return output;
        };
        
    };
  }
]);

      
      
      
      
      
      
      
      
      
      
      
