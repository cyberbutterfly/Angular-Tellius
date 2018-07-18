import _ from 'lodash';

const normalize = (str) => {
  return str.trim()
    .toLowerCase()
    .replace(/@/g, '');
};

const getDiff = ({
  item,
  modelValue,
}) => {
  const regex = new RegExp('@', 'g');
  return (item.match(regex) || [])
    .length - (modelValue.match(regex) || [])
    .length;
};

export class SearchQLSearchController {
  /*@ngInject*/
  constructor($scope, $element, $q, SearchQLModel,
    SearchqlService,
    SearchQLStrategy,
    DatasetStorageService,
  ) {
    this.$scope = $scope;
    this.$element = $element;
    this.$q = $q;

    this.SearchQLModel = SearchQLModel;
    this.SearchqlService = SearchqlService;
    this.SearchQLStrategy = SearchQLStrategy;
    this.DatasetStorageService = DatasetStorageService;
    this.SearchQLStrategy.on('DATASET_CHANGED', this._rootChangeHandler, this);

    this.FormData = _.isNull(this.SearchQLStrategy.FormData) ? {
      query: {
        modelValue: '',
        value: '',
      },
    } : this.SearchQLStrategy.FormData;

    this.modelOptions = {
      debounce: 500,
    };

    this.suggestions = [];
  }

  _rootChangeHandler() {
    this.FormData = {
      query: {
        modelValue: '',
        value: '',
      },
    };
    this.SearchQLStrategy.lastResponse = null;
    this.SearchQLStrategy.removeListener('DATASET_CHANGED', this._rootChangeHandler);
  }

  onChangeHandler() {
    this.isActive({
      status: true,
    });

    const {
      modelValue,
      value,
    } = this.FormData.query;

    if (normalize(value) !== normalize(modelValue)) {
      this.FormData.query.modelValue = value;
    }

    this._querySearch()
      .then(data => {
        const {
          suggestions,
          responseType,
        } = data;
        this.SearchQLStrategy.lastResponse = data;

        if (responseType === 'autocomplete') {
          this.$scope.$apply(() => {
            this.suggestions = suggestions.map(item => {
              return {
                value: item.replace(/@/g, ''),
                modelValue: item,
              };
            });
          });
        } else {
          this.SearchQLStrategy.FormData = this.FormData;
          this.SearchQLStrategy.exec({
            type: data.responseType,
            data,
          });

          this.suggestions = [];
        }
      });
  }

  isShow() {
    this.isActive({
      status: this.suggestions.length > 0,
    });

    return this.suggestions.length > 0;
  }

  closeThis() {
    this.suggestions = [];
  }

  onFocus() {
    const lastResponse = this.SearchQLStrategy.lastResponse;
    if (lastResponse &&
      lastResponse.original === this.FormData.query.modelValue
    ) {
      this.suggestions = lastResponse.suggestions.map(item => {
        return {
          value: item.replace(/@/g, ''),
          modelValue: item,
        };
      });
    } else {
      this.onChangeHandler();
    }
  }

  onBlur() {
    if (!this.isShow) {
      this.isActive({
        status: false,
      });
    }
  }

  selectSuggestion({
    modelValue,
    value,
  }) {
    if (_.isString(value) && _.isString(modelValue)) {
      this.FormData.query = {
        modelValue,
        value,
      };
      this.$element[0].querySelector('input')
        .focus();
    }
  }

  prerenderSuggestion(suggestion) {
    const spaceLocation = suggestion.search(
      /(\S+ \S+ \S+ \S+ \S+ \S+ \S+ \S+ \S+ \S+ \S+)$/);
    if (spaceLocation > 0) {
      suggestion = '... ' + suggestion.substring(spaceLocation, suggestion.length);
    }
    return suggestion;
  }

  _querySearch() {
    const {
      modelValue,
    } = this.FormData.query;

    return this._getSuggestion({
        modelValue,
      })
      .catch(err => {
        console.error(err);
        return err;
      });
  }

  _getSuggestion({
    modelValue,
  }) {
    const handler = data => {
      let result = data;

      if (!_.isUndefined(data.modelValue)) {
        result = this._getSuggestion({
            modelValue: data.modelValue,
          })
          .then(handler);
      }
      return result;
    };

    this._getHistorySuggestion()
      .then(historySuggestions => {
        this.$scope.$apply(() => {
          this.historySuggestions = historySuggestions;
        });
        return historySuggestions;
      });

    return this.SearchQLModel.makeQuery({
        searchQL: modelValue,
      })
      .then(data => {
        const {
          responseType,
          suggestions,
        } = data;

        let result = data;

        if (responseType === 'autocomplete') {
          const replaceColumns = suggestions
            .filter(i => i.indexOf('@') !== -1)
            .filter(i => {
              return normalize(modelValue)
                .indexOf(normalize(i)) === 0;
            })
            .filter(i => {
              return i !== modelValue;
            })
            .map(i => {
              return i + modelValue.slice(i.length - getDiff({
                item: i,
                modelValue,
              }));
            });

          if (replaceColumns.length > 0 &&
            modelValue !== replaceColumns[0] &&
            replaceColumns[0].indexOf('@') !== -1) {
            result = {
              modelValue: replaceColumns[0],
            };
          }
        }
        return result;
      })
      .then(handler)
      .catch(err => {
        console.log(err);
        return err;
      });
  }

  _getHistorySuggestion() {
    const {
      modelValue,
    } = this.FormData.query;

    return this.SearchQLModel.history({
        partialQuery: modelValue,
      })
      .then(data => {
        const {
          rows,
        } = data;

        if (!_.isUndefined(rows)) {
          this.historySuggestions = rows.splice(0, 5)
            .map(i => {
              return {
                value: i[0].replace(/@/g, ''),
                modelValue: i[0],
              };
            });
        }

        return this.historySuggestions || [];
      });
  }
}
