import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  url() {
    return `${faker.internet.url()}/${faker.internet.userName()}`;
  }
});
