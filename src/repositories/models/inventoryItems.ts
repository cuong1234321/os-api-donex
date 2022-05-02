
import AuthInterface from '@repositories/interfaces/auth';
import axios, { AxiosRequestConfig } from 'axios';

class InventoryItem {
  public static async index (authorization: AuthInterface,
    params: {
      page: number,
      limit: number,
      orderBy: string,
      sortBy: string,
      includeInventory: boolean,
      cateId: string,
      dateFrom: Date,
      includeInActive: boolean
    },
  ) {
    try {
      const requestConfigs: AxiosRequestConfig = {
        method: 'POST',
        url: `${process.env.MISA_ENDPOINT}/${authorization.Environment}/api/v1/inventoryitems/pagingwithdetail`,
        headers: {
          CompanyCode: authorization.CompanyCode,
          Authorization: 'Bearer ' + authorization.AccessToken,
        },
        data: {
          Page: params.page,
          Limit: params.limit,
          SortField: params.orderBy,
          SortType: params.sortBy === 'ASC' ? 1 : 2,
          IncludeInventory: params.includeInventory,
          InventoryItemCategoryID: params.cateId,
          LastSyncDate: params.dateFrom || null,
          IncludeInActive: params.includeInActive,
        },
      };
      const result = await axios(requestConfigs);
      const auth = result.data;
      return auth;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  public static async show (authorization: AuthInterface, inventoryItemId: number) {
    try {
      const requestConfigs: AxiosRequestConfig = {
        method: 'GET',
        url: `${process.env.MISA_ENDPOINT}/${authorization.Environment}/api/v1/inventoryitems/detail/${inventoryItemId}`,
        headers: {
          CompanyCode: authorization.CompanyCode,
          Authorization: 'Bearer ' + authorization.AccessToken,
        },
      };
      const result = await axios(requestConfigs);
      const auth = result.data;
      return auth;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  public static async pagingByCode (authorization: AuthInterface, params: {
    page: number,
    limit: number,
    orderBy: string,
    sortBy: string,
    codeSearch: string,
    includeInActive: boolean
  }) {
    try {
      const requestConfigs: AxiosRequestConfig = {
        method: 'GET',
        url: `${process.env.MISA_ENDPOINT}/${authorization.Environment}/api/v1/inventoryitems/pagingbycode`,
        headers: {
          CompanyCode: authorization.CompanyCode,
          Authorization: 'Bearer ' + authorization.AccessToken,
        },
        data: {
          Page: params.page,
          Limit: params.limit,
          SortField: params.orderBy,
          SortType: params.sortBy === 'ASC' ? 1 : 2,
          CodeSearch: params.codeSearch,
          IncludeInActive: params.includeInActive,
        },
      };
      const result = await axios(requestConfigs);
      const auth = result.data;
      return auth;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default InventoryItem;
