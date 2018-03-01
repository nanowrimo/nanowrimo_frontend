import { sampleSize } from 'lodash';

export default function(server) {
  let project = server.create('project');

  let genres = server.createList('genre', 5);
  sampleSize(genres, 2).forEach(function(genre) {
    server.create('project-genre', { project: project, genre: genre })
  });
}
