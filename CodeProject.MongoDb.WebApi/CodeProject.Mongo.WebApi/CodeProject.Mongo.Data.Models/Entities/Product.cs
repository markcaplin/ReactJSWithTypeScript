using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Text;

namespace CodeProject.Mongo.Data.Models.Entities
{
	public class Product
	{
		[BsonId]
		public ObjectId Id { get; set; }
		public string ProductNumber { get; set; }
		public string Description { get; set; }
		public string LongDescription { get; set; }
		[BsonRepresentation(BsonType.Decimal128)]
		public decimal UnitPrice { get; set; }
		public int QuantityOnHand { get; set; }
		public int QuantitySold { get; set; }
	}
}
