using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CodeProject.Mongo.Data.Common;
using CodeProject.Mongo.Data.Transformations;
using CodeProject.Mongo.Interfaces;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CodeProject.Mongo.WebApi.Controllers
{
	[Route("api/[controller]")]
	[EnableCors("SiteCorsPolicy")]
	[ApiController]
    public class OnlineStoreController : ControllerBase
    {
		private readonly IOnlineStoreBusinessService _onlineStoreBusinessService;

		public OnlineStoreController(IOnlineStoreBusinessService onlineStoreBusinessService)
		{
			_onlineStoreBusinessService = onlineStoreBusinessService;
		}

		/// <summary>
		/// Product Inquiry
		/// </summary>
		/// <param name="productInquiryDataTransformation"></param>
		/// <returns></returns>
		[HttpPost]
		[Route("ProductInquiry")]
		public async Task<IActionResult> ProductInquiry([FromBody] ProductInquiryDataTransformation productInquiryDataTransformation)
		{

			int pageSize = productInquiryDataTransformation.PageSize;
			int currentPageNumber = productInquiryDataTransformation.CurrentPageNumber;
			string sortDirection = productInquiryDataTransformation.SortDirection;
			string sortExpression = productInquiryDataTransformation.SortExpression;

			string productNumber = productInquiryDataTransformation.ProductNumber;
			string description = productInquiryDataTransformation.Description;

			ResponseModel<List<ProductDataTransformation>> returnResponse = new ResponseModel<List<ProductDataTransformation>>();

			try
			{
				returnResponse = await _onlineStoreBusinessService.ProductInquiry(productNumber, description, currentPageNumber, pageSize, sortExpression, sortDirection);
				if (returnResponse.ReturnStatus == false)
				{
					return BadRequest(returnResponse);
				}

				return Ok(returnResponse);

			}
			catch (Exception ex)
			{
				returnResponse.ReturnStatus = false;
				returnResponse.ReturnMessage.Add(ex.Message);
				return BadRequest(returnResponse);
			}

		}

		/// <summary>
		/// Get Orders
		/// </summary>
		/// <returns></returns>
		[HttpGet]
		[Route("GetOrders")]
		public async Task<IActionResult> GetOrders()
		{
			ResponseModel<List<OrderInquiryDataTransformation>> returnResponse = new ResponseModel<List<OrderInquiryDataTransformation>>();

			try
			{
				returnResponse = await _onlineStoreBusinessService.GetOrders();
				if (returnResponse.ReturnStatus == false)
				{
					return BadRequest(returnResponse);
				}

				return Ok(returnResponse);

			}
			catch (Exception ex)
			{
				returnResponse.ReturnStatus = false;
				returnResponse.ReturnMessage.Add(ex.Message);
				return BadRequest(returnResponse);
			}

		}


		/// <summary>
		/// Get Product Detail
		/// </summary>
		/// <param name="productNumber"></param>
		/// <returns></returns>
		[HttpGet]
		[Route("GetProductDetail/{productNumber}")]
		public async Task<IActionResult> GetProductDetail(string productNumber)
		{

			ResponseModel<ProductDataTransformation> returnResponse = new ResponseModel<ProductDataTransformation>();

			try
			{
				returnResponse = await _onlineStoreBusinessService.GetProductDetail(productNumber);
				if (returnResponse.ReturnStatus == false)
				{
					return BadRequest(returnResponse);
				}

				return Ok(returnResponse);

			}
			catch (Exception ex)
			{
				returnResponse.ReturnStatus = false;
				returnResponse.ReturnMessage.Add(ex.Message);
				return BadRequest(returnResponse);
			}

		}

		[HttpPost]
		[Route("CreateOrder")]
		public async Task<IActionResult> CreateOrder([FromBody] OrderDataTransformation orderDataTransformation)
		{

			ResponseModel<OrderDataTransformation> returnResponse = new ResponseModel<OrderDataTransformation>();

			try
			{
				returnResponse = await _onlineStoreBusinessService.CreateOrder(orderDataTransformation);
				if (returnResponse.ReturnStatus == false)
				{
					return BadRequest(returnResponse);
				}

				return Ok(returnResponse);

			}
			catch (Exception ex)
			{
				returnResponse.ReturnStatus = false;
				returnResponse.ReturnMessage.Add(ex.Message);
				return BadRequest(returnResponse);
			}

		}

	}
}