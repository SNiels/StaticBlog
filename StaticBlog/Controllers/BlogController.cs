using Microsoft.AspNetCore.Mvc;
using StaticBlog.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StaticBlog.Controllers
{
    public class BlogController : Controller
    {
        private readonly IBlogRepository blogRepository;

        public BlogController(IBlogRepository blogRepository)
        {
            this.blogRepository = blogRepository;
        }

        public ActionResult Index()
        {
            var post = blogRepository.GetPosts().Values.ToArray();
            return View(post);
        }

        public ActionResult Post(string slug)
        {
            var post = blogRepository.GetPostBySlug(slug);
            return View(post);
        }
    }
}