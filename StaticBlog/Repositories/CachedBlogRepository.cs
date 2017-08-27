using StaticBlog.Models;
using System.Collections.Generic;
using Microsoft.Extensions.Caching.Memory;

namespace StaticBlog.Repositories
{
    public class CachedBlogRepository : IBlogRepository
    {
        private const string MetadataCacheKey = "metadataCache";
        private readonly IMemoryCache cache;
        private readonly IBlogRepository blogRepository;

        public CachedBlogRepository(IMemoryCache cache, IBlogRepository blogRepository)
        {
            this.cache = cache;
            this.blogRepository = blogRepository;
        }

        public Dictionary<string, Post> GetPosts()
        {
            if (!cache.TryGetValue(MetadataCacheKey, out Dictionary<string, Post> metadata))
            {
                metadata = blogRepository.GetPosts();
                cache.Set(MetadataCacheKey, metadata);
            }

            return metadata;
        }

        public Post GetPostBySlug(string slug) => GetPosts()[slug];
    }
}
