import Component from '@ember/component';
import { reads, alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/string';
import { set, get, computed } from '@ember/object';

export default Component.extend({
  session: service(),
  nanoMenuService: service(),
  currentUser: service(),
  currentUserName: reads('currentUser.user.name'),
  currentUserAvatar: reads('currentUser.user.avatarUrl'),

  sideMenuIsOpen: alias("nanoMenuService.sideMenuIsOpen"),
  submenus: reads("nanoMenuService.submenus"),
  storeLinks: reads("nanoMenuService.storeLinks"),
  helpLinks: reads("nanoMenuService.helpLinks"),
  attributeBindings: ["style"],
  classNames: ["nano-side-menu"],
  style: computed("nanoMenuService.sideMenuIsOpen",function () {
    if (get(this, "sideMenuIsOpen")) {
      return htmlSafe("right: -285px");
    } else {
      return htmlSafe("right: 0px");
    }
  }),
  actions: {
    invalidateSession() {
      this.get('session').invalidate();
      set(this,'sideMenuIsOpen',false);
    }
  }

});
