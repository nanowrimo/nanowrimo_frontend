import { set, get, computed } from '@ember/object';
import Service from '@ember/service';

export default Service.extend({
  sideMenuIsOpen: true,
  homeUrl: "index",
  submenus: computed(function() {
    let links = [
      {
        toggleLabel: "My NaNoWriMo",
        submenuItems: [
          {label: "Profile", url: "index"},
          {label: "Stats", url: "index"},
          {label: "Projects", url: "index"},
          {label: "Buddies", url: "index"}
        ]
      },
      {
        toggleLabel: "Community",
        submenuItems: [
          {label: "Forums", url: "index"},
          {label: "New York City", url: "index"},
          {label: "Find a Region", url: "index"},
          {label: "Word Sprints", url: "index"}
        ]
      },
      {
        toggleLabel: "Writer's Resources",
        submenuItems: [
          {label: "NaNo Prep", url: "index"},
          {label: "Pep Talks", url: "index"},
          {label: "Offers", url: "index"}
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