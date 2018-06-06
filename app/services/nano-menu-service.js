import { set, get, computed } from '@ember/object';
import { reads }  from '@ember/object/computed';
import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default Service.extend({
  session: service(),
  currentUser: service(),
  currentUserName: reads('currentUser.user.name'),
  sideMenuIsOpen: true,
  homeUrl: "index",
  
  submenus: computed(function() {
    let links = [
      {
        toggleLabel: "My NaNoWriMo",
        submenuItems: [
          {label: "Profile", url: "authenticated.users.show", segment: get(this,"currentUserName"), teaser: "Tell other Wrimos about you", src: "/nav/id_card.svg"},
          {label: "Stats", url: "components.stats", segment: null, teaser: "Track your writing progress", src: "/nav/bar_chart.svg"},
          {label: "Projects", url: "authenticated.users.show.projects", segment: null, teaser: "Organize all your projects", src: "/nav/open_book.svg"},
          {label: "Buddies", url: "authenticated.users.show.buddies", segment: null, teaser: "Support and be supported", src: "/nav/clapping_hands.svg"}
        ]
      },
      {
        toggleLabel: "Community",
        submenuItems: [
          {label: "Forums", url: "index", segment: null, teaser: "Our lively discussion space", src: "/nav/smiley_paper.svg"},
          {label: "New York City", url: "index", segment: null, teaser: "Talk to WriMos near you", src: "/nav/map_pin.svg"},
          {label: "Find a Region", url: "index", segment: null, teaser: "Join a region for more support", src: "/nav/earth.svg"},
          {label: "Word Sprints", url: "index", segment: null, teaser: "Ready... set... write", src: "/nav/pencil_flag.svg"}
        ]
      },
      {
        toggleLabel: "Writer's Resources",
        submenuItems: [
          {label: "NaNo Prep", url: "index", segment: null, teaser: "Get ready for the big event", src: "/nav/thought_bubble.svg"},
          {label: "Pep Talks", url: "index", segment: null, teaser: "Great authors to motivate you", src: "/nav/pompom.svg"},
          {label: "Offers", url: "index", segment: null, teaser: "Discounts on writer tools", src: "/nav/present.svg"}
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
      {label: "Help Center", url: "index"},
      {label: "Get Involved", url: "index"}
    ];
    return links;
  }),
  userLinks: computed(function() {
    let links = [
      {label: "Activity Log", url: "index"},
      {label: "Settings", url: "index"},
      {label: "Log Out", url: "index"}
    ];
    return links;
  }),
  toggleSideMenu() {
    set(this, "sideMenuIsOpen", !get(this, "sideMenuIsOpen"));
  }
  
});