import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment';

/**
 * This service acts like a client for the API of this application, for regular https requests to other APIs please
 * use a regular axios instance or Angular's own http service
 */
@Injectable()
export class ApiClientService {

  public http: AxiosInstance;

  constructor() {
    this.http = axios.create({
      baseURL: environment.API_URL
    });
  }
}