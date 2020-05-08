using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Text;

namespace CodeProject.Mongo.Data.Models.Entities
{
	public class OrderDetail
	{
		[BsonId]
		public ObjectId ProductId { get; set; }
		[BsonRepresentation(BsonType.Decimal128)]
		public decimal UnitPrice { get; set; }
		public int OrderQuantity { get; set; }
	}
}
