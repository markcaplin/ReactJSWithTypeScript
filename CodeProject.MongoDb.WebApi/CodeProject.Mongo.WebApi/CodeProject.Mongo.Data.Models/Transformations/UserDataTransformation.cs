using System;
using System.Collections.Generic;
using System.Text;

namespace CodeProject.Mongo.Data.Transformations
{
	public class UserDataTransformation
	{
		public string Id { get; set; }
		public string EmailAddress { get; set; }
		public string FirstName { get; set; }
		public string LastName { get; set; }
		public string Password { get; set; }
		public string AddressLine1 { get; set; }
		public string AddressLine2 { get; set; }
		public string City { get; set; }
		public string State { get; set; }
		public string ZipCode { get; set; }
		public string PhoneNumber { get; set; }
		public DateTime LoginDate { get; set; }
		public string Token { get; set; }
	}
}
