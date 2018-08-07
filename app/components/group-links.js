import Component from '@ember/component';
import { computed }  from '@ember/object';
import { filterBy, setDiff }  from '@ember/object/computed';
import ENV from 'nanowrimo/config/environment';

export default Component.extend({
  tagName: '',

  links: null,

  _existingLinks: filterBy('links', 'isNew', false),
  otherLinks: setDiff('_existingLinks', 'socialLinks'),

  socialLinks: computed('_existingLinks.@each.url', function() {
    let links = this.get('_existingLinks').toArray();

    return ENV.APP.SOCIAL_SERVICES.reduce((acc, service) => {
      let matchingLink = links.findBy('service', service);
      return matchingLink ? acc.concat(matchingLink) : acc;
    }, []);
  })
});
