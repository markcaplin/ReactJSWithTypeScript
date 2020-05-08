using System;
using System.Collections.Generic;
using System.Text;

namespace CodeProject.Mongo.Data.Transformations
{
	public class ProductInquiryDataTransformation
	{
		public string ProductNumber { get; set; }
		public string Description { get; set; }
		public int CurrentPageNumber { get; set; }
		public int PageSize { get; set; }
		public string SortDirection { get; set; }
		public string SortExpression { get; set; }
	}
}
