import Component from '@ember/component';

export default Component.extend({
  queryParams: ['editCover', 'editCoverTab'],
  
  editCover: null,
  editCoverTab: null,
  
  actions: {
    afterCoverModalClose() {
      this.set('editCover', null);
      this.set('editCoverTab', null);
    },

    openCoverModal() {
      this.set('editCover', true);
      this.set('editCoverTab', null);
    },
  }
  
});
