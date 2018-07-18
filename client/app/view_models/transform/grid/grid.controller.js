import _ from 'lodash';

export class GridController {
  /*@ngInject*/
  constructor($scope, GridService, ColumnAPI, DatasetAPI, DatasetStorageService,
    ContextMenuService, CellService) {
    this.selectedColumn = null;
    this.selectedColumns = DatasetStorageService.getColumns();
    this.selectedStatsColumn = null;

    this.$scope = $scope;
    this.GridService = GridService;
    this.ColumnAPI = ColumnAPI;
    this.DatasetStorageService = DatasetStorageService;
    this.ContextMenuService = ContextMenuService;
    this.CellService = CellService;

    this.dataSource = {
      rowCount: null,
      pageSize: 100,
      overflowSize: 100,
      maxConcurrentRequests: 2,
      maxPagesInCache: 2,
      getRows: ({
        endRow,
        successCallback,
      }) => {
        const dataset = this.DatasetStorageService.getDataset();
        if (
          endRow === 100 &&
          this.DatasetStorageService.getCurrent() === dataset.sourceId) {
          const data = this.DatasetStorageService.getDataset()
            .data;
          successCallback(data);
        } else {
          DatasetAPI.getData({
              sourceId: this.DatasetStorageService.getCurrent(),
              nrows: endRow,
            })
            .then(({
              data,
            }) => {
              successCallback(data);
            });
        }
      },
    };

    this.gridOptions = {
      angularCompileHeaders: true,
      angularCompileRows: false,
      headerHeight: 110,
      rowHeight: 32,
      enableColResize: true,
      virtualPaging: true,
      headerCellRenderer: this.GridService.headerCellRenderer,
      columnDefs: this.GridService.createColumnDefs({
        columnsInfo: this.dataset.columnsInfo,
      }),
      onCellContextMenu: CellService.onCellContextMenu.bind(CellService),
      datasource: this.dataSource,
    };

    this.DatasetStorageService.on('DATASET_DID_CHANGE', this.onChangeGrid,
      this);
  }

  $onDestroy() {
    this.DatasetStorageService.removeListener('DATASET_DID_CHANGE', this.onChangeGrid);
  }

  onChangeGrid(dataset) {
    if (!dataset) {
      return false;
    }

    this.gridOptions.api.setColumnDefs(this.GridService.createColumnDefs({
      columnsInfo: dataset.columnsInfo,
    }));
    this.gridOptions.api.setDatasource(this.dataSource);
  }

  changeColName(value) {
    this.ColumnAPI.renameColumn('old', value);
  }

  isSelectedColumn(columnName) {
    const idx = this.selectedColumns.indexOf(columnName);

    return idx !== -1 ? true : false;
  }

  toggleColumn(columnName) {
    if (_.isUndefined(columnName)) {
      return false;
    }

    const idx = this.selectedColumns.indexOf(columnName);

    if (idx === -1) {
      this.selectedColumns.push(columnName);
    } else {
      this.selectedColumns.splice(idx, 1);
    }
  }

  statsColumn(columnName) {
    this.selectedStatsColumn = columnName;
  }

  filterColumn(columnName) {
    this.selectedColumn = columnName;
  }

  isNumberType(columnType = 'string') {
    const NumberTypes = [
      'number',
      'date',
      'integer',
      'double',
    ];

    if (NumberTypes.indexOf(columnType.substr(0, columnType.length - 4)
        .toLowerCase()) !== -1) {
      return true;
    }
    return false;
  }
}
