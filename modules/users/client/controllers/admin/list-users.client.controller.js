'use strict';

angular.module('users.admin').controller('UserListController', ['$scope', '$filter', 'Admin',
  function ($scope, $filter, Admin) {
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
                $scope.timezoneGroups[$scope.timezoneGroups.length - 1].UTCDelta = 
                    OffsetStringFormatter( $scope.users[kk].timezoneOffset );
            }
        }
        console.dir($scope.timezoneList);
        
        function OffsetStringFormatter (DeltaAsNumber) {
            var DeltaAsString = "";
            DeltaAsString = DeltaAsNumber >= 0 ? "+" : "-";
            DeltaAsString = DeltaAsString.concat(DeltaAsNumber.toString());
            return DeltaAsString;
        }
    };
  }
]);
