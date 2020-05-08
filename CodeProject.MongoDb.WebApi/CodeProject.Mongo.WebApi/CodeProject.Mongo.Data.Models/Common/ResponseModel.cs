using System;
using System.Collections.Generic;
using System.Collections;
using System.Text;

namespace CodeProject.Mongo.Data.Common
{
	public class ResponseModel<T>
	{
		public string Token { get; set; }
		public bool ReturnStatus { get; set; }
		public List<String> ReturnMessage { get; set; }
		public Hashtable Errors;
		public long TotalPages;
		public long TotalRows;
		public int PageSize;
		public Boolean IsAuthenicated;
		public T Entity;

		public ResponseModel()
		{
			ReturnMessage = new List<String>();
			ReturnStatus = true;
			Errors = new Hashtable();
			TotalPages = 0;
			TotalPages = 0;
			PageSize = 0;
			IsAuthenicated = false;
		}
	}

}
