class DateColumnController {
	/*@ngInject*/
	constructor($scope, $mdDialog, items, $rootScope, DatafileService) {

		this.$rootScope = $rootScope;
		var parentThis = this;

		items.vizPadObj.timeRange.dateColumn = DatafileService.dateColumns[0];

		this.$scope.dateColumns = items.dateColumns;

		this.$scope.hide = function() {
			$mdDialog.hide();
		};

		this.$scope.cancel = function() {
			$mdDialog.cancel();
		};

		this.$scope.answer = function(answer) {
			$mdDialog.hide(answer);
		};

		this.$scope.dateFilterChanged = function(){
			items.vizPadObj.timeRange.dateColumn = parentThis.$scope.filterDate
		}
	}
}
export default DateColumnController;
