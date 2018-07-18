export class Controller {
  /*@ngInject*/
  constructor($state) {
    this.$state = $state;

    this.FormData = {
      ...this.options,
    };
  }

  onSubmit() {
    const data = {
      options: {
        ...this.FormData,
      },
    };

    this.$state.go('app.dataset.wizard.name', data);
  }
}
