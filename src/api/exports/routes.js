const routes = (handler) => [
  {
    method: "POST",
    path: "/export/playlists",
    handler: handler.postExportPlaylistsHandler,
    options: {
      auth: "app_jwt",
    },
  },
  {
    method: "POST",
    path: "/export/playlists/{id}",
    handler: handler.postExportPlaylistByIdHandler,
    options: {
      auth: "app_jwt",
    },
  },
  {
    method: "GET",
    path: "/export/playlists/{id}",
    handler: handler.getExportPlaylistByIdHandler,
    options: {
      auth: "app_jwt",
    },
  },
];

module.exports = routes;
