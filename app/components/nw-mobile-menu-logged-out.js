import Component from '@ember/component';


export default Component.extend({
 tagName: "span",
 classNames: ['mobile-menu-logged-out'], 
 displayMenu: false,
 
 
 actions: {
   showMenu: function() {
     this.set('displayMenu', true); 
     window.setTimeout(function(){
       document.getElementById("mobile-menu-logged-out-close").focus();
       },300);
   },
   hideMenu: function() {
     this.set('displayMenu', false);
   }
 }
 
});
