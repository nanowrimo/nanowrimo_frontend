import Component from '@ember/component';
import { reads, alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/string';
import { get, computed } from '@ember/object';

export default Component.extend({
  nanoMenuService: service(),
  currentUser: service(),
  currentUserName: reads('currentUser.user.name'),  
  currentUserAvatar: reads('currentUser.user.avatar'),  
  
  sideMenuIsOpen: alias("nanoMenuService.sideMenuIsOpen"),
  submenus: alias("nanoMenuService.submenus"),
  storeLinks: alias("nanoMenuService.storeLinks"),
  helpLinks: alias("nanoMenuService.helpLinks"),
  attributeBindings: ["style"],
  classNames: ["nano-side-menu"],
  style: computed("nanoMenuService.sideMenuIsOpen",function () {
    if (get(this, "sideMenuIsOpen")) {
      return htmlSafe("right: -285px");
    } else {
      return htmlSafe("right: 0px");
    }
  }),
});