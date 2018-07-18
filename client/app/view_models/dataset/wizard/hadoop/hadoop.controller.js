export class HadoopController {
  /*@ngInject*/
  constructor($state, LoadAPI) {
    this.$state = $state;
    this.LoadAPI = LoadAPI;

    this.FormData = {
      sourcetype: 'parquet',
      ...this.options,
    };

    this.errors = [];
  }

  onSubmit() {
    this.$state.go('app.dataset.wizard.name', {
      options: {
        ...this.FormData,
      },
    });
  }
}
