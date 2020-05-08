using System;
using System.Collections.Generic;
using System.Text;

namespace CodeProject.Mongo.WebApi.Security
{
	public class SecurityModel
	{
		public string Token { get; set; }
		public string UserId { get; set; }
		public string FirstName { get; set; }
		public string LastName { get; set; }
		public string EmailAddress { get; set; }
	}
}
