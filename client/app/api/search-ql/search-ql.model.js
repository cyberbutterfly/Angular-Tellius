import EventEmitter from "eventemitter3";

export class SearchQLModel extends EventEmitter {
  /*@ngInject*/
  constructor(ApiWrapper, DatasetStorageService, ErrorHandlerService) {
    super();
    this.DatasetStorageService = DatasetStorageService;
    this.sourceId              = [this.DatasetStorageService.__rootDataset.name];
    this.api                   = ApiWrapper;
    this.ErrorHandlerService   = ErrorHandlerService;
  }

  history(
    {
      partialQuery = '',
      maximumAllowedRows = 10,
    }
  ) {
    const payload = {
      'partialQuery': partialQuery,
      maximumAllowedRows,
    };

    return this.api.post('/history', payload, undefined, false);
  }

  makeQuery(
    {
      searchQL,
      maximumAllowedRows = 10,
    }
  ) {
    const payload = {
      'searchQL': searchQL || '',
      maximumAllowedRows,
    };
    const URL     = '/searchQL';

    return this.api.post(URL, payload, undefined, false)
      .then(res => {
        if (res.responseType === 'error') {
          this.ErrorHandlerService.error(res.msg);
        }
        return res;
      });
  }
}
