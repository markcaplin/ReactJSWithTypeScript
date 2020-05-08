using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Text;

namespace CodeProject.Mongo.Data.Models.Entities
{
	public class LockRow
	{
		[BsonId]
		public ObjectId Id { get; set; }
		public string Table { get; set; }
		public string EntityId { get; set; }
		[BsonRepresentation(BsonType.DateTime)]
		public DateTime CreatedAt { get; set; }
	}
}
