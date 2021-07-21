angular
  .module('ohm-delivery', [])
  .factory('ohmSearchMVP', ['$http', function($http) {
    //This service will be in another file.
    //As it's a "pure js" service, it can ease the transition to another version of angular or even more incredible: another library/framework :)
    const viewModel = {};
    let callbackOnChange = () => null;
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
    return {loadByTrackingId, onChange:changeCallbackOnChange}
  }])
  .controller('tracking', ['$scope', 'ohmSearchMVP', function ($scope, ohmSearch) {
    //This will be the only "custom" code needed for this version of angular. 6 lines of code to be care of when we upgrade angular :)
    $scope.findByTrackingId = async function () {
      ohmSearch.onChange((viewModel)=> {
        this.viewModel = viewModel;
        $scope.$applyAsync();
      })
      await ohmSearch.loadByTrackingId(this.trackingId);
    }

  }]);
