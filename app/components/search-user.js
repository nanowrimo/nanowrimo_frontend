import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  
  searchUser: null,
  
  avatarUrl: computed("searchUser", function() {
    let url = this.searchUser.attributes.avatar;
    if (!url) {
      url = "/images/users/unknown-avatar.png";
    }
    return url;
  }),
  
});
