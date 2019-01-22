import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | user-links', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders each link', async function(assert) {
    let socialLinks = [
      { link: 'https://facebook.com/username', service: 'facebook', isNew: false },
      { link: 'https://twitter.com/username', service: 'twitter', isNew: false },
      { link: 'https://instagram.com/username', service: 'instagram', isNew: false },
      { link: 'https://medium.com/username', service: 'medium', isNew: false },
      { link: 'https://tumblr.com/username', service: 'tumblr', isNew: false }
    ];
    let otherLinks = [
      { link: 'https://example.com', url: 'https://example.com', isNew: false },
      { link: 'https://example.co',url: 'https://example.co', isNew: false }
    ];
    let links = socialLinks.concat(otherLinks);
    this.set('links', links);

    await render(hbs`{{user-links links=links}}`);

    links.forEach(link => {
      assert.dom(`a[href='${link.link}']`).exists('each link is rendered with href');
    });
    socialLinks.forEach(social => {
      assert.dom(`a[href='${social.link}'] i.fa-${social.service}`).exists('social links include proper icon');
    });
    otherLinks.forEach(other => {
      assert.dom(`a[href='${other.link}']`).hasText(other.link, 'other links render link text');
    });
  });
});
