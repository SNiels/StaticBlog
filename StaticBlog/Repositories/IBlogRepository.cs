using System.Collections.Generic;
using StaticBlog.Models;

namespace StaticBlog.Repositories
{
    public interface IBlogRepository
    {
        Dictionary<string, Post> GetPosts();
        Post GetPostBySlug(string slug);
    }
}