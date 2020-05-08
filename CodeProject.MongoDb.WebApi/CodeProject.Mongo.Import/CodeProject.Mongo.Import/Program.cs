using CodeProject.Mongo.Business.Service;
using CodeProject.Mongo.Data.Models.Configuration;
using CodeProject.Mongo.Data.Models.Entities;
using CodeProject.Mongo.Data.MongoDb;
using CodeProject.Mongo.Data.Transformations;
using Microsoft.Extensions.PlatformAbstractions;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace CodeProject.Mongo.Import
{
	class Program
	{
		static void Main(string[] args)
		{
			Console.WriteLine("Hello World!");

			DropCollections();
			SeedProductInformation();
			SeedOrderNumberSequence();
			CreateIndexes();

		}

		/// <summary>
		/// Create Indexes
		/// </summary>
		private static void CreateIndexes()
		{
			OnlineStoreDataService onlineStoreDataService = new OnlineStoreDataService();
			onlineStoreDataService.OpenConnection();
			onlineStoreDataService.CreateLockExpiredIndex().Wait();
			onlineStoreDataService.CreateUniqueSequenceIndex().Wait();
			onlineStoreDataService.CreateLockIndex().Wait();
			onlineStoreDataService.CreateOrderOrderNumberUniqueIndex().Wait();
		}

		private static void DropCollections()
		{
			Settings options = new Settings();			
			options.ConnectionString = "mongodb://localhost:27017/?safe=true&connect=replicaset";
			options.Database = "OnlineStore";

			OnlineStoreDatabase onlineStoreDatabase = new OnlineStoreDatabase(options);
			IMongoDatabase db = onlineStoreDatabase.GetInternalDatabaseContext();
			db.DropCollection("Locks");
			db.DropCollection("Products");
			db.DropCollection("Orders");
			db.DropCollection("SequenceNumbers");

		}

		private static void SeedOrderNumberSequence()
		{
			Settings options = new Settings();			
			options.ConnectionString = "mongodb://localhost:27017/?safe=true&connect=replicaset";
			options.Database = "OnlineStore";

			OnlineStoreDatabase onlineStoreDatabase = new OnlineStoreDatabase(options);
	
			SequenceNumber sequenceNumber = new SequenceNumber();
			sequenceNumber.SequenceKey = "OrderNumber";
			sequenceNumber.SequenceValue = 100000;

			onlineStoreDatabase.SequenceNumbers.InsertOneAsync(sequenceNumber);
		}

		/// <summary>
		/// Seed Product Information
		/// </summary>
		private static void SeedProductInformation()
		{
			OnlineStoreDataService onlineStoreDataService = new OnlineStoreDataService();

			OnlineStoreBusinessService onlineStoreBusinessService = new OnlineStoreBusinessService(onlineStoreDataService);

			string basePath = PlatformServices.Default.Application.ApplicationBasePath;

			string contents;
			using (StreamReader streamReader = new StreamReader(basePath + @"\ImportData\products.txt", Encoding.UTF8))
			{
				contents = streamReader.ReadToEnd();
			}

			string[] rows = contents.Split(Environment.NewLine);

			List<ProductDataTransformation> productDataTransformations = new List<ProductDataTransformation>();

			Random random = new Random();

			int counter = 0;

			foreach (string row in rows)
			{
				counter++;

				string[] fields = row.Split('\t');
				if (fields.Length < 4) break;

				ProductDataTransformation product = new ProductDataTransformation();

				product.Description = fields[1];
				product.LongDescription = fields[2];
				product.ProductNumber = fields[0];
				product.UnitPrice = Convert.ToDecimal(fields[3]);
				product.QuantityOnHand = random.Next(100);
				
				productDataTransformations.Add(product);

				Console.WriteLine(counter);

			}

			onlineStoreBusinessService.UploadProducts(productDataTransformations).Wait();
			onlineStoreDataService.CloseConnection();
		}
	}
}
