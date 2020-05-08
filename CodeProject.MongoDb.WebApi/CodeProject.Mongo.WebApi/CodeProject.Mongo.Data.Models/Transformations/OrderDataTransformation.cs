using System;
using System.Collections.Generic;
using System.Text;

namespace CodeProject.Mongo.Data.Transformations
{
	public class OrderDataTransformation
	{
		public string FirstName { get; set; }
		public string LastName { get; set; }
		public string AddressLine1 { get; set; }
		public string AddressLine2 { get; set; }
		public string City { get; set; }
		public string State { get; set; }
		public string ZipCode { get; set; }
		public string EmailAddress { get; set; }
		public string CreditCardNumber { get; set; }
		public DateTime OrderDate { get; set; }
		public decimal OrderTotal { get; set; }
		public List<OrderDetailDataTransformation> OrderDetails { get; set; }
	}
}
