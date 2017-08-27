using System;
using System.Text.RegularExpressions;

namespace StaticBlog.Models
{
    public class Post
    {
        private string slug;

        public string Title { get; set; }
        public string Slug
        {
            get { return slug ?? GenerateSlug(Title); }
            set { slug = value; }
        }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string[] Tags { get; set; }
        public string Content { get; set; }

        public static string GenerateSlug(string phrase)
        {
            string str = phrase.ToLower();
            // invalid chars           
            str = Regex.Replace(str, @"[^a-z0-9\s-]", "");
            // convert multiple spaces into one space   
            str = Regex.Replace(str, @"\s+", " ").Trim();
            // cut and trim 
            str = str.Substring(0, str.Length <= 45 ? str.Length : 45).Trim();
            str = Regex.Replace(str, @"\s", "-"); // hyphens   
            return str;
        }
    }
}
