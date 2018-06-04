import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  title() {
    return faker.commerce.productName();
  },
  unitType() {
    return 'word';
  },
  unitCount() {
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
  },
  createdAt(i) {
    return faker.list.cycle('2015-11-01','2013-11-01','2016-11-01','2017-11-01')(i);
  },
  
  slug(i){
    return "project-slug-"+i; 
  }
  
});
