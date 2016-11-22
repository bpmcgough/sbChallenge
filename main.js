angular.module("picker", [])
.directive("picker", () => {
  return {
    restrict: "E",
    template: "<input datepicker type='text' id='date' ng-model='date' placeholder='Set Date' autofocus /><input timepicker ng-disabled='disableTime' isWeekday='isWeekday' type='text' id='time' ng-model='time' placeholder='Time'/>",
    controller: "PickerCtrl"
  };
})
.directive("datepicker", () => {
  return {
      restrict: "A",
      // scope: {
      //   sbBeforeRenderItem: '&'  // included here per the req, but not used as date should never be disabled
      // },
      link: (scope, el, attr) => {
          el.datepicker({
            dateFormat: 'MM dd, yy'
          });
      }
  };
})
.directive("timepicker", ()=>{
  return {
    	restrict: "A",
      scope: {
        isWeekday: '=', // replaced sbBeforeRenderItem with binary
      },
      compile: (el, attrs)=>{
        el.timepicker();
        angular.element('picker').append(
          "<select id='timezone-picker' ng-model='timezone'>" +
            "<option value='EST'>Eastern Standard Time (EST)</option>" +
            "<option value='CST'>Pacific Standard Time(PST)</option>" +
            "<option value='CST'>Central Standard Time(PST)</option>" +
            "<option value='HST'>Hawaii-Aleutian Standard Time(HST)</option>" +
            "<option value='UTC10'>Chamarro Standard Time (UTC+10)</option>" +
          "</select>"
        );
      }
  };
})
.controller("PickerCtrl", function($scope) {
  $scope.disableTime = true;
  $scope.date = "";
  $scope.time = "";
  $scope.isWeekday = false;
  $scope.timezone = "EST";

  $scope.$watch("date", (newValue)=>{
    // if user deselects date, disable time and set to empty string
    if(newValue === ""){
      $scope.disableTime = true;
      $scope.time = "";
    } else {
      $scope.disableTime = false;
      let momentDate = moment(newValue);

      // check if it's a weekday
      if(momentDate.day() === 0 || momentDate.day() === 7){
        $scope.isWeekday = false;
        $scope.time = "";
        // remove and rerender timepicker element
        $('#time').timepicker("remove");
        $('#time').timepicker({
          minTime: '10:00am',
          maxTime: '4:00pm'
        });
      } else {
        $scope.isWeekday = true;
        $('#time').timepicker("remove");
        $('#time').timepicker({
          minTime: '7:00am',
          maxTime: '8:00pm'
        });
      }

    }
  });
});
