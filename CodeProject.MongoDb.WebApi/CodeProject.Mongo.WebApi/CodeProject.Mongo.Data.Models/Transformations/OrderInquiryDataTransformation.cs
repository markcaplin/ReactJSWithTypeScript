using System;
using System.Collections.Generic;
using System.Text;

namespace CodeProject.Mongo.Data.Transformations
{
	public class OrderInquiryDataTransformation
	{
		public int OrderKey { get; set; }
		public int OrderNumber { get; set; }
		public string CustomerName { get; set; }
		public DateTime OrderDate { get; set; }
		public string ProductNumber { get; set; }
		public string Description { get; set; }
		public decimal UnitPrice { get; set; }
		public int OrderQuantity { get; set; }
	}
}
