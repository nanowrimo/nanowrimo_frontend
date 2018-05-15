import { sampleSize } from 'lodash';

export default function(server) {
  let user = server.create('user', { name: 'username' });
  ['facebook', 'twitter', 'instagram'].forEach(social => {
    server.create('external-link', { user, url: `https://${social}.com/${user.name}` });
  });
  server.createList('external-link', 2, { user });

  // Prior demo; replace with realistic Projects and Genres
  let projects = server.createList('project', 2);
  let genres = server.createList('genre', 5);
  
  let challenge = server.create('challenge');
  projects.forEach(function(project) {
    server.create('project-challenge', { project, challenge });
    sampleSize(genres, 2).forEach(function(genre) {
      server.create('project-genre', { project, genre })
    });
  });
}
