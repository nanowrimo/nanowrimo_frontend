import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  title: faker.commerce.productName
});
