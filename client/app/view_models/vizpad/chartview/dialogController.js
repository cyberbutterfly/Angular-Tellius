import _ from 'lodash'
class DialogController {
	/*@ngInject*/
	constructor($scope, $mdDialog, items) {

	  var dialogControllerThis = this;
	  this.showSecondFilter = false;
	  this.$scope.vizPadObj = items.vizPadObj;
	  this.$scope.xColumns  = _.uniq(items.xColumns);
	  this.$scope.yColumns  = _.uniq(items.yColumns);

	  this.$scope.hide = function() {
	    $mdDialog.hide();
	  };
	  this.$scope.cancel = function() {
	    $mdDialog.cancel();
	  };
	  this.$scope.answer = function(answer) {
	    $mdDialog.hide(answer);
	  };

	  this.$scope.addFilterValueColumn = function() {
	    if (dialogControllerThis.$scope.filter === "Contains but does not contain" || dialogControllerThis.$scope.filter === "Between") {
	      dialogControllerThis.$scope.showSecondFilter = true;
	    } else {
	      dialogControllerThis.$scope.showSecondFilter = false;
	    }
	  };

	  this.$scope.filterChanged = function(){
	    if (this.yColumns.indexOf(this.vizPadFilter) != -1) {
	      dialogControllerThis.$scope.vizPadOperators = [
	        {
	          name: 'Less Than',
	          value: 'Less Than'
	        },
	        {
	          name: 'Less Than or equal to',
	          value: 'Less Than or equal to'
	        },
	        {
	          name: 'Equal To',
	          value: 'Equal To'
	        },
	        {
	          name: 'Greater Than',
	          value: 'Greater Than'
	        },
	        {
	          name: 'Greater Than or equal to',
	          value: 'Greater Than or equal to'
	        }
	      ];
	    } else {
	      dialogControllerThis.$scope.vizPadOperators = [
	        {
	          name: 'Equal To',
	          value: 'Equal To',
	        },
	        {
	          name: 'Not equal to',
	          value: 'Not equal to',
	        },
	        {
	          name: 'Contains',
	          value: 'Contains',
	        },
	        {
	          name: 'Does not contain',
	          value: 'Does not contain',
	        },
	        {
	          name: 'Contains but does not contain',
	          value: 'Contains but does not contain',
	        },
	        {
	          name: 'Ends with',
	          value: 'Ends with',
	        },
	        {
	          name: 'Doesnt end with',
	          value: 'Doesnt end with',
	        },
	        {
	          name: 'Starts with',
	          value: 'Starts with',
	        },
	        {
	          name: 'Doesnt start with',
	          value: 'Doesnt start with',
	        }
	      ];
	    }
	  }
	}
}
export default DialogController;
