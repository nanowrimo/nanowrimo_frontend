import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  count() {
    let num = faker.random.number({ min: 150, max: 2000 })
    return num;
  },
  
  start: '2018-11-02',
  end: '2018-11-02',
  where: 0,
  feeling: 1,
  createdAt: '2018-11-02',
  unitType: 0
});
