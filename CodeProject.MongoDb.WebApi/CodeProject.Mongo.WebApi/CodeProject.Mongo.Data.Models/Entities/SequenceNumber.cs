using System;
using System.Collections.Generic;
using System.Text;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace CodeProject.Mongo.Data.Models.Entities
{
	public class SequenceNumber
	{
		[BsonId]
		public ObjectId Id { get; set; }
		public string SequenceKey { get; set; }
		public int SequenceValue { get; set; }
	}
}
