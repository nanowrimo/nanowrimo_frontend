import { sampleSize } from 'lodash';

export default function(server) {
  let user = server.create('user', { name: 'username', statsYearsEnabled: true });
  ['facebook', 'twitter', 'instagram'].forEach(social => {
    server.create('external-link', { user, url: `https://${social}.com/${user.name}` });
  });
  server.createList('external-link', 2, { user });

  // Prior demo; replace with realistic Projects and Genres
  let projects = server.createList('project', 2);
  let genres = server.createList('genre', 5);

  projects.forEach(function(project) {
    sampleSize(genres, 2).forEach(function(genre) {
      server.create('project-genre', { project, genre })
    });
  });
}
