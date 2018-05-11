import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  name() {
    return faker.commerce.productName();
  },
  cover() {
    return faker.image.avatar();
  },
  status() {
    let stati =['Completed', 'In Progress']
    return stati[Math.floor(Math.random()*stati.length)];
  }
});
