/*@ngInject*/
const popup = ($state, ngDialog) => {
  let cbValue = null;

  ngDialog.open({
      template: `<advanced-filters-popup close-this-dialog="closeThisDialog"></advanced-filters-popup>`,
      plain: true,
      className: 'ngdialog-theme-default big',
      preCloseCallback: (value) => {
        cbValue = value;
        return true;
      },
    })
    .closePromise.then(() => {
      if (cbValue !== 'redirect') {
        $state.go('^');
      }
    });
};

/*@ngInject*/
const State = $stateProvider => {
  $stateProvider.state('app.transform.grid.filters', {
    url: '/filters',
    onEnter: popup,
  });
};

export default State;
