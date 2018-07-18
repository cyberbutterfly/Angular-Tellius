import headerCellTemplate from './headerCell.jade';

class GridService {
  constructor() {
    this.listeners = [];
  }

  createColumnDefs({
    columnsInfo,
  }) {
    let result = [];

    if (columnsInfo) {
      columnsInfo.forEach(item => {
        const typeStats = {
          mainType: item.mainType,
          mainTypePercentage: item.mainTypePercentage,
          nullPercentage: item.nullPercentage,
          otherType: item.otherTypem,
          otherTypePercentage: item.otherTypePercentage,
        };

        result.push({
          headerName: item.name,
          field: item.name,
          width: 130,
          typeStats: typeStats,
          dataType: item.dataType,
          cellClassRules: {
            'blank-field': function blankField(params) {
              return params.value === '' || params.value === '0';
            },
          },
          cellRenderer: function cellTitle(params) {
            let cellValue = params.value || '';

            if (cellValue > 20) {
              cellValue = '<span title="' + cellValue + '">' +
                cellValue + '</span>';
            }
            return cellValue;
          },
        });
      });
    }

    return result;
  }

  createRowData(data) {
    let result = [];

    if (data) {
      data.forEach((item) => {
        result.push(item);
      });
    }

    return result;
  }

  headerCellRenderer(params) {
    params.$scope.colDef = params.colDef;
    params.$scope.value = params.value;

    return headerCellTemplate();
  }


}

export default GridService;
