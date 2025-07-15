const AlbumLikesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albumlikes',
  version: '1.0.0',
  register: async (server, { service, cacheService }) => {
    const albumLikesHandler = new AlbumLikesHandler(service, cacheService);
    server.route(routes(albumLikesHandler));
  },
};
