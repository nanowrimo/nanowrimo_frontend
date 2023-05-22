import { set, get, computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import Service from '@ember/service';
import { inject as service } from '@ember/service';

import ENV from 'nanowrimo/config/environment';

export default Service.extend({
  session: service(),
  currentUser: service(),
  currentUserName: reads('currentUser.user.name'),
  userSlug: reads('currentUser.user.slug'),
  sideMenuIsOpen: false,
  homeUrl: "authenticated",
  homeRegionItem: computed('currentUser.user.homeRegion', function () {
    let region = this.get('currentUser.user.homeRegion');
    if (region) {
      let v = { label: "Home Region", route: "authenticated.regions.show.index", segment: region.slug, teaser: region.name, src: "/images/nav/map_pin.svg" };
      return v;
    } else {
      return null;
    }
  }),
  statsItem: computed('currentUser.user.primaryProject', function () {
    let project = this.get('currentUser.user.primaryProject');
    if (project) {
      let v = { label: "Stats", route: "authenticated.stats", segment: null, teaser: "Track your writing progress", src: "/images/nav/bar_chart.svg" };
      return v;
    } else {
      return null;
    }
  }),

  /* add/edit/change menu items */
  // menu items that reference a local route will have a "route" attribute
  // menu items that reference a remote url will have a 'url' attribute

  submenus: computed('currentUser.user.{homeRegion,primaryProject}', function () {
    let links = [
      {
        toggleLabel: "My NaNoWriMo",
        submenuItems: [
          this.get('statsItem'),
          { label: "Profile", route: "authenticated.users.show.index", segment: this.get('userSlug'), teaser: "Tell other Wrimos about you", src: "/images/nav/id_card.svg" },
          { label: "Projects", route: "authenticated.users.show.projects", segment: this.get('userSlug'), teaser: "Organize all your projects", src: "/images/nav/open_book.svg" },
          { label: "Buddies", route: "authenticated.users.show.buddies", segment: this.get('userSlug'), teaser: "Support and be supported", src: "/images/nav/clapping_hands.svg" },
          { label: "Groups", route: "authenticated.users.show.groups", segment: this.get('userSlug'), teaser: "Regions and writing groups", src: "/images/nav/groups.svg" },
          this.get('homeRegionItem')
       ]
      },
      {
        toggleLabel: "Community",
        submenuItems: [
          { label: "Forums", url: ENV.forumsUrl, segment: null, teaser: "Our lively discussion space", src: "/images/nav/smiley_paper.svg" },
          { label: "Find a Region", route: "authenticated.regions.find", segment: null, teaser: "Join a region for more support", src: "/images/nav/earth.svg" },
          { label: "Local Partners",route: 'pages' , segment: "local", teaser: "Get involved in your region", src: "/images/nav/comewritein.png" },
          { label: "HQ Events", route: "authenticated.regions.show.events.upcoming", segment: "nanowrimo-hq", teaser: "Virtual meetups with NaNo", src: "/images/nav/speechbubbles.svg"},
          { label: "Our Values", route: 'pages' , segment: "dei", teaser: "Diversity, equity, and inclusion", src: "/images/nav/hearts.svg" }

        ]
      },
      {
        toggleLabel: "Writer's Resources",
        submenuItems: [
          { label: "NaNoWriMo", route: 'pages', segment: "national-novel-writing-month", teaser: "November novel-writing challenge", src: "/images/nav/basic-logo.svg" },
          { label: "Camp NaNo", route: 'pages', segment: "what-is-camp-nanowrimo", teaser: "Set your own goal in April and July", src: "/images/nav/tent.svg" },
          { label: "NaNo Prep", route: 'pages', segment: "nano-prep-101", teaser: "Get ready to write a novel", src: "/images/nav/thought_bubble.svg" },
          { label: "Now What?", route: 'pages', segment: "now-what", teaser: "Editing and publishing support", src: "/images/nav/question-book.svg" },
          { label: "Resource Hub", route: "pages", segment: 'revision-resources', teaser: "Pep talks and more", src: "/images/nav/pompom.svg" },
          { label: "Offers", route: "pages", segment: "offers", teaser: "Discounts on writer tools", src: "/images/nav/present.svg" }
        ]
      }
    ];
    return links;
  }),
  storeLinks: computed(function () {
    let links = [
      { label: "Shop", url: "https://store.nanowrimo.org/collections/shop" },
      { label: "Donate", url: "https://store.nanowrimo.org/collections/donate" }
    ];
    return links;
  }),
  helpLinks: computed(function () {
    let links = [
      { label: "Brought to You By", url: "/brought-to-you-by" },
      { label: "Help Desk", url: "https://nanowrimo.zendesk.com/" }

    ];
    return links;
  }),
  userLinks: computed(function () {
    let links = [
      //{label: "Activity Log", route: "index"},
      { label: "Settings", route: "index" },
      { label: "Log Out", route: "index" }
    ];
    return links;
  }),
  accountSettings: computed(function () {
    return { label: "Account Settings", route: "authenticated.settings.account" };
  }),

  toggleSideMenu() {
    set(this, "sideMenuIsOpen", !get(this, "sideMenuIsOpen"));
  }

});
