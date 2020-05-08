using CodeProject.Mongo.Data.Common;
using CodeProject.Mongo.Data.Models.Entities;
using CodeProject.Mongo.Data.Transformations;
using CodeProject.Mongo.Interfaces;
using MongoDB.Bson;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CodeProject.Mongo.Business.Service
{
	/// <summary>
	/// Online Store Business Service
	/// </summary>
	public class OnlineStoreBusinessService : IOnlineStoreBusinessService
	{
		private readonly IOnlineStoreDataService _onlineStoreDataService;

		public OnlineStoreBusinessService(IOnlineStoreDataService onlineStoreDataService)
		{
			_onlineStoreDataService = onlineStoreDataService;
		}

		/// <summary>
		/// Upload Products
		/// </summary>
		/// <param name="products"></param>
		/// <returns></returns>
		public async Task<ResponseModel<List<ProductDataTransformation>>> UploadProducts(List<ProductDataTransformation> products)
		{
			ResponseModel<List<ProductDataTransformation>> returnResponse = new ResponseModel<List<ProductDataTransformation>>();

			try
			{
				_onlineStoreDataService.OpenConnection();

				foreach (ProductDataTransformation productItem in products)
				{

					Product product = new Product();

					product.ProductNumber = productItem.ProductNumber;
					product.Description = productItem.Description;
					product.LongDescription = productItem.LongDescription;
					product.UnitPrice = productItem.UnitPrice;
					product.QuantityOnHand = productItem.QuantityOnHand;
					product.QuantitySold = 0;

					await _onlineStoreDataService.CreateProduct(product);

				}

				returnResponse.ReturnStatus = true;

			}
			catch (Exception ex)
			{
				returnResponse.ReturnStatus = false;
				returnResponse.ReturnMessage.Add(ex.Message);
			}
			finally
			{
				_onlineStoreDataService.CloseConnection();
			}

			return returnResponse;
		}

		/// <summary>
		/// Product Inquiry
		/// </summary>
		/// <param name="currentPageNumber"></param>
		/// <param name="pageSize"></param>
		/// <param name="sortExpression"></param>
		/// <param name="sortDirection"></param>
		/// <returns></returns>
		public async Task<ResponseModel<List<ProductDataTransformation>>> ProductInquiry(string productNumber, string description, int currentPageNumber, int pageSize, string sortExpression, string sortDirection)
		{

			ResponseModel<List<ProductDataTransformation>> returnResponse = new ResponseModel<List<ProductDataTransformation>>();

			List<ProductDataTransformation> products = new List<ProductDataTransformation>();

			try
			{
				_onlineStoreDataService.OpenConnection();

				DataGridPagingInformation dataGridPagingInformation = new DataGridPagingInformation();
				dataGridPagingInformation.CurrentPageNumber = currentPageNumber;
				dataGridPagingInformation.PageSize = pageSize;
				dataGridPagingInformation.SortDirection = sortDirection;
				dataGridPagingInformation.SortExpression = sortExpression;

				List<Product> productList = await _onlineStoreDataService.ProductInquiry(productNumber, description, dataGridPagingInformation);
				foreach (Product product in productList)
				{
					ProductDataTransformation productDataTransformation = new ProductDataTransformation();
					productDataTransformation.ProductId = Convert.ToString(product.Id);
					productDataTransformation.ProductNumber = product.ProductNumber;
					productDataTransformation.Description = product.Description;
					productDataTransformation.LongDescription = product.LongDescription;
					productDataTransformation.UnitPrice = product.UnitPrice;
					productDataTransformation.QuantityOnHand = product.QuantityOnHand;

					products.Add(productDataTransformation);
				}

				returnResponse.Entity = products;
				returnResponse.TotalRows = dataGridPagingInformation.TotalRows;
				returnResponse.TotalPages = dataGridPagingInformation.TotalPages;

				returnResponse.ReturnStatus = true;

			}
			catch (Exception ex)
			{
				returnResponse.ReturnStatus = false;
				returnResponse.ReturnMessage.Add(ex.Message);
			}
			finally
			{
				_onlineStoreDataService.CloseConnection();
			}

			return returnResponse;

		}

		/// <summary>
		/// Get Orders
		/// </summary>
		/// <returns></returns>
		public async Task<ResponseModel<List<OrderInquiryDataTransformation>>> GetOrders()
		{

			ResponseModel<List<OrderInquiryDataTransformation>> returnResponse = new ResponseModel<List<OrderInquiryDataTransformation>>();

			List<OrderInquiryDataTransformation> orderList = new List<OrderInquiryDataTransformation>();

			try
			{
				_onlineStoreDataService.OpenConnection();

				List<Order> orders = await _onlineStoreDataService.GetOrders();

				List<ObjectId> productList = (
					from o in orders
					from od in o.OrderDetails
					select od.ProductId).Distinct().ToList();
					
				List<Product> products = await _onlineStoreDataService.GetProducts(productList);

				int counter = 0;

				foreach (Order order in orders)
				{
					foreach (OrderDetail orderDetail in order.OrderDetails)
					{

						counter++;

						OrderInquiryDataTransformation orderInquiryDataTransformation = new OrderInquiryDataTransformation();
						orderInquiryDataTransformation.CustomerName = order.LastName + ", " + order.FirstName;
						orderInquiryDataTransformation.OrderDate = order.OrderDate;
						orderInquiryDataTransformation.OrderNumber = order.OrderNumber;
						orderInquiryDataTransformation.UnitPrice = orderDetail.UnitPrice;
						orderInquiryDataTransformation.OrderQuantity = orderDetail.OrderQuantity;
						orderInquiryDataTransformation.OrderKey = counter;

						Product product = products.Where(x => x.Id == orderDetail.ProductId).FirstOrDefault();
						if (product != null)
						{
							orderInquiryDataTransformation.ProductNumber = product.ProductNumber;
							orderInquiryDataTransformation.Description = product.Description;
						}

						orderList.Add(orderInquiryDataTransformation);

					}

				}

				returnResponse.Entity = orderList;

				returnResponse.ReturnStatus = true;

			}
			catch (Exception ex)
			{
				returnResponse.ReturnStatus = false;
				returnResponse.ReturnMessage.Add(ex.Message);
			}
			finally
			{
				_onlineStoreDataService.CloseConnection();
			}

			return returnResponse;

		}

		/// <summary>
		/// Get Product Detail
		/// </summary>
		/// <param name="productNumber"></param>
		/// <returns></returns>
		public async Task<ResponseModel<ProductDataTransformation>> GetProductDetail(string productId)
		{

			ResponseModel<ProductDataTransformation> returnResponse = new ResponseModel<ProductDataTransformation>();

			ProductDataTransformation product = new ProductDataTransformation();

			try
			{
				_onlineStoreDataService.OpenConnection();

				Product productDetail = await _onlineStoreDataService.GetProduct(productId);

				ProductDataTransformation productDataTransformation = new ProductDataTransformation();
				productDataTransformation.ProductId = Convert.ToString(productDetail.Id);
				productDataTransformation.ProductNumber = productDetail.ProductNumber;
				productDataTransformation.Description = productDetail.Description;
				productDataTransformation.LongDescription = productDetail.LongDescription;
				productDataTransformation.UnitPrice = productDetail.UnitPrice;

				returnResponse.Entity = productDataTransformation;

				returnResponse.ReturnStatus = true;

			}
			catch (Exception ex)
			{
				returnResponse.ReturnStatus = false;
				returnResponse.ReturnMessage.Add(ex.Message);
			}
			finally
			{
				_onlineStoreDataService.CloseConnection();
			}

			return returnResponse;

		}

		/// <summary>
		/// Create Order
		/// </summary>
		/// <param name="orderDataTransformation"></param>
		/// <returns></returns>
		public async Task<ResponseModel<OrderDataTransformation>> CreateOrderOld(OrderDataTransformation orderDataTransformation)
		{

			ResponseModel<OrderDataTransformation> returnResponse = new ResponseModel<OrderDataTransformation>();

			ChangeTracking<Product> changeTracking = new ChangeTracking<Product>(_onlineStoreDataService);

			try
			{
				_onlineStoreDataService.OpenConnection();

				foreach (OrderDetailDataTransformation orderDetailTransformation in orderDataTransformation.OrderDetails)
				{
					string productId = orderDetailTransformation.ProductId;
					string productNumber = orderDetailTransformation.ProductNumber;

					Boolean returnStatus = await _onlineStoreDataService.AcquireLock("Product", productId);
					if (returnStatus == false)
					{
						returnResponse.ReturnStatus = false;
						returnResponse.ReturnMessage.Add("Unable to process order. Please retry later.");

						await changeTracking.RollbackChanges();

						return returnResponse;
					}

					changeTracking.LockedRow("Product", productId);

					Product product = await _onlineStoreDataService.GetProduct(productId);

					int quantityOnHand = product.QuantityOnHand - orderDetailTransformation.OrderQuantity;

					if (quantityOnHand < 0)
					{
						returnResponse.ReturnStatus = false;
						returnResponse.ReturnMessage.Add("Quantity not available for product " + productNumber);

						await changeTracking.RollbackChanges();

						return returnResponse;
					}

				}
				//
				//	Create Order
				//
				Order order = new Order();
				order.FirstName = orderDataTransformation.FirstName;
				order.LastName = orderDataTransformation.LastName;
				order.AddressLine1 = orderDataTransformation.AddressLine1;
				order.AddressLine2 = orderDataTransformation.AddressLine2;
				order.City = orderDataTransformation.City;
				order.State = orderDataTransformation.State;
				order.ZipCode = orderDataTransformation.ZipCode;
				order.EmailAddress = orderDataTransformation.EmailAddress;
				order.OrderDate = DateTime.Now;
				order.OrderTotal = 0;

				order.OrderDetails = new List<OrderDetail>();

				foreach (OrderDetailDataTransformation orderDetailTransformation in orderDataTransformation.OrderDetails)
				{

					OrderDetail orderDetail = new OrderDetail();
					orderDetail.OrderQuantity = orderDetailTransformation.OrderQuantity;
					orderDetail.UnitPrice = orderDetailTransformation.UnitPrice;

					decimal lineItemValue = orderDetail.OrderQuantity * orderDetail.UnitPrice;
					order.OrderTotal = order.OrderTotal + lineItemValue;

					string productNumber = orderDetailTransformation.ProductNumber;
					string productId = orderDetailTransformation.ProductId;

					Product product = await _onlineStoreDataService.GetProduct(productId);

					changeTracking.EntityBeforeImage(product);

					product.QuantitySold = product.QuantitySold + orderDetail.OrderQuantity;
					product.QuantityOnHand = product.QuantityOnHand - orderDetail.OrderQuantity;

					await _onlineStoreDataService.UpdateProduct(product);

					orderDetail.ProductId = product.Id;

					order.OrderDetails.Add(orderDetail);

				}

				await _onlineStoreDataService.CreateOrder(order);
				returnResponse.ReturnStatus = true;

				await changeTracking.CommitChanges();

			}
			catch (Exception ex)
			{

				await changeTracking.RollbackChanges();

				returnResponse.ReturnStatus = false;
				returnResponse.ReturnMessage.Add(ex.Message);
			}
			finally
			{
				_onlineStoreDataService.CloseConnection();
			}

			return returnResponse;

		}

		/// <summary>
		/// Create Order
		/// </summary>
		/// <param name="orderDataTransformation"></param>
		/// <returns></returns>
		public async Task<ResponseModel<OrderDataTransformation>> CreateOrder(OrderDataTransformation orderDataTransformation)
		{

			ResponseModel<OrderDataTransformation> returnResponse = new ResponseModel<OrderDataTransformation>();

			PessimisticLocking pessimisticLocking = new PessimisticLocking(_onlineStoreDataService);

			try
			{
				_onlineStoreDataService.OpenConnection();

				await _onlineStoreDataService.StartTransaction();

				//
				//	Create Order
				//

				Order order = new Order();

				order.FirstName = orderDataTransformation.FirstName;
				order.LastName = orderDataTransformation.LastName;
				order.AddressLine1 = orderDataTransformation.AddressLine1;
				order.AddressLine2 = orderDataTransformation.AddressLine2;
				order.City = orderDataTransformation.City;
				order.State = orderDataTransformation.State;
				order.ZipCode = orderDataTransformation.ZipCode;
				order.EmailAddress = orderDataTransformation.EmailAddress;
				order.CreditCardNumber = orderDataTransformation.CreditCardNumber;

				order.OrderDate = DateTime.Now;
				order.OrderTotal = 0;

				order.OrderDetails = new List<OrderDetail>();

				foreach (OrderDetailDataTransformation orderDetailTransformation in orderDataTransformation.OrderDetails.OrderBy(x=>x.ProductNumber))
				{
					OrderDetail orderDetail = new OrderDetail();
					orderDetail.OrderQuantity = orderDetailTransformation.OrderQuantity;
					orderDetail.UnitPrice = orderDetailTransformation.UnitPrice;

					decimal lineItemValue = orderDetail.OrderQuantity * orderDetail.UnitPrice;
					order.OrderTotal = order.OrderTotal + lineItemValue;

					string productNumber = orderDetailTransformation.ProductNumber;
					string productId = orderDetailTransformation.ProductId;

					await pessimisticLocking.AcquireLock("Product", productId);

					Product product = await _onlineStoreDataService.UpdateStock(productId, orderDetail.OrderQuantity);
					if (product.QuantityOnHand < 0)
					{
						returnResponse.ReturnStatus = false;
						returnResponse.ReturnMessage.Add("Quantity not available for product " + productNumber);

						await _onlineStoreDataService.AbortTransaction();

						return returnResponse;
					}
					orderDetail.ProductId = product.Id;

					order.OrderDetails.Add(orderDetail);

				}

				await _onlineStoreDataService.CreateOrder(order);

				await _onlineStoreDataService.CommitTransaction();

				returnResponse.ReturnStatus = true;

			}
			catch (Exception ex)
			{
				await _onlineStoreDataService.AbortTransaction();

				returnResponse.ReturnStatus = false;
				returnResponse.ReturnMessage.Add(ex.Message);
			}
			finally
			{
				await pessimisticLocking.UnlockRows();

				_onlineStoreDataService.CloseConnection();
			}

			return returnResponse;

		}

		/// <summary>
		/// Get User
		/// </summary>
		/// <param name="emailAddress"></param>
		/// <returns></returns>
		public async Task<ResponseModel<UserDataTransformation>> GetUser(string emailAddress)
		{

			ResponseModel<UserDataTransformation> returnResponse = new ResponseModel<UserDataTransformation>();

			UserDataTransformation user = new UserDataTransformation();

			try
			{
				_onlineStoreDataService.OpenConnection();

				UserDataTransformation userDetail = await _onlineStoreDataService.GetUser(emailAddress);
				if (userDetail == null)
				{
					returnResponse.ReturnStatus = false;
					returnResponse.ReturnMessage.Add("User not found");
					return returnResponse;
				}

				returnResponse.Entity = userDetail;

				returnResponse.ReturnStatus = true;

			}
			catch (Exception ex)
			{
				returnResponse.ReturnStatus = false;
				returnResponse.ReturnMessage.Add(ex.Message);
			}
			finally
			{
				_onlineStoreDataService.CloseConnection();
			}

			return returnResponse;

		}

		/// <summary>
		/// Validate Existing Email Address
		/// </summary>
		/// <param name="emailAddress"></param>
		/// <returns></returns>
		public async Task<ResponseModel<UserDataTransformation>> ValidateExistingEmailAddress(string emailAddress)
		{

			ResponseModel<UserDataTransformation> returnResponse = new ResponseModel<UserDataTransformation>();

			UserDataTransformation user = new UserDataTransformation();

			try
			{
				_onlineStoreDataService.OpenConnection();

				UserDataTransformation userDetail = await _onlineStoreDataService.GetUser(emailAddress);
				if (userDetail != null)
				{
					returnResponse.ReturnStatus = false;
					returnResponse.ReturnMessage.Add("Email Address already exists");
					return returnResponse;
				}

				returnResponse.ReturnStatus = true;

			}
			catch (Exception ex)
			{
				returnResponse.ReturnStatus = false;
				returnResponse.ReturnMessage.Add(ex.Message);
			}
			finally
			{
				_onlineStoreDataService.CloseConnection();
			}

			return returnResponse;

		}

		/// <summary>
		/// Register User
		/// </summary>
		/// <param name="emailAddress"></param>
		/// <returns></returns>
		public async Task<ResponseModel<UserDataTransformation>> RegisterUser(UserDataTransformation user)
		{

			ResponseModel<UserDataTransformation> returnResponse = new ResponseModel<UserDataTransformation>();

			try
			{
				_onlineStoreDataService.OpenConnection();

				UserDataTransformation userDetail = await _onlineStoreDataService.CreateUser(user);
				returnResponse.Entity = userDetail;
				returnResponse.ReturnStatus = true;

			}
			catch (Exception ex)
			{
				returnResponse.ReturnStatus = false;
				returnResponse.ReturnMessage.Add(ex.Message);
			}
			finally
			{
				_onlineStoreDataService.CloseConnection();
			}

			return returnResponse;

		}

		/// <summary>
		/// Login
		/// </summary>
		/// <param name="emailAddress"></param>
		/// <returns></returns>
		public async Task<ResponseModel<UserDataTransformation>> Login(UserDataTransformation user)
		{

			ResponseModel<UserDataTransformation> returnResponse = new ResponseModel<UserDataTransformation>();

			try
			{
				_onlineStoreDataService.OpenConnection();

				UserDataTransformation userDetail = await _onlineStoreDataService.GetUser(user.EmailAddress);
				if (userDetail==null)
				{
					returnResponse.ReturnStatus = false;
					returnResponse.ReturnMessage.Add("Login failed...");
					return returnResponse;
				}

				if (user.Password != userDetail.Password)
				{
					returnResponse.ReturnStatus = false;
					returnResponse.ReturnMessage.Add("Login failed...");
					return returnResponse;
				}

				await _onlineStoreDataService.UpdateUser(userDetail.Id);

				returnResponse.Entity = userDetail;
				returnResponse.ReturnStatus = true;

			}
			catch (Exception ex)
			{
				returnResponse.ReturnStatus = false;
				returnResponse.ReturnMessage.Add(ex.Message);
			}
			finally
			{
				_onlineStoreDataService.CloseConnection();
			}

			return returnResponse;

		}

	}
}
