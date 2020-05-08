using System;
using System.Collections.Generic;
using System.Text;

namespace CodeProject.Mongo.Data.Transformations
{
    public class ProductDataTransformation
    {
		public string ProductId { get; set; }
		public string ProductNumber { get; set; }
		public string Description { get; set; }
		public string LongDescription { get; set; }
		public decimal UnitPrice { get; set; }
		public int QuantityOnHand { get; set; }
	}
}
