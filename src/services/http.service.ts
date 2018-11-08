import {Injectable, EventEmitter} from '@angular/core';
import {Config} from '../config.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

let CACHE = {};

@Injectable()
export class HttpService {

  // EvenEmitter for online/offline
  public networkStatus = new EventEmitter<boolean>();
  // Shows if user has network or not
  private _isOnline: boolean;

  constructor(private _http: HttpClient, private config: Config) {
    HttpService.loadCache();
    this.listenOnlineOffline();
  }

  /**
   * Create event listener for oniline/offline network state
   */
  public listenOnlineOffline() {
    // console.log(navigator);
    this.updateNetworkStatus(navigator.onLine);
    document.addEventListener('online',  () => this.updateNetworkStatus(true), false);
    document.addEventListener('offline',  () => this.updateNetworkStatus(false), false);
  }

  /**
   * Update network status
   * @param {boolean} isOnline
   */
  private updateNetworkStatus(isOnline: boolean) {
    this._isOnline = isOnline;
    this.networkStatus.emit(isOnline);
  }

  get isOnline(): boolean {
    return this._isOnline;
  }

  set isOnline(value: boolean) {
    this._isOnline = value;
  }

  /**
   * Make GET request
   * @param {string} url Request URL
   * @param {object} [params] Request parameters
   * @param {object} [headers] Request headers
   * @param {object} [options] Request options
   * @returns {Promise<any>}
   */
  public get(url: string, params?: any, headers?: any, options?: any): Promise<any> {
    return this.request(url, params, headers, 'get', null, options);
  }

  /**
   * Make POST request
   * @param {string} url Request URL
   * @param {object} body Request body
   * @param {object} [headers] Request headers
   * @param {object} [params] Request parameters
   * @returns {Promise<any>}
   */
  public post(url: string, body: any, headers?: any, params?: any): Promise<any> {
    // return this.request(url, headers, params, 'post', body);
    return this._http.post(url, body).toPromise();
  }

  /**
   * Make DELETE request
   * @param {string} url Request URL
   * @param {object} [params] Request parameters
   * @param {object} [headers] Request headers
   * @returns {Promise<any>}
   */
  public del(url: string, params?: any, headers?: any): Promise<any> {
    // return this.request(url, params, headers, 'delete');
    return this._http.delete(url).toPromise();
  }

  /**
   * Creates request headers
   * @param {object|boolean} [headers] Request headers.
   * False to make request without ANY header.
   * Use 'preventDefault: true' in headers object, to prevent adding default headers, only custom will be used
   * @returns {HttpHeaders} Request headers
   */
  private getHeaders(headers?: any): HttpHeaders {
    if (headers === false) {
      return;
    }

    // Prevent adding default values to headers
    if (headers && headers.preventDefault) {
      const h = Object.assign({}, headers);
      delete h.preventDefault;
      return new HttpHeaders(h);
    }

    // Extend with default headers
    const h = Object.assign({}, this.config.backend.headers, headers || {});

    return new HttpHeaders(h);
  }

  /**
   * Create request parameters
   * @param {any} params Parameters
   * @returns {object} Request parameters
   */
  private getParams(params?: any) {
    return Object.assign({}, this.config.backend.params, params || {});
  }

  /**
   * Get request URL
   * @param {string} url Url
   * @returns {string} Resulting url
   */
  private getUrl(url: string): string {
    const u = url.toLowerCase();
    // Don't append API url if url is absolute
    if (u.includes('http://') || u.includes('https://')) {
      return url;
    }
    return this.config.backend.host + url;
  }

  /**
   * @param {string} url Url, where we're sending request e.g. '/items/search'
   * @param {any} [headers] Custom headers e.g. {tenant: 'porsche0000000'}
   * @param {any} [params] Custom parameters e.g. {models: 'http://virtualpromoter.com/schemas/porsche/employee.json'}
   * @param {any} [body] Body for POST request
   * @param {string} [method] Request type (get/post/delete)
   * @param {object} [options] Request options
   */
  private request(url: string, params?: any, headers?: any, method: string = 'get', body?: any, options?: any): Promise<any> {
    const u = this.getUrl(url);

    // Build options for request
    let opt = {
      headers: this.getHeaders(headers),
      params: this.getParams(params)
    };
    opt = Object.assign(opt, options || {});

    let result;

    // Return cached data if offline
    if (!navigator.onLine) {
      if (method === 'get') {
        const cachedResponse = HttpService.getFromCache(url, params, headers, method, body);
        if (!cachedResponse) {
          console.log('offline');
          return Promise.reject(false);
        }
        return new Promise<any>((res, rej) => {
          res(cachedResponse);
        });
      } else {
        console.log('offline');
        return Promise.reject(false);
      }
    }

    // Make request
    switch (method) {
      case 'get':
        result = this._http.get(u, opt).toPromise();
        break;
      case 'post':
        result = this._http.post(u, body, opt).toPromise();
        break;
      case 'delete':
        result = this._http.delete(u, opt).toPromise();
        break;
    }

    // Store response in cache
    result.then(data => {
      HttpService.putToCache(data, url, params, headers, method, body);
    }, (err) => {
      console.log('http service error', err)
    });

    return result;
  }

  /**
   * Returns string key for request parameters
   */
  private static getCacheKey(url: string, params?: any, headers?: any, method?: any, body?: any, options?: any) {
    const p = JSON.stringify(params) || '_';
    const h = JSON.stringify(headers) || '_';
    const m = JSON.stringify(method) || 'get';
    const b = JSON.stringify(method) || '_';
    const o = JSON.stringify(options) || '_';
    return `${url}.${p}.${h}.${m}.${b}.${o}`;
  }

  /**
   * Puts response data to a cache
   */
  private static putToCache(data: any, url: string, params?: any, headers?: any, method?: any, body?: any, options?: any) {
    const key = HttpService.getCacheKey(url, params, headers, method, body, options);
    CACHE[key] = data;
    HttpService.saveCache();
  }

  /**
   * Gets data from cache
   */
  private static getFromCache(url: string, params?: any, headers?: any, method?: any, body?: any, options?: any) {
    const key = HttpService.getCacheKey(url, params, headers, method, body, options);
    return CACHE[key];
  }

  /**
   * Saves cache to storage
   */
  private static saveCache() {
    localStorage.setItem('nevills-cache', JSON.stringify(CACHE));
  }

  /**
   * Loads cache from storage
   */
  private static loadCache() {
    const c = localStorage.getItem('nevills-cache');
    if (c) {
      try {
        CACHE = JSON.parse(c);
      } catch {
        CACHE = {};
      }
    }
  }
}
