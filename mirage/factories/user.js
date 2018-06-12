import { Factory, faker } from 'ember-cli-mirage';
import { uniq } from 'lodash';

export default Factory.extend({
  avatar:faker.image.avatar,
  bio() {
    return faker.lorem.sentences(20);
  },
  createdAt: faker.date.past,
  email: faker.internet.email,
  location() {
    return `${faker.address.city()}, ${faker.address.stateAbbr()}`;
  },
  name: faker.internet.userName,
  confirmedAt: null,
  plate(i) {
    return `https://loremflickr.com/1200/320/nature?random=${i}`;
  },
  postalCode: faker.address.zipCode,
  statsStreakEnabled: faker.random.boolean,
  statsStreak() {
    return faker.random.number({ min: 10, max: 60 });
  },
  statsProjectsEnabled: faker.random.boolean,
  statsProjects() {
    return faker.random.number({ min: 2, max: 10 });
  },
  statsWordCountEnabled: faker.random.boolean,
  statsWordCount() {
    return faker.random.number({ min: 1000, max: 1000000 });
  },
  statsWordiestEnabled: faker.random.boolean,
  statsWordiest() {
    return faker.random.number({ min: 10000, max: 100000 });
  },
  statsWritingPaceEnabled: faker.random.boolean,
  statsWritingPace() {
    return faker.random.number({ min: 100, max: 10000 });
  },
  statsYearsEnabled: faker.random.boolean,
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
  timeZone: faker.list.random('America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles')
});
