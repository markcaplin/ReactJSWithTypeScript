import { ResponseModel } from "../viewmodels/response.model";
import { startProcessing, stopProcessing } from "../store/actions";

import axios from "axios";
import store from "../store/reduxStoreInstance";

export class HttpService {
  private urlRoot: string;

  constructor() {
    this.urlRoot = "https://localhost:44340/api/secureonlinestore";
  }

  login(requestData: any): any {
    return this.httpPost("/login", requestData);
  }

  register(requestData: any): any {
    return this.httpPost("/register", requestData);
  }

  getProducts(requestData: any): any {
    return this.httpPost("/productinquiry", requestData);
  }

  createOrder(requestData: any): any {
    return this.httpPost("/createOrder", requestData);
  }

  getOrders(): any {
    return this.httpGet("/GetOrders");
  }

  getProductDetail(productId: string): any {
    return this.httpGet("/getproductdetail/" + productId);
  }

  validateEmailAddress(emailAddress: string): any {
    return this.httpGet("/ValidateEmailAddress/" + emailAddress);
  }

  httpGet(urlPath: string): any {
    store.dispatch(startProcessing());
    let url: string = this.urlRoot + urlPath;
    return axios
      .get(url)
      .then(response => {
        store.dispatch(stopProcessing());
        return response.data;
      })
      .catch((error: any) => {
        let response: ResponseModel = new ResponseModel();
        response.returnStatus = false;
        if (error.response) {
          if (error.response.status === 401) {
            response.returnMessage.push("Unauthorized");
          } else {
            response.returnMessage.push(error.response.data.returnMessage[0]);
          }
        } else {
          response.returnMessage.push(error);
        }
        store.dispatch(stopProcessing());
        return response;
      });
  }

  httpPost(urlPath: string, requestData: any): any {
    store.dispatch(startProcessing());
    let url: string = this.urlRoot + urlPath;
    return axios
      .post(url, requestData)
      .then(response => {
        store.dispatch(stopProcessing());
        return response.data;
      })
      .catch((error: any) => {
        let response: ResponseModel = new ResponseModel();
        response.returnStatus = false;
        if (error.response) {
          if (error.response.status === 401) {
            response.returnMessage.push("Unauthorized");
          } else {
            response.returnMessage.push(error.response.data.returnMessage[0]);
          }
        } else {
          response.returnMessage.push(error);
        }
        store.dispatch(stopProcessing());
        return response;
      });
  }
}

export default new HttpService();
