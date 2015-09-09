'use strict';

// Configuring the User Admin module
angular.module('users.admin').run(['Menus',
  function (Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'View Timezones',
      state: 'admin.users'
    });
  }
]);
