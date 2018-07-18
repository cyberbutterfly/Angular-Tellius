class Controller {
  /*@ngInject*/
  constructor () {
    angular.forEach(this.candidateMembers, memberIterator => {
      memberIterator.selected = false;
    });
    this.selectedMembers = [];
  }

  selectMember(member) {
    member.selected = !member.selected;
    if (member.selected) {
      this.selectedMembers.push(member);
    } else {
      _.remove(this.selectedMembers, { id: member.id });
    }
  }

}

export default Controller;
