using System;
using System.Collections.Generic;
using System.Collections;
using System.Text;
using CodeProject.Mongo.Interfaces;
using System.Linq;
using Newtonsoft.Json;
using System.Threading.Tasks;
using CodeProject.Mongo.Data.Models.Entities;
using MongoDB.Driver;

namespace CodeProject.Mongo.Business.Service
{
	public class PessimisticLocking
	{
		private readonly IOnlineStoreDataService _onlineStoreDataService;
		private Hashtable _locks;

		/// <summary>
		/// Constructor
		/// </summary>
		/// <param name="onlineStoreDataService"></param>
		public PessimisticLocking(IOnlineStoreDataService onlineStoreDataService)
		{
			_onlineStoreDataService = onlineStoreDataService;
			_locks = new Hashtable();
		}

		/// <summary>
		/// Acquire Lock
		/// </summary>
		/// <param name="table"></param>
		/// <param name="entityId"></param>
		/// <returns></returns>
		public async Task AcquireLock(string table, string entityId)
		{
			Boolean returnStatus = await _onlineStoreDataService.AcquireLock(table, entityId);
			if (returnStatus==true)
			{
				LockedRow(table, entityId);
			}
			else
			{
				throw new Exception("Unable to process order. Please retry later.");
			}
			
		}

		/// <summary>
		/// Locked Row
		/// </summary>
		/// <param name="keyValue"></param>
		public void LockedRow(string table, string keyValue)
		{
			if (_locks.ContainsKey(keyValue) == false)
			{
				_locks.Add(keyValue, table);
			}
		}

		/// <summary>
		/// Unlock Rows
		/// </summary>
		/// <param name="locks"></param>
		public async Task UnlockRows()
		{
			foreach (DictionaryEntry lockedRow in _locks)
			{
				string table = lockedRow.Value.ToString();
				string entityId = lockedRow.Key.ToString();
				await _onlineStoreDataService.UnLockRow(table, entityId);
			}
			_locks = new Hashtable();
		}

	}
}
