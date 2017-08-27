using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.SpaServices.Webpack;
using StaticBlog.Repositories;
using Microsoft.Extensions.Caching.Memory;

namespace StaticBlog
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureProductionServices(IServiceCollection services)
        {
            services.AddMvc();
            services.AddMemoryCache();
            services.AddTransient<BlogRepository>();
            services.AddTransient<IBlogRepository, CachedBlogRepository>(provider =>
            {
                return new CachedBlogRepository(
                    provider.GetService<IMemoryCache>(),
                    provider.GetService<BlogRepository>()
                );
            });
        }

        public void ConfigureDevelopmentServices(IServiceCollection services)
        {
            services.AddMvc();
            services.AddTransient<IBlogRepository, BlogRepository>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
                {
                    HotModuleReplacement = true
                });
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseStaticFiles();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");


                //do not use {page}, this causes a bug in core 2
                routes.MapRoute(
                    name: "paged_blogs",
                    template: "blog/page/{pageNumber?}",
                    defaults: new { controller = "Blog", action = "Index" });

                routes.MapRoute(
                    name: "blog",
                    template: "blog/{slug}",
                    defaults: new { controller = "Blog", action = "Post" }
                );
            });
            
        }
    }
}
