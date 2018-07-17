import { sampleSize, random } from 'lodash';

export default function(server) {
  let user = server.create('user', { name: 'username', statsYearsEnabled: true });
  ['facebook', 'twitter', 'instagram'].forEach(social => {
    server.create('external-link', { user, url: `https://${social}.com/${user.name}` });
  });
  server.createList('external-link', 2, { user });
  server.createList('favorite-book', 3, { user });
  server.createList('favorite-author', 3, { user });
  let projects = server.createList('project', 3, { user });
  let challenge = server.create('challenge');
  let genres = server.createList('genre', 5);
  projects.forEach(function(project) {
    server.create('project-challenge', { project, challenge });
    sampleSize(genres, 2).forEach(function(genre) {
      server.create('project-genre', { project, genre })
    });
    //create some project-session data
    server.createList('project-session', random(1,10, false), {project});
  });
  server.createList('region', 50);
  
}
