(function(angular) {
  'use strict';
angular.module('users', [])
  .service('userService', UserService)

  /*User component where the user routes are configured*/
  .component('users', {
    template: '<ng-outlet></ng-outlet>',
    $routeConfig: [
      {path: '/',    name: 'UserList',   component: 'userList', useAsDefault: true},
      {path: '/:id', name: 'UserDetail', component: 'userDetail'}
    ]
  })

  .component('contentEditable', {
    templateUrl: 'ContentEditableComponent.html',
      bindings: {
        user: '='
      },
    controller: ContentEditableComponent
  })

  /*User List Component*/
  .component('userList', {
    template:
      '<h2>List of Users</h2>\n' +
      '<div id="delete-button">\n'+
      '   <button type="button" class="btn btn-primary" ng-click=$ctrl.deleteUser(user)>Delete</button>'+
      '</div>\n' +
      '<div ng-repeat="user in $ctrl.users | orderBy : \'first_name\'" ' +
      '     ng-class="{ selected: $ctrl.isSelected(user) }">\n' +
      '<input type="checkbox" ng-click=$ctrl.selectedUserToDelete(user)>'+
        '<a ng-link="[\'UserDetail\', {id: user.id}]">{{user.first_name}} {{user.last_name}}</a>\n' +
      '</div>',
    controller: UserListComponent
  })

  /*User details Component*/
  .component('userDetail', {
    templateUrl: 'UserDetailComponent.html',
    controller: UserDetailComponent,
    bindings: { 
      $router: '<',
      user: '<'
    },
  });

/*user service*/
function UserService($http, $q) {
	var CsvToJsonData = $http.get("user-data.csv").then(function(response){
		return convertCsvToJson(response.data);
	});
	var userList = $q.resolve(CsvToJsonData);//defer csvToJsonData

  this.getUser = function(id) {
    return userList.then(function(users) {
    for (var index = 0; index < users.length; index++) {//Iterating through the userList promise coll
      if (users[index].id === id)                       // to return the user details of the selected user 
        return users[index];
    }
    });
  };
  
  this.getUsers = function () {
		return userList;//Returning userList promise collection to populate user list
	}

  /*parsing CSV to convert it into an object of array*/
	var convertCsvToJson = function(csv) {
		var lines=csv.split("\n");
		var jsonArray = [];
		var headers=lines[0].split(",");//separating the headers
		for(var index=1;index<lines.length;index++){
		  var obj = {};
		  var currentline=lines[index].split(",");//splitting each line to retrieve individual data of every user to form a user object
		  for(var j=0;j<headers.length;j++){
        if(currentline[j] == ""){
            break;//Condition to make sure there is no object with empty strings
        }
			  obj[headers[j]] = currentline[j];//Forming obj of every user
		  }
		  obj['id'] = index;
		  jsonArray.push(obj);//Creating an array of user Objects
		}
		return jsonArray;
	}
}

/*Controller for userListComonent*/
function UserListComponent(userService) {
  var selectedId = null;
  var $ctrl = this;
  $ctrl.toBeDeletedUsers=[];

  this.$routerOnActivate = function(next) {
    userService.getUsers().then(function(users) {//Req to fetch user data to populate user list
      $ctrl.users = users;
    });
  };

  this.isSelected = function(user) {
    return (user.id === selectedId);//Highlighting the selected user on returning back to user list from user details
  };
  
  this.deleteUser = function(){
    var selectedIndex;
    for(var index=0; index<$ctrl.toBeDeletedUsers.length; index++){//Iterating thru the list of users selected for deletion to delete
      selectedIndex =$ctrl.users.indexOf($ctrl.toBeDeletedUsers[index]);//Getting index of selected user for deletion from user list
       if(selectedIndex > -1){
         $ctrl.users.splice(selectedIndex, 1);//Removing user to be deleted from main collection
       }
    }
  }
  
  this.selectedUserToDelete = function(user){
    $ctrl.toBeDeletedUsers.push(user);//list of users selected for deletion
  }
}

/*controller for userDetailsComponent*/
function UserDetailComponent(userService) {
  var $ctrl = this;

  this.$routerOnActivate = function(next) {
    var id = next.params.id;//Fetching id from routeParams
     userService.getUser(id).then(function(user){//Req to fetch details of the selected user
       $ctrl.user = user;
     })
  };

  this.gotoUsers = function() {
    var userId = this.user && this.user.id;
    this.$router.navigate(['UserList', {id: userId}]);//Navigate back to user list on click of Back button
  };

  /*this.saveUsers = function(){
    $ctrl.user = $ctrl.editUser;
    $ctrl.gotoUsers();
  }*/
}

/*controller of contentEditable component*/
function ContentEditableComponent(){
   var $ctrl = this;
   $ctrl.editMode = false;

  this.handleModeChange = function() {
    $ctrl.editMode = !$ctrl.editMode;//Toggling to hide and show span and input element
  };
}
})(window.angular);this.$onInit = function() {
    $ctrl.fieldValueCopy = $ctrl.user;
  };
