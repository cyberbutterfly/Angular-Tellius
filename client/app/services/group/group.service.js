import '../../api/wrapper/wrapper';

class GroupService {
	/*@ngInject*/
	constructor($mdToast, ApiWrapper, GroupsModel) {

		this.$mdToast      = $mdToast;
		this.api           = ApiWrapper;
		this.GroupsModel   = GroupsModel;
	}

}

export default GroupService;
