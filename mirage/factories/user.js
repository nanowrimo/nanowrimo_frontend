import { Factory, faker } from 'ember-cli-mirage';
import { uniq } from 'lodash';

export default Factory.extend({
  avatar() {
    return faker.image.avatar();
  },
  bio() {
    return faker.lorem.sentences(20);
  },
  createdAt() {
    return faker.date.past();
  },
  email() {
    return faker.internet.email();
  },
  location() {
    return `${faker.address.city()}, ${faker.address.stateAbbr()}`;
  },
  name() {
    return faker.internet.userName();
  },
  plate() {
    return faker.image.nature();
  },
  postalCode() {
    return faker.address.zipCode();
  },

  statsStreakEnabled() {
    return faker.random.boolean();
  },
  statsStreak() {
    return faker.random.number({ min: 10, max: 60 });
  },
  statsProjectsEnabled() {
    return faker.random.boolean();
  },
  statsProjects() {
    return faker.random.number({ min: 2, max: 10 });
  },
  statsWordCountEnabled() {
    return faker.random.boolean();
  },
  statsWordCount() {
    return faker.random.number({ min: 1000, max: 1000000 });
  },
  statsWordiestEnabled() {
    return faker.random.boolean();
  },
  statsWordiest() {
    return faker.random.number({ min: 10000, max: 100000 });
  },
  statsWritingPaceEnabled() {
    return faker.random.boolean();
  },
  statsWritingPace() {
    return faker.random.number({ min: 100, max: 10000 });
  },
  statsYearsEnabled() {
    return faker.random.boolean();
  },
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
  }
});
