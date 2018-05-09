import Component from '@ember/component';
import { computed, get }  from '@ember/object';

const SOCIAL_SERVICES = ['facebook', 'twitter', 'instagram', 'medium', 'tumblr'];

export default Component.extend({
  tagName: '',

  links: null,

  socialLinks: computed('links.[]', function() {
    let links = this.get('links').toArray();
    let socialLinks = [];

    SOCIAL_SERVICES.forEach(service => {
      let matchingLink = this._matchingLink(links, service);
      if (matchingLink) {
        socialLinks.pushObject({
          url: get(matchingLink, 'url'),
          icon: service
        });
      }
    });

    return socialLinks;
  }),

  otherLinks: computed('links.[]', function() {
    let links = this.get('links').toArray();

    SOCIAL_SERVICES.forEach(service => {
      let matchingLink = this._matchingLink(links, service);
      if (matchingLink) {
        links.splice(links.indexOf(matchingLink), 1);
      }
    });

    return links;
  }),

  _matchingLink(links, service) {
    return links.find(link => {
      let url = get(link, 'url');
      return url.includes(`${service}.com`);
    });
  }
});
