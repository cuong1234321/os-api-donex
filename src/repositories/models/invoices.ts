
import AuthInterface from '@repositories/interfaces/auth';
import axios, { AxiosRequestConfig } from 'axios';

class Invoice {
  public static async create (params: AuthInterface, data: any) {
    try {
      const requestConfigs: AxiosRequestConfig = {
        method: 'POST',
        url: `${process.env.MISA_ENDPOINT}/${params.Environment}/api/v1/invoices/`,
        headers: {
          CompanyCode: params.CompanyCode,
          Authorization: 'Bearer ' + params.AccessToken,
        },
        data,
      };
      const result = await axios(requestConfigs);
      const auth = result.data;
      return auth;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  public static async index (authorization: AuthInterface,
    params: {
      page: number,
      limit: number,
      orderBy?: string,
      sortBy?: string,
      CustomerID?: string,
      branchId?: string,
      fromDate?: string,
      toDate?: string,
      DateRangeType?: number,
    },
  ) {
    try {
      const requestConfigs: AxiosRequestConfig = {
        method: 'POST',
        url: `${process.env.MISA_ENDPOINT}/${authorization.Environment}/api/v1/invoices/pagingbycustomer`,
        headers: {
          CompanyCode: authorization.CompanyCode,
          Authorization: 'Bearer ' + authorization.AccessToken,
        },
        data: params,
      };
      const result = await axios(requestConfigs);
      const auth = result.data;
      return auth;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  public static async byCustomer (authorization: AuthInterface,
    params: {
      userId: string,
      invoiceNumber: string,
      limit: number,
      orderBy: string,
      sortBy: string,
    },
  ) {
    try {
      const requestConfigs: AxiosRequestConfig = {
        method: 'POST',
        url: `${process.env.MISA_ENDPOINT}/${authorization.Environment}/api/v1/invoices/invoicebycustomer`,
        headers: {
          CompanyCode: authorization.CompanyCode,
          Authorization: 'Bearer ' + authorization.AccessToken,
        },
        data: {
          CustomerCode: params.userId,
          InvoiceNumber: params.invoiceNumber,
          Limit: params.limit,
          SortField: params.orderBy,
          SortType: params.sortBy === 'ASC' ? 1 : 2,
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

  public static async show (authorization: AuthInterface,
    params: {
      page: number,
      limit: number,
      orderBy: string,
      sortBy: string,
      userId: boolean,
      branchId: string,
      dateFrom: Date,
      dateTo: Date,
    },
  ) {
    try {
      const requestConfigs: AxiosRequestConfig = {
        method: 'POST',
        url: `${process.env.MISA_ENDPOINT}/${authorization.Environment}/api/v1/invoices/detailbyrefid`,
        headers: {
          CompanyCode: authorization.CompanyCode,
          Authorization: 'Bearer ' + authorization.AccessToken,
        },
        data: {
          Page: params.page,
          Limit: params.limit,
          SortField: params.orderBy,
          SortType: params.sortBy === 'ASC' ? 1 : 2,
          CustomerID: params.userId || null,
          BranchID: params.branchId || null,
          FromDate: params.dateFrom || null,
          ToDate: params.dateTo || null,
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

export default Invoice;
