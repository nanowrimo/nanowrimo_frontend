import { set, get, computed } from '@ember/object';
import { reads }  from '@ember/object/computed';
import Service from '@ember/service';
import { inject as service } from '@ember/service';

import ENV from 'nanowrimo/config/environment';

export default Service.extend({
  session: service(),
  currentUser: service(),
  currentUserName: reads('currentUser.user.name'),
  currentUserObj: reads('currentUser.user'),
  sideMenuIsOpen: true,
  homeUrl: "authenticated",
  homeRegionItem: computed('currentUser.user.homeRegion', function() {
    let region = this.get('currentUser.user.homeRegion');
    if (region) {
      let v = {label: "Home Region", route: "authenticated.regions.show.index", segment: region.slug, teaser: region.name, src: "/images/nav/map_pin.svg"};
      return v;
    } else {
      return null;
    }
  }),
  
  /* add/edit/change menu items */
  // menu items that reference a local route will have a "route" attribute
  // menu items that reference a remote url will have a 'url' attribute
  
  submenus: computed('currentUser.user.homeRegion',function() {
    let links = [
      {
        toggleLabel: "My NaNoWriMo",
        submenuItems: [
          {label: "Profile", route: "authenticated.users.show.index", segment: get(this,"currentUserObj"), teaser: "Tell other Wrimos about you", src: "/images/nav/id_card.svg"},
          {label: "Stats", route: "authenticated.stats.index", segment: null, teaser: "Track your writing progress", src: "/images/nav/bar_chart.svg"},
          {label: "Projects", route: "authenticated.users.show.projects", segment: get(this,"currentUserObj"), teaser: "Organize all your projects", src: "/images/nav/open_book.svg"},
          {label: "Buddies", route: "authenticated.users.show.buddies", segment: get(this,"currentUserObj"), teaser: "Support and be supported", src: "/images/nav/clapping_hands.svg"}
        ]
      },
      {
        toggleLabel: "Community",
        submenuItems: [
          {label: "Forums", url: ENV.forumsUrl, segment: null, teaser: "Our lively discussion space", src: "/images/nav/smiley_paper.svg"},
          this.get('homeRegionItem'),
          {label: "Find a Region", route: "authenticated.regions.find", segment: null, teaser: "Join a region for more support", src: "/images/nav/earth.svg"}
          //{label: "Word Sprints", route: "wordSprints", segment: null, teaser: "Ready... set... write", src: "/images/nav/pencil_flag.svg"}
        ]
      },
      {
        toggleLabel: "Writer's Resources",
        submenuItems: [
         // {label: "NaNo Prep", route: "nano-prep", segment: null, teaser: "Get ready for the big event", src: "/images/nav/thought_bubble.svg"},
          {label: "Pep Talks", url: "/pep-talks", segment: null, teaser: "Great authors to motivate you", src: "/images/nav/pompom.svg"},
          {label: "Offers", route: "offers", segment: null, teaser: "Discounts on writer tools", src: "/images/nav/present.svg"}
        ]
      }
    ];
    return links;
  }),
  storeLinks: computed(function() {
    let links = [
      {label: "Shop", url: "https://store.nanowrimo.org/collections/shop"},
      {label: "Donate", url: "https://store.nanowrimo.org/collections/donate"}
    ];
    return links;
  }),
  helpLinks: computed(function() {
    let links = [
      {label: "Email Help Desk", url: "mailto:support@nanowrimo.zohodesk.com"}

    ];
    return links;
  }),
  userLinks: computed(function() {
    let links = [
      //{label: "Activity Log", route: "index"},
      {label: "Settings", route: "index"},
      {label: "Log Out", route: "index"}
    ];
    return links;
  }),
  accountSettings: computed(function(){
    return {label: "Account Settings", route: "authenticated.settings.account"};
  }),
  
  toggleSideMenu() {
    set(this, "sideMenuIsOpen", !get(this, "sideMenuIsOpen"));
  }
  
});
