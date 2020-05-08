using MongoDB.Driver;
using System;
using System.Threading.Tasks;

namespace CodeProject.Mongo.Interfaces
{
	
	/// <summary>
	/// IDataRepository
	/// </summary>
	public interface IDataRepository
	{

		IClientSessionHandle Session
		{
			get;
		}

		DateTime TransactionStartDateTime
		{
			get;
		}

		void OpenConnection();
		void CloseConnection();
		Task StartTransaction();
		Task CommitTransaction();
		Task AbortTransaction();
	}
}
