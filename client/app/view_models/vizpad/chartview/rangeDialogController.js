import moment from 'moment';

class RangeDialogController {
	/*@ngInject*/
	constructor($scope, $mdDialog, items) {

		var parentThis = this;

		this.$scope.hide = function() {
			$mdDialog.hide();
		};

		this.$scope.cancel = function() {
			$mdDialog.cancel();
		};

		this.$scope.answer = function(answer) {
			$mdDialog.hide(answer);
		};

		this.$scope.applyDateFilter = function() {
			items.vizPadObj.timeRange = {
				type: items.timelineType,
				from: moment(parentThis.$scope.customDateFrom).format('L'),
				to: moment(parentThis.$scope.customDateTo).format('L')
			}
			if (items.dateColumns.length > 1) {
				items.showDateColumns();
			};
		};
	}
}
export default RangeDialogController;
