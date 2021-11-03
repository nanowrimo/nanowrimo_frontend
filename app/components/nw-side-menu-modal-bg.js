import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/string';
import { computed } from '@ember/object';

export default Component.extend({
  nanoMenuService: service(),
  attributeBindings: ["style"],
  
  style: computed("nanoMenuService.sideMenuIsOpen",function () {
    if (this.get("nanoMenuService.sideMenuIsOpen")) {
      return htmlSafe("z-index: 999; position:fixed; top: 0; left:0; width:100%; height: 100%; background-color: black; opacity: 50%;");
    } else {
      return htmlSafe("display: none");
    }
  })

});
