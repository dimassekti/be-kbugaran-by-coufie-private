const routes = (handler) => [
  {
    method: "POST",
    path: "/albums",
    handler: handler.postAlbumHandler,
  },
  {
    method: "GET",
    path: "/albums",
    handler: handler.getAlbumsHandler,
  },
  {
    method: "GET",
    path: "/albums/{id}",
    handler: handler.getAlbumByIdHandler,
  },
  {
    method: "PUT",
    path: "/albums/{id}",
    handler: handler.putAlbumByIdHandler,
  },
  {
    method: "DELETE",
    path: "/albums/{id}",
    handler: handler.deleteAlbumByIdHandler,
  },
  {
    method: "POST",
    path: "/albums/{id}/covers",
    handler: handler.postUploadAlbumCoverHandler,
    options: {
      payload: {
        allow: "multipart/form-data",
        multipart: true,
        output: "stream",
        maxBytes: 512000, // 500KB
        failAction: (request, h, err) => {
          // File too large (413) - check for various payload size error conditions
          if (
            (err.message &&
              err.message.includes(
                "Payload content length greater than maximum allowed"
              )) ||
            (err.message && err.message.includes("maxBytes")) ||
            (err.output && err.output.statusCode === 413) ||
            err.statusCode === 413 ||
            (err.message && err.message.toLowerCase().includes("too large"))
          ) {
            return h
              .response({
                status: "fail",
                message: "Ukuran file terlalu besar",
              })
              .code(413)
              .takeover();
          }

          // Invalid file type or other payload errors (400)
          return h
            .response({
              status: "fail",
              message: "Format file tidak valid",
            })
            .code(400)
            .takeover();
        },
      },
    },
  },
];

module.exports = routes;
