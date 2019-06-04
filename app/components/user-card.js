import NwFlippyCard from 'nanowrimo/components/nw-flippy-card';
import { computed } from '@ember/object';
//import { htmlSafe } from '@ember/template';

export default NwFlippyCard.extend({
  user: null,
  
  avatarUrl: computed("user", function() {
    let url = this.user.avatar;
    if (!url) {
      url = "/images/users/unknown-avatar.png";
    }
    return url;
  }),
    
});
