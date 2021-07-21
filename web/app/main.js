angular
  .module('ohm-delivery', [])
  .controller('tracking', function ($scope, $http) {
    $scope.findByTrackingId = function () {
      $http.get(`/ohms/search-tracking-id/${this.trackingId}`)
        .then((response) => {
          if(response.status === 200){
            this.ohm = response.data;
            this.errorMessage = '';
          }else{
            this.ohm = null;
            this.errorMessage = `Error : ${response.statusText}`;
          }
        }, (response) => {
          this.ohm = null;
          this.errorMessage = `Error : ${response.statusText}`;
        });
    };
  });
