using CodeProject.Mongo.Data.Models.Configuration;
using CodeProject.Mongo.Interfaces;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CodeProject.Mongo.Data.MongoDb
{
	

	/// <summary>
	/// MongoDB Repository
	/// </summary>
	public class MongoDbRepository : IDataRepository, IDisposable
	{
		private OnlineStoreDatabase _context;
		private IClientSessionHandle _session;
		private MongoClient _mongoClient;
		private DateTime _transactionStartDateTime;
	
		/// <summary>
		/// Constructor
		/// </summary>
		public MongoDbRepository()
		{

		}

		/// <summary>
		/// Start Transaction
		/// </summary>
		public async Task StartTransaction()
		{
			_transactionStartDateTime = DateTime.Now;

			_session = await _mongoClient.StartSessionAsync();
			_session.StartTransaction();
		}

		/// <summary>
		/// Commit Transaction
		/// </summary>
		public async Task CommitTransaction()
		{
			await _session.CommitTransactionAsync();
		}

		/// <summary>
		/// Abort Transaction
		/// </summary>
		public async Task AbortTransaction()
		{
			await _session.AbortTransactionAsync();
		}

		/// <summary>
		/// Database Context
		/// </summary>
		public OnlineStoreDatabase dbConnection
		{
			get { return _context; }
		}

		/// <summary>
		/// Session property
		/// </summary>
		public IClientSessionHandle Session
		{
			get { return _session; }
		}

		/// <summary>
		/// Transaction Start Date & Time
		/// </summary>
		public DateTime TransactionStartDateTime
		{
			get { return _transactionStartDateTime; }
		}

		/// <summary>
		/// Open Connection
		/// </summary>
		public void OpenConnection()
		{
			Settings options = new Settings();
			options.ConnectionString = "mongodb://localhost:27017/?safe=true&connect=replicaset";
			options.Database = "OnlineStore";

			_context = new OnlineStoreDatabase(options);
			_mongoClient = _context.GetMongoClient();

		}

		/// <summary>
		/// Close Connection
		/// </summary>
		public void CloseConnection()
		{
			_context = null;
		}

		#region IDisposable Support
		private bool disposedValue = false; // To detect redundant calls

		protected virtual void Dispose(bool disposing)
		{
			if (!disposedValue)
			{
				if (disposing)
				{
					// TODO: dispose managed state (managed objects).
				}

				// TODO: free unmanaged resources (unmanaged objects) and override a finalizer below.
				// TODO: set large fields to null.

				disposedValue = true;
			}
		}

		// TODO: override a finalizer only if Dispose(bool disposing) above has code to free unmanaged resources.
		// ~EntityFrameworkRepository() {
		//   // Do not change this code. Put cleanup code in Dispose(bool disposing) above.
		//   Dispose(false);
		// }

		// This code added to correctly implement the disposable pattern.
		public void Dispose()
		{
			// Do not change this code. Put cleanup code in Dispose(bool disposing) above.
			Dispose(true);
			// TODO: uncomment the following line if the finalizer is overridden above.
			// GC.SuppressFinalize(this);
		}
		#endregion
	}

}
