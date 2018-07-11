import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  name() {
    return faker.company.companyName();
  },
  longitude() {
    return faker.address.longitude();
  },
  latitude() {
    return faker.address.latitude();
  }
});
