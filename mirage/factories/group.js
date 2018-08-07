import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  createdAt: faker.date.past,
  updatedAt: faker.date.past,
  closedAt: faker.date.future,
  groupType: 'region',
  name() {
    return `${faker.address.country()} :: ${faker.address.city()}`;
  },
  slug(i){
    return "region-slug-"+i;
  },
  description: faker.lorem.paragraph,
  longitude() {
    return faker.address.longitude();
  },
  latitude() {
    return faker.address.latitude();
  },
  numberOfUsers() {
    return faker.random.number({ min: 1, max: 30000 });
  },
  totalDonation() {
    return faker.random.number({ min: 1, max: 50000 });
  },
  totalWordCount() {
    return faker.random.number({ min: 1, max: 4000000 });
  },
  averageWordCount() {
    return faker.random.number({ min: 1, max: 20000 });
  },
  timeZone: faker.list.random('America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles')
  
});
