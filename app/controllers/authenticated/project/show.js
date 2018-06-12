import Controller from '@ember/controller';

import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Controller.extend({
  currentUser: service(),
  project: alias('model'),

  canUpdateCount: computed("currentUser.user.id", "project.user.id", function(){
    let cuid = this.get("currentUser.user.id");
    let puid = this.get("project.user.id");
    console.log(cuid, puid);
    return cuid == puid;
  })

});
