import { module, test } from 'qunit';
import { click, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { authenticateSession } from 'ember-simple-auth/test-support';

module('Acceptance | User stats', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('user stats are displayed', async function(assert) {
    this.server.create('user');
    authenticateSession();

    let statsUser = this.server.create('user', {
      statsWordCountEnabled: true,
      statsWordCount: 12345,
      statsProjectsEnabled: true,
      statsProjects: 5,
      statsYearsEnabled: true,
      statsYearsDone: '2016 2017 2018',
      statsYearsWon: '2016 2018'
    });

    await visit(`/participants/${statsUser.name}`);

    assert.dom('[data-test-user-stats-word-count]').hasText('12,345', 'formatted word count is shown');
    assert.dom('[data-test-user-stats-projects]').hasText('5', 'formatted project count is shown');
    assert.dom('[data-test-user-stats-years]').hasText('3', 'formatted years count is shown');
    assert.dom('[data-test-user-stats-wordiest]').doesNotExist('wordiest stat is not shown');
    assert.dom('[data-test-user-stats-writing-pace]').doesNotExist('writing pace stat is not shown');
    assert.dom('[data-test-user-stats-streak]').doesNotExist('streak stat is not shown');

    let otherStatsUser = this.server.create('user', {
      statsWordCountEnabled: false,
      statsProjectsEnabled: false,
      statsYearsEnabled: false,

      statsWordiestEnabled: true,
      statsWordiest: 123456,
      statsWritingPaceEnabled: true,
      statsWritingPace: 1234,
      statsStreakEnabled: true,
      statsStreak: 123,
    });

    await visit(`/participants/${otherStatsUser.name}`);

    assert.dom('[data-test-user-stats-word-count]').doesNotExist('word count stat is not shown');
    assert.dom('[data-test-user-stats-projects]').doesNotExist('projects stat is not shown');
    assert.dom('[data-test-user-stats-years]').doesNotExist('years stat is not shown');
    assert.dom('[data-test-user-stats-wordiest]').hasText('123,456', 'formatted wordiest is shown');
    assert.dom('[data-test-user-stats-writing-pace]').hasText('1,234', 'formatted writing pace is shown');
    assert.dom('[data-test-user-stats-streak]').hasText('123', 'streak is shown');
  });

  test('edit stats link only appears for current User', async function(assert) {
    let user = this.server.create('user');
    authenticateSession();

    this.server.create('user', { name: 'otheruser' });
    await visit('/participants/otheruser');

    assert.dom('[data-test-user-profile-edit-stats]').doesNotExist('can not edit other User stats');

    await visit(`/participants/${user.name}`);

    assert.dom('[data-test-user-profile-edit-stats]').exists('can edit self User stats');
  });


  test('editing User stats', async function(assert) {
    let user = this.server.create('user', {
      statsWordCountEnabled: true,
      statsProjectsEnabled: true,
      statsYearsEnabled: true,
      statsWordiestEnabled: false,
      statsWritingPaceEnabled: false,
      statsStreakEnabled: false
    });
    authenticateSession();

    await visit(`/participants/${user.name}`);

    assert.dom('[data-test-user-stats-word-count]').exists('word count stat is shown');
    assert.dom('[data-test-user-stats-projects]').exists('projects stat is shown');
    assert.dom('[data-test-user-stats-years]').exists('years stat is shown');
    assert.dom('[data-test-user-stats-wordiest]').doesNotExist('wordiest stat is not shown');
    assert.dom('[data-test-user-stats-writing-pace]').doesNotExist('writing pace stat is not shown');
    assert.dom('[data-test-user-stats-streak]').doesNotExist('streak stat is not shown');

    await click('[data-test-user-profile-edit-stats]');
    await click('[data-test-form-for--checkbox=statsWordCountEnabled]');
    await click('[data-test-form-for--checkbox=statsProjectsEnabled]');
    await click('[data-test-form-for--checkbox=statsYearsEnabled]');
    await click('[data-test-form-for--checkbox=statsWordiestEnabled]');
    await click('[data-test-form-for--checkbox=statsWritingPaceEnabled]');
    await click('[data-test-form-for--checkbox=statsStreakEnabled]');
    await click('[data-test-user-profile-submit]');

    assert.dom('[data-test-user-stats-word-count]').doesNotExist('word count stat is not shown');
    assert.dom('[data-test-user-stats-projects]').doesNotExist('projects stat is not shown');
    assert.dom('[data-test-user-stats-years]').doesNotExist('years stat is not shown');
    assert.dom('[data-test-user-stats-wordiest]').exists('wordiest stat is shown');
    assert.dom('[data-test-user-stats-writing-pace]').exists('writing pace stat is shown');
    assert.dom('[data-test-user-stats-streak]').exists('streak stat is shown');
  });
});
