using CodeProject.Mongo.Data.Models.Configuration;
using CodeProject.Mongo.Data.Models.Entities;
using MongoDB.Driver;
using System;

namespace CodeProject.Mongo.Data.MongoDb
{
	
	/// <summary>
	/// Logging Context
	/// </summary>
	public class OnlineStoreDatabase : IOnlineStoreDatabaseContext
	{
		private readonly IMongoDatabase _db;
		private readonly MongoClient _client;

		public OnlineStoreDatabase(Settings options)
		{
			_client = new MongoClient(options.ConnectionString);
			_db = _client.GetDatabase(options.Database);

		}

		public IMongoCollection<Product> Products => _db.GetCollection<Product>("Products");
		public IMongoCollection<Order> Orders => _db.GetCollection<Order>("Orders");
		public IMongoCollection<SequenceNumber> SequenceNumbers => _db.GetCollection<SequenceNumber>("SequenceNumbers");
		public IMongoCollection<LockRow> Locks => _db.GetCollection<LockRow>("Locks");
		public IMongoCollection<User> Users => _db.GetCollection<User>("Users");

		/// <summary>
		/// Get Database Context
		/// </summary>
		/// <returns></returns>
		public IMongoDatabase GetInternalDatabaseContext()
		{
			return _db;
		}

		/// <summary>
		/// Get Mongo Client
		/// </summary>
		/// <returns></returns>
		public MongoClient GetMongoClient()
		{
			return _client;
		}
	}

	/// <summary>
	/// Customer Context
	/// </summary>
	public interface IOnlineStoreDatabaseContext
	{
		IMongoCollection<Product> Products { get; }
		IMongoCollection<Order> Orders { get; }
		IMongoCollection<SequenceNumber> SequenceNumbers { get; }
		IMongoCollection<LockRow> Locks { get; }
		IMongoCollection<User> Users { get; }

	}
}
