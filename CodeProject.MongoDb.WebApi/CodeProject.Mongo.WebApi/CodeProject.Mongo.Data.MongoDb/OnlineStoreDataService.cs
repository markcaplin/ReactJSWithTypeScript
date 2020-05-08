using CodeProject.Mongo.Data.Common;
using CodeProject.Mongo.Data.Models.Entities;
using CodeProject.Mongo.Data.Transformations;
using CodeProject.Mongo.Functions;
using CodeProject.Mongo.Interfaces;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace CodeProject.Mongo.Data.MongoDb
{
	public class OnlineStoreDataService : MongoDbRepository, IOnlineStoreDataService
	{
		/// <summary>
		/// Create Product
		/// </summary>
		/// <param name="product"></param>
		/// <returns></returns>
		public async Task CreateProduct(Product product)
		{
			await dbConnection.Products.InsertOneAsync(product);
		}
		
		/// <summary>
		/// Create User
		/// </summary>
		/// <param name="user"></param>
		/// <returns></returns>
		public async Task<UserDataTransformation> CreateUser(UserDataTransformation user)
		{
			User newUser = new User();

			newUser.FirstName = user.FirstName;
			newUser.LastName = user.LastName;
			newUser.EmailAddress = user.EmailAddress;
			newUser.Password = user.Password;
			newUser.AddressLine1 = user.AddressLine1;
			newUser.AddressLine2 = user.AddressLine2;
			newUser.City = user.City;
			newUser.State = user.State;
			newUser.ZipCode = user.ZipCode;
			newUser.PhoneNumber = user.PhoneNumber;
			newUser.LoginDate = DateTime.Now;
			
			await dbConnection.Users.InsertOneAsync(newUser);

			user.Id = Convert.ToString(newUser.Id);

			return user;
		}


		/// <summary>
		/// Create Order
		/// </summary>
		/// <param name="order"></param>
		/// <returns></returns>
		public async Task CreateOrder(Order order)
		{
			order.OrderNumber = await GetNextOrderNumber();
			await dbConnection.Orders.InsertOneAsync(this.Session, order);
		}

		/// <summary>
		/// Get Next Order Number
		/// </summary>
		/// <returns></returns>
		private async Task<int> GetNextOrderNumber()
		{
			int orderNumber = await GetNextSequenceNumber("OrderNumber");
			return orderNumber;
		}

		/// <summary>
		/// Create Index 
		/// </summary>
		public async Task CreateUniqueSequenceIndex()
		{
			IndexKeysDefinition<SequenceNumber> keys =
						Builders<SequenceNumber>.IndexKeys
							.Ascending("SequenceKey")
							.Ascending("SequenceValue");

			var options = new CreateIndexOptions { Unique = true };
			var indexModel = new CreateIndexModel<SequenceNumber>(keys, options);

			await dbConnection.SequenceNumbers.Indexes.CreateOneAsync(indexModel);
		}

		/// <summary>
		/// Create Unique Index for Product/Product Number 
		/// </summary>
		public async Task CreateProductProductNumberUniqueIndex()
		{
			IndexKeysDefinition<Product> keys =
						Builders<Product>.IndexKeys
							.Ascending("ProductNumber");

			var options = new CreateIndexOptions { Unique = true };
			var indexModel = new CreateIndexModel<Product>(keys, options);

			await dbConnection.Products.Indexes.CreateOneAsync(indexModel);
		}

		/// <summary>
		/// Create Unique Index for Order/Order Number 
		/// </summary>
		public async Task CreateOrderOrderNumberUniqueIndex()
		{
			IndexKeysDefinition<Order> keys =
						Builders<Order>.IndexKeys
							.Ascending("OrderNumber");

			var options = new CreateIndexOptions { Unique = true };
			var indexModel = new CreateIndexModel<Order>(keys, options);

			await dbConnection.Orders.Indexes.CreateOneAsync(indexModel);
		}

		/// <summary>
		/// Create Lock Index
		/// </summary>
		public async Task CreateLockIndex()
		{
			IndexKeysDefinition<LockRow> keys =
						Builders<LockRow>.IndexKeys
							.Ascending("Table")
							.Ascending("EntityId");

			CreateIndexOptions options = new CreateIndexOptions();
			options.Unique = true;

			var indexModel = new CreateIndexModel<LockRow>(keys, options);

			await dbConnection.Locks.Indexes.CreateOneAsync(indexModel);

		}

		/// <summary>
		/// Create Lock Expired Index
		/// </summary>
		/// <returns></returns>
		public async Task CreateLockExpiredIndex()
		{
			IndexKeysDefinition<LockRow> keys =
						Builders<LockRow>.IndexKeys
							.Ascending("CreatedAt");

			CreateIndexOptions options = new CreateIndexOptions();
			options.ExpireAfter = TimeSpan.FromSeconds(60);
			
			var indexModel = new CreateIndexModel<LockRow>(keys, options);

			await dbConnection.Locks.Indexes.CreateOneAsync(indexModel);
		}

		/// <summary>
		/// Acquire Lock
		/// </summary>
		/// <param name="table"></param>
		/// <param name="entityId"></param>
		/// <returns></returns>
		public async Task<Boolean> AcquireLock(string table, string entityId)
		{

			FilterDefinition<LockRow> filter = Builders<LockRow>
				.Filter.Eq(m => m.Table, table);

			filter = filter & Builders<LockRow>.Filter.Eq(m => m.EntityId, entityId);

			Boolean returnStatus = false;

			while (returnStatus == false)
			{
				DateTime currentDateTime = DateTime.Now;
				double secondsElapsed = (currentDateTime - this.TransactionStartDateTime).TotalSeconds;
				if (secondsElapsed >= 60)
				{
					throw new Exception("Transaction Expired");
				}

				try
				{
					LockRow lockedRow = await dbConnection.Locks.Find(filter).FirstOrDefaultAsync();
					if (lockedRow == null)
					{
						LockRow lockrow = new LockRow();
						lockrow.Table = table;
						lockrow.EntityId = entityId;
						lockrow.CreatedAt = DateTime.Now;

						await dbConnection.Locks.InsertOneAsync(lockrow);
						returnStatus = true;
					}
					else
					{
						await Task.Delay(1000);
					}
				
				}
				catch (Exception)
				{
					await Task.Delay(1000);
				}
			}

			return returnStatus;
		}

		/// <summary>
		/// Unlock row
		/// </summary>
		/// <param name="table"></param>
		/// <param name="entityId"></param>
		/// <returns></returns>
		public async Task<Boolean> UnLockRow(string table, string entityId)
		{
			await dbConnection.Locks.DeleteOneAsync(
				filter: p => p.Table == table && p.EntityId == entityId);

			return true;
		}

		/// <summary>
		/// Get Next Sequence Number
		/// </summary>
		/// <returns></returns>
		private async Task<int> GetNextSequenceNumber(string sequenceKey)
		{

			FilterDefinition<SequenceNumber> filter = Builders<SequenceNumber>
				.Filter.Eq(m => m.SequenceKey, sequenceKey);

			FindOneAndUpdateOptions<SequenceNumber> options = new FindOneAndUpdateOptions<SequenceNumber>();
			options.IsUpsert = false;
			options.ReturnDocument = ReturnDocument.After;

			SequenceNumber updatedSequence = await dbConnection.SequenceNumbers
				.FindOneAndUpdateAsync(filter, 
				Builders<SequenceNumber>.Update.Inc(x => x.SequenceValue, 1), options);

			return updatedSequence.SequenceValue;

		}

		/// <summary>
		/// Update Stock
		/// </summary>
		/// <param name="productId"></param>
		/// <param name="quantitySold"></param>
		/// <returns></returns>
		public async Task<Product> UpdateStock(string productId, int quantitySold)
		{
			
			int quantityReduced = quantitySold * -1;

			ObjectId productIdentifier = new ObjectId(productId);

			FilterDefinition<Product> filter = Builders<Product>.Filter.Eq(m => m.Id, productIdentifier);

			FindOneAndUpdateOptions<Product> options = new FindOneAndUpdateOptions<Product>();
			options.IsUpsert = false;
			options.ReturnDocument = ReturnDocument.After;

			UpdateDefinition<Product> update = Builders<Product>.Update
						   .Inc("QuantitySold", quantitySold)
						   .Inc("QuantityOnHand", quantityReduced);

			Product updatedProduct = await dbConnection.Products
				.FindOneAndUpdateAsync(this.Session, filter, update, options);

			return updatedProduct;

		}

		/// <summary>
		/// Get Product
		/// </summary>
		/// <param name="productId"></param>
		/// <returns></returns>
		public async Task<Product> GetProduct(string productId)
		{
		
			ObjectId productIdentifier = new ObjectId(productId);

			FilterDefinition<Product> filter = Builders<Product>.Filter.Eq(m => m.Id, productIdentifier);

			Product product = await dbConnection.Products.Find(filter).FirstOrDefaultAsync();

			return product;
		}

		/// <summary>
		/// Update User
		/// </summary>
		/// <param name="userId"></param>
		/// <returns></returns>
		public async Task<User> UpdateUser(string userId)
		{
			
			ObjectId userIdentifier = new ObjectId(userId);

			FilterDefinition<User> filter = Builders<User>.Filter.Eq(m => m.Id, userIdentifier);

			FindOneAndUpdateOptions<User> options = new FindOneAndUpdateOptions<User>();
			options.IsUpsert = false;
			options.ReturnDocument = ReturnDocument.After;

			UpdateDefinition<User> update = Builders<User>.Update
						   .Set("LoginDate", DateTime.Now);
					
			User updatedUser = await dbConnection.Users.FindOneAndUpdateAsync(filter, update, options);

			return updatedUser;

		}

		/// <summary>
		/// Get User
		/// </summary>
		/// <param name="emailAddress"></param>
		/// <returns></returns>
		public async Task<UserDataTransformation> GetUser(string emailAddress)
		{
			FilterDefinition<User> filter = Builders<User>.Filter.Eq(m => m.EmailAddress, emailAddress);

			User user = await dbConnection.Users.Find(filter).FirstOrDefaultAsync();
			if (user == null)
			{
				return null;
			}

			UserDataTransformation userInformation = new UserDataTransformation();
			userInformation.Id = Convert.ToString(user.Id);
			userInformation.FirstName = user.FirstName;
			userInformation.LastName = user.LastName;
			userInformation.EmailAddress = user.EmailAddress;
			userInformation.Password = user.Password;
			userInformation.AddressLine1 = user.AddressLine1;
			userInformation.AddressLine2 = user.AddressLine2;
			userInformation.City = user.City;
			userInformation.State = user.State;
			userInformation.ZipCode = user.ZipCode;
			userInformation.PhoneNumber = user.PhoneNumber;
			userInformation.LoginDate = user.LoginDate;

			return userInformation;
		}

		/// <summary>
		/// Get Order
		/// </summary>
		/// <param name="orderNumber"></param>
		/// <returns></returns>
		public async Task<Order> GetOrder(int orderNumber)
		{
			FilterDefinition<Order> filter = Builders<Order>.Filter.Eq(m => m.OrderNumber, orderNumber);

			Order order = await dbConnection.Orders.Find(filter).FirstOrDefaultAsync();

			return order;
		}

		/// <summary>
		/// Update Product
		/// </summary>
		/// <param name="product"></param>
		/// <returns></returns>
		public async Task<Product> UpdateProduct(Product product)
		{
			ReplaceOneResult updateResult =
				await dbConnection
						.Products
						.ReplaceOneAsync(
							filter: p => p.Id == product.Id,
							replacement: product);

			return product;
		}

		/// <summary>
		/// Update Order
		/// </summary>
		/// <param name="product"></param>
		/// <returns></returns>
		public async Task<Order> UpdateOrder(Order order)
		{
			ReplaceOneResult updateResult =
				await dbConnection
						.Orders
						.ReplaceOneAsync(
							filter: o => o.Id == order.Id,
							replacement: order);

			return order;
		}

		/// <summary>
		/// Delete Order
		/// </summary>
		/// <param name="order"></param>
		/// <returns></returns>
		public async Task DeleteOrder(Order order)
		{
			await dbConnection.Orders.DeleteOneAsync(filter: o => o.Id == order.Id);
		}

		/// <summary>
		/// Delete Product
		/// </summary>
		/// <param name="product"></param>
		/// <returns></returns>
		public async Task DeleteProduct(Product product)
		{
			await dbConnection.Products.DeleteOneAsync(filter: o => o.Id == product.Id);
		}

		/// <summary>
		/// Get Orders
		/// </summary>
		/// <returns></returns>
		public async Task<List<Order>> GetOrders()
		{
			string sortExpression = "{OrderDate: -1}";
			FilterDefinition<Order> filter = Builders<Order>.Filter.Empty;
			List<Order> orders = await dbConnection.Orders.Find(filter).Sort(sortExpression).ToListAsync();
			return orders;
		}

		/// <summary>
		/// Get Products
		/// </summary>
		/// <param name="products"></param>
		/// <returns></returns>
		public async Task<List<Product>> GetProducts(List<ObjectId> productList)
		{
			
			FilterDefinition<Product> filter = Builders<Product>.Filter.In(p => p.Id, productList);

			List<Product> products = await dbConnection.Products.Find(filter).ToListAsync();
			return products;
		}

		/// <summary>
		/// Product Inquiry
		/// </summary>
		/// <param name="productNumber"></param>
		/// <param name="description"></param>
		/// <param name="paging"></param>
		/// <returns></returns>
		public async Task<List<Product>> ProductInquiry(string productNumber, string description, DataGridPagingInformation paging)
		{
			string sortExpression = paging.SortExpression;
			string sortDirection = paging.SortDirection;

			int sortOrder = 1;
			if (sortDirection == "desc")
			{
				sortOrder = -1;
			}

			if (paging.CurrentPageNumber > 0)
			{
				paging.CurrentPageNumber = paging.CurrentPageNumber - 1;
			}

			if (string.IsNullOrEmpty(sortExpression))
			{
				sortExpression = "{Description: 1}";
			}
			else
			{
				sortExpression = "{" + sortExpression + ": " + sortOrder + "}";
			}

			if (paging.PageSize == 0)
			{
				paging.PageSize = 20;
			}

			//
			//	initialize filter
			//
			FilterDefinition<Product> filter = Builders<Product>.Filter.Empty;

			productNumber = productNumber.Trim();
			description = description.Trim();

			//
			//	filter by product number
			//
			if (productNumber.Length>0)
			{
				filter = filter & Builders<Product>.Filter.Regex(m => m.ProductNumber,
					 new BsonRegularExpression(string.Format("^{0}", productNumber), "i"));
			}
			//
			//	filter by description
			//
			if (description.Length > 0)
			{
				filter = filter & Builders<Product>.Filter.Regex(m => m.Description,
					new BsonRegularExpression(string.Format("{0}", description), "i"));
			}

			long numberOfRows = await dbConnection.Products.CountDocumentsAsync(filter);

			var productCollection = await dbConnection.Products.Find(filter)
				.Skip(paging.CurrentPageNumber * paging.PageSize)
				.Limit(paging.PageSize)
				.Sort(sortExpression)
				.Project(p => new
				{
					p.Id,
					p.ProductNumber,
					p.Description,
					p.LongDescription,
					p.UnitPrice,
					p.QuantityOnHand
				})
				.ToListAsync();

			List<Product> products = new List<Product>();

			foreach (var productDocument in productCollection)
			{
				Product product = new Product();

				product.Id = productDocument.Id;
				product.ProductNumber = productDocument.ProductNumber;
				product.Description = productDocument.Description;
				product.LongDescription = productDocument.LongDescription;
				product.UnitPrice = productDocument.UnitPrice;
				product.QuantityOnHand = productDocument.QuantityOnHand;

				products.Add(product);
			}

			paging.TotalRows = numberOfRows;
			paging.TotalPages = Utilities.CalculateTotalPages(numberOfRows, paging.PageSize);

			return products;
		}




	}
}
