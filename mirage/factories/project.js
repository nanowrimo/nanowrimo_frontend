import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  name() {
    return faker.commerce.productName();
  },
  count() {
    return 10000 + Math.floor(Math.random() * 40000);
  },
  cover() {
    let critters = ['dog','cat','bird','horse']
    let key = critters[Math.floor(Math.random()*critters.length)];
    return `https://loremflickr.com/240/320/${key}?random=1`;
  },
  status() {
    let stati =['Completed', 'In Progress']
    return stati[Math.floor(Math.random()*stati.length)];
  }
});
