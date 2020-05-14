using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CodeProject.Mongo.Data.Common;
using CodeProject.Mongo.Data.Transformations;
using CodeProject.Mongo.Interfaces;
using CodeProject.Mongo.WebApi.Controllers.ActionFilters;
using CodeProject.Mongo.WebApi.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CodeProject.Mongo.WebApi.Controllers
{
	[Route("api/[controller]")]
	[EnableCors("SiteCorsPolicy")]
	[ApiController]
	public class SecureOnlineStoreController : ControllerBase
	{
		private readonly IOnlineStoreBusinessService _onlineStoreBusinessService;

		public SecureOnlineStoreController(IOnlineStoreBusinessService onlineStoreBusinessService)
		{
			_onlineStoreBusinessService = onlineStoreBusinessService;
		}

		/// <summary>
		/// Product Inquiry
		/// </summary>
		/// <param name="productInquiryDataTransformation"></param>
		/// <returns></returns>
		[ServiceFilter(typeof(SecurityFilter))]
		[Authorize]
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
		[ServiceFilter(typeof(SecurityFilter))]
		[Authorize]
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
		[ServiceFilter(typeof(SecurityFilter))]
		[Authorize]
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

		/// <summary>
		/// Create Order
		/// </summary>
		/// <param name="orderDataTransformation"></param>
		/// <returns></returns>
		[ServiceFilter(typeof(SecurityFilter))]
		[Authorize]
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

		/// <summary>
		/// Register User
		/// </summary>
		/// <param name="user"></param>
		/// <returns></returns>
		[HttpPost]
		[Route("Register")]
		public async Task<IActionResult> RegisterUser(UserDataTransformation user)
		{
			ResponseModel<UserDataTransformation> returnResponse = new ResponseModel<UserDataTransformation>();

			try
			{
				returnResponse = await _onlineStoreBusinessService.RegisterUser(user);
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
		/// Login
		/// </summary>
		/// <param name="user"></param>
		/// <returns></returns>
		[HttpPost]
		[Route("Login")]
		public async Task<IActionResult> Login(UserDataTransformation user)
		{
			ResponseModel<UserDataTransformation> returnResponse = new ResponseModel<UserDataTransformation>();

			try
			{
				returnResponse = await _onlineStoreBusinessService.Login(user);
				if (returnResponse.ReturnStatus == false)
				{
					return BadRequest(returnResponse);
				}

				UserDataTransformation userReturned = returnResponse.Entity;

				string token = TokenManagement.CreateToken(userReturned.Id, userReturned.FirstName, userReturned.LastName, userReturned.EmailAddress);
				returnResponse.Entity = new UserDataTransformation();
				returnResponse.Entity.Token = token;
			
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
		/// Validate Email Address
		/// </summary>
		/// <param name="emailAddress"></param>
		/// <returns></returns>
		[HttpGet]
		[Route("ValidateEmailAddress/{emailAddress}")]
		public async Task<IActionResult> ValidateEmailAddress(string emailAddress)
		{
			ResponseModel<UserDataTransformation> returnResponse = new ResponseModel<UserDataTransformation>();

			try
			{
				returnResponse = await _onlineStoreBusinessService.ValidateExistingEmailAddress(emailAddress);
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