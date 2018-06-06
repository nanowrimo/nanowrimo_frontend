import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  name: faker.commerce.productName,
  count() {
    return faker.random.number({ min: 10000, max: 50000 });
  },
  cover(i) {
    return `https://loremflickr.com/240/320/dog,cat,bird,horse?random=${i}`;
  },
  status() {
    return faker.list.random('Completed', 'In Progress');
  },
  createdAt() {
    let year = faker.list.cycle('2013', '2015', '2016', '2017');
    return `${year}-11-01`;
  }
});
