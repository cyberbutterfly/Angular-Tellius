import '../../api/wrapper/wrapper';

class UserService {
	/*@ngInject*/
	constructor($auth, $localStorage, $state, $mdToast, ApiWrapper, UsersModel) {

		this.$auth         = $auth;
		this.$localStorage = $localStorage;
		this.$state        = $state;
		this.$mdToast      = $mdToast;
		this.api           = ApiWrapper;
		this.UsersModel    = UsersModel;
		this.user = {};
	}

	login (userName, password) {

		const model = {
			username: userName,
			password: password
		};

		return new Promise((resolve, reject) => {
			this.$auth.login(model).then( success => {
				this.user = this.getCurrentUserAuthData();
				this.$localStorage.$default(this.user);
				resolve(success);
			}, error => {
				reject(error);
			});
		});
	}

	getCurrentUserAuthData () {
		const userInfo = this.$auth.getPayload();
		const token = this.$auth.getToken();
		const userDetails = {id : userInfo.id, token : token, name: userInfo.username}

		return userDetails;
	}

	logout () {
		this.$auth.logout().then(() => {
			this.$localStorage.$reset();
			this.$state.go('app.login');
			this.$mdToast.show(this.$mdToast.simple().content('Successfully logged out!').hideDelay(3000));
		}, () => {
			this.$mdToast.show(this.$mdToast.simple().content('Could not log out!').hideDelay(3000));
		});
	}
}

export default UserService;
