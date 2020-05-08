using CodeProject.Mongo.Data.Common;
using CodeProject.Mongo.Data.Models.Entities;
using CodeProject.Mongo.Data.Transformations;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CodeProject.Mongo.Interfaces
{
	public interface IOnlineStoreDataService : IDataRepository, IDisposable
	{
		Task CreateLockIndex();
		Task CreateLockExpiredIndex();
		Task CreateUniqueSequenceIndex();
		Task CreateProductProductNumberUniqueIndex();
		Task CreateOrderOrderNumberUniqueIndex();

		Task<Boolean> AcquireLock(string table, string entityId);
		Task<Boolean> UnLockRow(string table, string entityId);

		Task CreateProduct(Product product);
		Task DeleteProduct(Product product);
		Task<Product> GetProduct(string productId);
		Task<Product> UpdateProduct(Product product);
		Task<List<Product>> GetProducts(List<ObjectId> productList);
		Task<Product> UpdateStock(string productId, int quantitySold);

		Task CreateOrder(Order order);
		Task DeleteOrder(Order order);
		Task<Order> UpdateOrder(Order order);
		Task<Order> GetOrder(int orderNumber);
		Task<List<Order>> GetOrders();

		Task<UserDataTransformation> GetUser(string emailAddress);
		Task<User> UpdateUser(string userId);
		Task<UserDataTransformation> CreateUser(UserDataTransformation user);

		Task<List<Product>> ProductInquiry(string productNumber, string description, DataGridPagingInformation paging);

	}
}
