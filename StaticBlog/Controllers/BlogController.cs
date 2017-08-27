using Microsoft.AspNetCore.Mvc;
using StaticBlog.Repositories;
using System.Linq;

namespace StaticBlog.Controllers
{
    public class BlogController : Controller
    {
        private readonly IBlogRepository blogRepository;

        public BlogController(IBlogRepository blogRepository)
        {
            this.blogRepository = blogRepository;
        }

        public ActionResult Index(int pageNumber = 1)
        {
            var pageSize = 6;
            var allPosts = blogRepository.GetPosts().Values;
            var selectedPosts = allPosts
                .Skip(pageSize * (pageNumber - 1))
                .Take(pageSize)
                .ToArray();
            return View(selectedPosts);
        }

        public ActionResult Post(string slug)
        {
            var post = blogRepository.GetPostBySlug(slug);
            return View(post);
        }
    }
}