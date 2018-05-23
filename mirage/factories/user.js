import { Factory, faker } from 'ember-cli-mirage';
import { uniq } from 'lodash';

export default Factory.extend({
  avatar: faker.image.avatar(),
  createdAt: faker.date.past(),
  email: faker.internet.email(),
  location() {
    return `${faker.address.city()}, ${faker.address.stateAbbr()}`;
  },
  name: faker.internet.userName(),
  postalCode: faker.address.zipCode(),

  statsStreakEnabled: faker.random.boolean(),
  statsStreak: faker.random.number({ min: 10, max: 60 }),
  statsProjectsEnabled: faker.random.boolean(),
  statsProjects: faker.random.number({ min: 2, max: 10 }),
  statsWordCountEnabled: faker.random.boolean(),
  statsWordCount: faker.random.number({ min: 1000, max: 1000000 }),
  statsWordiestEnabled: faker.random.boolean(),
  statsWordiest: faker.random.number({ min: 10000, max: 100000 }),
  statsWritingPaceEnabled: faker.random.boolean(),
  statsWritingPace: faker.random.number({ min: 100, max: 10000 }),
  statsYearsEnabled: faker.random.boolean(),
  statsYearsDone() {
    let numberOfYears = faker.random.number({ min: 3, max: 10 });
    let yearList = [];
    for(let i=0; i<numberOfYears; i++) {
      yearList.push(faker.random.number({ min: 1980, max: 2018 }));
    }
    return uniq(yearList).sort().join(' ');
  },
  statsYearsWon() {
    let yearsDone = this.statsYearsDone.split(' ');
    let yearsWon = yearsDone.filter(() => faker.random.boolean());
    return yearsWon.join(' ');
  },
  timeZone: "America/Los_Angeles"
});
