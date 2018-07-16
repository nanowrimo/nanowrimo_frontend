import { Factory, faker } from 'ember-cli-mirage';
import Project from 'nanowrimo/models/project';

export default Factory.extend({
  cover(i) {
    return `https://loremflickr.com/240/320/dog,cat,bird,horse?random=${i}`;
  },
  createdAt(i) {
    let year = faker.list.cycle('2013', '2015', '2016', '2017')(i);
    return `${year}-11-01`;
  },
  pinterestUrl() {
    return `https://pinterest.com/${faker.internet.userName()}`;
  },
  playlistUrl() {
    return `https://spotify.com/${faker.internet.userName()}`;
  },
  primary(i) {
    return i === 1;
  },
  privacy() {
    let options = Project.optionsForPrivacy;
    return faker.list.random.apply(this, options)();
  },
  slug(i){
    return "project-slug-"+i;
  },
  status() {
    let options = Project.optionsForStatus;
    return faker.list.random.apply(this, options)();
  },
  summary: faker.lorem.sentence,
  title: faker.commerce.productName,
  
  unitType() {
    return 'word';
  },
  writingType() {
    let options = Project.optionsForWritingType;
    return faker.list.random.apply(this, options)();
  }
});
