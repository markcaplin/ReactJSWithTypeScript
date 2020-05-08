using System;
using System.Collections.Generic;
using System.Text;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace CodeProject.Mongo.Data.Models.Entities
{
	public class Order
	{
		[BsonId]
		public ObjectId Id { get; set; }
		public int OrderNumber { get; set; }
		public string FirstName { get; set; }
		public string LastName { get; set; }
		public string AddressLine1 { get; set; }
		public string AddressLine2 { get; set; }
		public string City { get; set; }
		public string State { get; set; }
		public string ZipCode { get; set; }
		public string CreditCardNumber { get; set; }
		public string EmailAddress { get; set; }
		[BsonRepresentation(BsonType.DateTime)]
		public DateTime OrderDate { get; set; }
		[BsonRepresentation(BsonType.Decimal128)]
		public decimal OrderTotal { get; set; }
		public List<OrderDetail> OrderDetails { get; set; }
	}
}
