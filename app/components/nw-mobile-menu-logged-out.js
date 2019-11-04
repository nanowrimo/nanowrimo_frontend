import Component from '@ember/component';


export default Component.extend({
 tagName: "span",
 classNames: ['mobile-menu-logged-out'], 
 displayMenu: false,
 
 
 actions: {
   showMenu: function() {
     this.set('displayMenu', true);
   },
   hideMenu: function() {
     this.set('displayMenu', false);
   }
 }
 
});
