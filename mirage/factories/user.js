import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  avatar: faker.image.avatar(),
  createdAt: faker.date.past(),
  email: faker.internet.email(),
  name: faker.internet.userName(),
  postalCode: faker.address.zipCode()
});
