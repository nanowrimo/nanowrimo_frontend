import Component from '@ember/component';
import { set, get } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  nanoMenuService: service(),
  submenuIsOpen: false,
  menuMaxHeight: "max-height: 0px".htmlSafe(),
  caretClass: "".htmlSafe(),
  actions: {
    toggleSubmenu() {
      set(this,"submenuIsOpen",!get(this,"submenuIsOpen"));
      if (get(this,"submenuIsOpen")) {
        set(this,"menuMaxHeight","max-height: 500px".htmlSafe());
        set(this,"caretClass","flipped".htmlSafe());
      } else {
        set(this,"menuMaxHeight","max-height: 0px".htmlSafe());
        set(this,"caretClass","".htmlSafe());
      }
    }
  }
  
});