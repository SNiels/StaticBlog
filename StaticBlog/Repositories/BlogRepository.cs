using Microsoft.AspNetCore.Hosting;
using StaticBlog.Models;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using YamlDotNet.Serialization;
using YamlDotNet.Serialization.Converters;
using System.Text;

namespace StaticBlog.Repositories
{
    public class BlogRepository : IBlogRepository
    {
        private readonly IHostingEnvironment hostingEnvironment;

        public BlogRepository(IHostingEnvironment hostingEnvironment)
        {
            this.hostingEnvironment = hostingEnvironment;
        }

        public Dictionary<string, Post> GetPosts()
        {
            var posts = new List<Post>();
            var metadataFileNames = Directory.GetFiles($"{hostingEnvironment.ContentRootPath}/Posts/", "*.html", SearchOption.AllDirectories);

            foreach (var metadataFileName in metadataFileNames)
            {
                using (var reader = new StreamReader(metadataFileName))
                {
                    var metadataStringBuilder = new StringBuilder();
                    var contentStringBuilder = new StringBuilder();
                    var contentStarted = false;
                    while (true)
                    {
                        var line = reader.ReadLine();

                        if (line == null)
                        {
                            break;
                        }

                        if (line == "---")
                        {
                            contentStarted = true;
                            continue;
                        }

                        if (!contentStarted)
                        {
                            metadataStringBuilder.AppendLine(line);
                        }
                        else
                        {
                            contentStringBuilder.AppendLine(line);
                        }
                    }

                    var metadataYaml = metadataStringBuilder.ToString();

                    var deserializer = new DeserializerBuilder()
                        .WithTypeConverter(new DateTimeConverter(DateTimeKind.Utc, CultureInfo.InvariantCulture, new[] { "yyyy-MM-dd" }))
                        .Build();

                    var post = deserializer.Deserialize<Post>(metadataYaml);
                    post.Content = contentStringBuilder.ToString();
                    posts.Add(post);
                }
            }
            return posts.OrderBy(metadata => metadata.CreatedAt).ToDictionary(metadata => metadata.Slug);
        }

        public Post GetPostBySlug(string slug) => GetPosts()[slug];
    }
}
