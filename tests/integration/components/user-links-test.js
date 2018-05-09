import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | user-links', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders each link', async function(assert) {
    let socialLinks = [
      { url: 'https://facebook.com/username', icon: 'facebook' },
      { url: 'https://twitter.com/username', icon: 'twitter' },
      { url: 'https://instagram.com/username', icon: 'instagram' },
      { url: 'https://medium.com/username', icon: 'medium' },
      { url: 'https://tumblr.com/username', icon: 'tumblr' }
    ];
    let otherLinks = [
      { url: 'https://example.com' },
      { url: 'https://example.co' }
    ];
    let links = socialLinks.concat(otherLinks);
    this.set('links', links);

    await render(hbs`{{user-links links=links}}`);

    links.forEach(link => {
      assert.dom(`a[href='${link.url}']`).exists('each link is rendered with href');
    });
    socialLinks.forEach(social => {
      assert.dom(`a[href='${social.url}'] i.fa-${social.icon}`).exists('social links include proper icon');
    });
    otherLinks.forEach(other => {
      assert.dom(`a[href='${other.url}']`).hasText(other.url, 'other links render link text');
    });
  });
});
