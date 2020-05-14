using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CodeProject.Mongo.Business.Service;
using CodeProject.Mongo.Data.MongoDb;
using CodeProject.Mongo.Interfaces;
using CodeProject.Mongo.WebApi.Controllers.ActionFilters;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;

namespace CodeProject.Mongo.WebApi
{
	public class Startup
	{
		public Startup(IConfiguration configuration)
		{
			Configuration = configuration;
		}

		public IConfiguration Configuration { get; }

		// This method gets called by the runtime. Use this method to add services to the container.
		public void ConfigureServices(IServiceCollection services)
		{
		
			services.AddCors(options =>
			{
				options.AddPolicy("SiteCorsPolicy",
					builder =>
					{
						builder.WithOrigins("http://localhost:3000").AllowAnyHeader().AllowAnyMethod();
					});				
			});

			services.AddControllers().AddNewtonsoftJson();

			services.AddTransient<IOnlineStoreDataService, OnlineStoreDataService>();

			services.AddTransient<IOnlineStoreBusinessService>(provider =>
			new OnlineStoreBusinessService(provider.GetRequiredService<IOnlineStoreDataService>()));

			services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
			{
				options.TokenValidationParameters = new TokenValidationParameters
				{
					ValidateIssuer = false,
					ValidateAudience = false,
					ValidateLifetime = true,
					ValidateIssuerSigningKey = true,
					ValidIssuer = "https://codeproject.microservices.com",
					ValidAudience = "https://codeproject.microservices.com",
					IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes("CodeProject.Shared.Common.TokenManagement"))
				};
			});

			services.AddScoped<SecurityFilter>();
		
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
		{
			app.Use(async (ctx, next) =>
			{
				await next();
				if (ctx.Response.StatusCode == 204)
				{
					ctx.Response.ContentLength = 0;
				}
			});

			app.UseAuthentication();

			if (env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();
			}

			app.UseHttpsRedirection();

			app.UseRouting();

			app.UseCors("SiteCorsPolicy");

			app.UseAuthorization();

			app.UseEndpoints(endpoints =>
			{
				endpoints.MapControllers();
			});

		}
	}
}
