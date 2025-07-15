const ClientError = require('../../exceptions/ClientError');

class AlbumLikesHandler {
  constructor(service, cacheService) {
    this._service = service;
    this._cacheService = cacheService;
    this.postAlbumLikeHandler = this.postAlbumLikeHandler.bind(this);
    this.deleteAlbumLikeHandler = this.deleteAlbumLikeHandler.bind(this);
    this.getAlbumLikesHandler = this.getAlbumLikesHandler.bind(this);
  }

  async postAlbumLikeHandler(request, h) {
    try {
      const { id: albumId } = request.params;
      const { id: userId } = request.auth.credentials;
      await this._service.addAlbumLike(userId, albumId);
      
      // Delete cache when album is liked
      await this._cacheService.delete(`album_likes_${albumId}`);
      
      const response = h.response({
        status: 'success',
        message: 'Album liked successfully',
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      throw error;
    }
  }

  async deleteAlbumLikeHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;
    await this._service.deleteAlbumLike(userId, albumId);
    
    // Delete cache when album like is removed
    await this._cacheService.delete(`album_likes_${albumId}`);
    
    return {
      status: 'success',
      message: 'Album like removed',
    };
  }

  async getAlbumLikesHandler(request, h) {
    const { id: albumId } = request.params;
    const cacheKey = `album_likes_${albumId}`;
    
    try {
      // Try to get from cache first
      const cachedLikes = await this._cacheService.get(cacheKey);
      const response = h.response({
        status: 'success',
        data: {
          likes: parseInt(cachedLikes, 10),
        },
      });
      response.header('X-Data-Source', 'cache');
      return response;
    } catch (error) {
      // Cache miss, get from database
      const likes = await this._service.getAlbumLikes(albumId);
      
      // Store in cache
      await this._cacheService.set(cacheKey, likes.toString());
      
      const response = h.response({
        status: 'success',
        data: {
          likes,
        },
      });
      response.header('X-Data-Source', 'database');
      return response;
    }
  }
}

module.exports = AlbumLikesHandler;
