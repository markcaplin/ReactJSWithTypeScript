using CodeProject.Mongo.Data.Common;
using CodeProject.Mongo.Data.Models.Entities;
using CodeProject.Mongo.Data.Transformations;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CodeProject.Mongo.Interfaces
{
	public interface IOnlineStoreBusinessService
	{
		Task<ResponseModel<List<ProductDataTransformation>>> UploadProducts(List<ProductDataTransformation> products);
		Task<ResponseModel<List<ProductDataTransformation>>> ProductInquiry(string productNumber, string description, int currentPageNumber, int pageSize, string sortExpression, string sortDirection);
		Task<ResponseModel<ProductDataTransformation>> GetProductDetail(string productNumnber);
		Task<ResponseModel<OrderDataTransformation>> CreateOrder(OrderDataTransformation order);
		Task<ResponseModel<List<OrderInquiryDataTransformation>>> GetOrders();

		Task<ResponseModel<UserDataTransformation>> ValidateExistingEmailAddress(string emailAddress);
		Task<ResponseModel<UserDataTransformation>> RegisterUser(UserDataTransformation user);
		Task<ResponseModel<UserDataTransformation>> Login(UserDataTransformation user);





	}
}
