using System;

namespace CodeProject.Mongo.Functions
{
	public static class Utilities
	{
		/// <summary>
		/// Calculate Total Pages
		/// </summary>
		/// <param name="numberOfRecords"></param>
		/// <param name="pageSize"></param>
		/// <returns></returns>
		public static int CalculateTotalPages(long numberOfRecords, Int32 pageSize)
		{
			long result;
			int totalPages;

			Math.DivRem(numberOfRecords, pageSize, out result);

			if (result > 0)
				totalPages = (int)((numberOfRecords / pageSize)) + 1;
			else
				totalPages = (int)(numberOfRecords / pageSize);

			return totalPages;

		}

	}
}
