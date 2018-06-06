import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  goalNumber() {
    let hundos = faker.random.number({ min: 10, max: 20 });
    return 100000 * hundos;
  },
  raisedNumber() {
    return faker.random.number({ min: 0, max: this.goalNumber });
  },
  donorNumber() {
    return faker.random.number({ min: 1, max: 5000 });
  }
});
