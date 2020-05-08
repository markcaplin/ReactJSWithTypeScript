using CodeProject.Mongo.Interfaces;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json;
using System.Threading.Tasks;
using CodeProject.Mongo.Data.Models.Entities;

namespace CodeProject.Mongo.Business.Service
{
	/// <summary>
	/// Change Tracking
	/// </summary>
	/// <typeparam name="T"></typeparam>
	public class ChangeTracking<T>
	{
		private readonly IOnlineStoreDataService _onlineStoreDataService;

		private List<string> _updatedEnties;
		private List<string> _newEntities;
		private Hashtable _existingEnties;
		private Hashtable _locks;

		/// <summary>
		/// Constructor
		/// </summary>
		/// <param name="onlineStoreDataService"></param>
		public ChangeTracking(IOnlineStoreDataService onlineStoreDataService)
		{
			_onlineStoreDataService = onlineStoreDataService;
			_updatedEnties = new List<string>();
			_newEntities = new List<string>();
			_existingEnties = new Hashtable();
			_locks = new Hashtable();
		}

		/// <summary>
		/// Locked Row
		/// </summary>
		/// <param name="keyValue"></param>
		public void LockedRow(string table, string keyValue)
		{
			if (_locks.ContainsKey(keyValue)==false)
			{
				_locks.Add(keyValue, table);
			}
		}

		/// <summary>
		/// Unlock Rows
		/// </summary>
		/// <param name="locks"></param>
		private async Task UnlockRows()
		{
			foreach (DictionaryEntry lockedRow in _locks)
			{
				string table = lockedRow.Value.ToString();
				string entityId = lockedRow.Key.ToString();
				await _onlineStoreDataService.UnLockRow(table, entityId);
			}
		}

		/// <summary>
		/// Unlock Rows
		/// </summary>
		/// <returns></returns>
		public async Task CommitChanges()
		{
			await UnlockRows();
		}

		/// <summary>
		/// Newly Added Entities
		/// </summary>
		/// <param name="entity"></param>
		public void NewEntityAdded(T entity)
		{
			string originalImage = JsonConvert.SerializeObject(entity);
			_newEntities.Add(originalImage);
		}

		/// <summary>
		/// Newly Added Entities
		/// </summary>
		/// <param name="entity"></param>
		public void EntityBeforeImage(T entity)
		{
			
			string originalImage = JsonConvert.SerializeObject(entity);
			if (_existingEnties.ContainsKey(originalImage) ==false) {
				_existingEnties.Add(originalImage, null);
				_updatedEnties.Add(originalImage);
			}
			
		}

		/// <summary>
		/// Rollback Changes
		/// </summary>
		/// <returns></returns>
		public async Task RollbackChanges()
		{
			foreach(string entity in _newEntities)
			{
				T originalEntity = JsonConvert.DeserializeObject<T>(entity);
				await DeleteEntity(originalEntity);
			}

			foreach (string entity in _updatedEnties)
			{
				T originalEntity = JsonConvert.DeserializeObject<T>(entity);
				await RollbackEntity(originalEntity);
			}

			await UnlockRows();

		}

		/// <summary>
		/// Delete Entity
		/// </summary>
		/// <param name="entity"></param>
		/// <returns></returns>
		private async Task DeleteEntity(T entity)
		{

			if (entity is Product)
			{
				Product product = (Product)Convert.ChangeType(entity, typeof(Product));
				await _onlineStoreDataService.DeleteProduct(product);
			}
			else if (entity is Order)
			{
				Order order = (Order)Convert.ChangeType(entity, typeof(Order));
				await _onlineStoreDataService.DeleteOrder(order);
			}
		}

		/// <summary>
		/// Rollback Entity
		/// </summary>
		/// <param name="entity"></param>
		/// <returns></returns>
		private async Task RollbackEntity(T entity)
		{
		;
			if (entity is Product)
			{
				Product product = (Product)Convert.ChangeType(entity, typeof(Product));
				await _onlineStoreDataService.UpdateProduct(product);

			}
			else if (entity is Order)
			{
				Order order = (Order)Convert.ChangeType(entity, typeof(Order));
				await _onlineStoreDataService.UpdateOrder(order);
			}
		}
	
	}
}
