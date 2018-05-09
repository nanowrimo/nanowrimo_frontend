import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  avatar: faker.image.avatar(),
  createdAt: faker.date.past(),
  email: faker.internet.email(),
  location() {
    return `${faker.address.city()}, ${faker.address.stateAbbr()}`;
  },
  name: faker.internet.userName(),
  postalCode: faker.address.zipCode()
});
