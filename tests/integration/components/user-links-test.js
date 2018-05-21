import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | user-links', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders each link', async function(assert) {
    let socialLinks = [
      { url: 'https://facebook.com/username', service: 'facebook', isNew: false },
      { url: 'https://twitter.com/username', service: 'twitter', isNew: false },
      { url: 'https://instagram.com/username', service: 'instagram', isNew: false },
      { url: 'https://medium.com/username', service: 'medium', isNew: false },
      { url: 'https://tumblr.com/username', service: 'tumblr', isNew: false }
    ];
    let otherLinks = [
      { url: 'https://example.com', isNew: false },
      { url: 'https://example.co', isNew: false }
    ];
    let links = socialLinks.concat(otherLinks);
    this.set('links', links);

    await render(hbs`{{user-links links=links}}`);

    links.forEach(link => {
      assert.dom(`a[href='${link.url}']`).exists('each link is rendered with href');
    });
    socialLinks.forEach(social => {
      assert.dom(`a[href='${social.url}'] i.fa-${social.service}`).exists('social links include proper icon');
    });
    otherLinks.forEach(other => {
      assert.dom(`a[href='${other.url}']`).hasText(other.url, 'other links render link text');
    });
  });
});
