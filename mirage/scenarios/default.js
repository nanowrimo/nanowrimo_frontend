import { sampleSize } from 'lodash';

export default function(server) {
  server.create('user', { name: 'username' });
  
  // Prior demo; replace with realistic Projects and Genres
  let projects = server.createList('project', 2);
  let genres = server.createList('genre', 5);

  projects.forEach(function(project) {
    sampleSize(genres, 2).forEach(function(genre) {
      server.create('project-genre', { project, genre })
    });
  });
}
