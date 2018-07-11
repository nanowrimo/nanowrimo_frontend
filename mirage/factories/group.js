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
  }
});
