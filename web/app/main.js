angular
  .module('ohm-delivery', [])
  .factory('ohmSearchMVP', ['$http', function($http) {
    //This service will be in another file.
    //As it's a "pure js" service, it can ease the transition to another version of angular or even more incredible: another library/framework :)
    const viewModel = {
      notifications: []
    };
    let callbackOnChange = () => null;
    const markAsDelivered = async ({trackingId}) => {
      try {
        const response = await $http.post(`/ohms/search-tracking-id/${trackingId}/delivered`);
        viewModel.ohm = response.data;
      } catch (responseOrError) {
        viewModel.errorMessage = responseOrError.data.error || responseOrError.statusText || responseOrError.message;
      }
      callbackOnChange(viewModel);
    }
    const markAsRefused = async ({trackingId, reason}) => {
      try {
        const response = await $http.post(`/ohms/search-tracking-id/${trackingId}/refused`,{reason});
        viewModel.ohm = response.data;
      } catch (responseOrError) {
        viewModel.errorMessage = responseOrError.data.error || responseOrError.statusText || responseOrError.message;
      }
      callbackOnChange(viewModel);
    }
    const loadByTrackingId = async (trackingId) => {
      try {
        const response = await $http.get(`/ohms/search-tracking-id/${trackingId}`);
        if (response.status === 200) {
          viewModel.ohm = response.data;
          viewModel.errorMessage = '';
          callbackOnChange(viewModel);
        } else {
          viewModel.ohm = null;
          viewModel.errorMessage = `Error : ${response.statusText}`;
          callbackOnChange(viewModel);
        }
      } catch (responseOrError) {
        viewModel.ohm = null;
        viewModel.errorMessage = responseOrError.statusText || responseOrError.message;
        callbackOnChange(viewModel);
      }
    };
    const changeCallbackOnChange = (callback) => {
      callbackOnChange = callback
    }
    return {loadByTrackingId, markAsDelivered, markAsRefused, onChange:changeCallbackOnChange}
  }])
  .controller('tracking', ['$scope', 'ohmSearchMVP', function ($scope, ohmSearch) {
    //This will be the only "custom" code needed for this version of angular. The only part to care of when we upgrade angular (or move to another framework/lib) :)
    ohmSearch.onChange((viewModel)=> {
      console.log('New view model', {viewModel})
      $scope.viewModel = viewModel;
      $scope.$applyAsync();
    })
    
    $scope.findByTrackingId = async function () {
      await ohmSearch.loadByTrackingId(this.trackingId);
    }

    $scope.markAsDelivered = function (){
      ohmSearch.markAsDelivered({trackingId:this.viewModel.ohm.trackingId});
    }

    $scope.markAsRefused = function (){
      const reason = prompt('What is the reason?');
      ohmSearch.markAsRefused({trackingId:this.viewModel.ohm.trackingId, reason});
    }

  }]);
