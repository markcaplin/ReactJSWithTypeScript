using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Filters;
using CodeProject.Mongo.WebApi.Security;

namespace CodeProject.Mongo.WebApi.Controllers.ActionFilters
{
    public class SecurityFilter : IAsyncActionFilter
    {
		/// <summary>
		/// Action Filter
		/// </summary>
		/// <param name="context"></param>
		/// <param name="next"></param>
		/// <returns></returns>
		public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
		{
			string firstName = context.HttpContext.User.FindFirst(ClaimTypes.GivenName).Value;
			string lastName = context.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;
			string emailAddress = context.HttpContext.User.FindFirst(ClaimTypes.Email).Value;
			string userId = context.HttpContext.User.FindFirst(ClaimTypes.PrimarySid).Value;
	
			//string token = TokenManagement.CreateToken(userId, firstName, lastName, emailAddress);

			SecurityModel securityModel = new SecurityModel();
			securityModel.EmailAddress = emailAddress;
			securityModel.FirstName = firstName;
			securityModel.LastName = lastName;
			securityModel.UserId = userId;
			//securityModel.Token = token;

			context.HttpContext.Items["SecurityModel"] = securityModel;

			var resultContext = await next();
		
			//context.HttpContext.Response.Headers.Add("Access-Control-Expose-Headers", "Content-Disposition");
			//context.HttpContext.Response.Headers.Add("authorization", token);
			

		}
	}
}
