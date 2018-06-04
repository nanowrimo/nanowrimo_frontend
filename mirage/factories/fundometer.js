import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  goalNumber() {
    return 1400000;
    //return 100000*faker.random.number({ min: 10, max: 20 });
  },
  raisedNumber() {
    return 123345;
    //return faker.random.number({ min: 0, max: 2000000 });
  },
  donorNumber() {
    return 1500;
    //return faker.random.number({ min: 0, max: 5000 });
  }
});
