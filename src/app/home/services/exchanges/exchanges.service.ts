import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { IKey } from '../../models/key';

@Injectable({
  providedIn: 'root'
})
export class ExchangesService {
  private url: string;
  private headersJSON: HttpHeaders;

  constructor(
    private http: HttpClient,
  ) {
    this.url = environment.httpUrl
    this.headersJSON = new HttpHeaders().set('Content-Type', 'application/json');
  }

  updateStatus(key: string, idN: number | string, body: { status?: number } = {}) {
    return this.http.put<{ data: IKey }>(`${this.url}/status/${key}/${idN}`, body, { headers: this.headersJSON })
  }

  deleteImage(key: string, idN: number | string) {
    return this.http.delete<{ data: IKey }>(`${this.url}/image/${key}/${idN}`)
  }

  deleteKey(_id: string) {
    return this.http.delete<{ data: IKey }>(`${this.url}/key`, { params: { id: _id } })
  }

  updateKey(_id: string, body: IKey) {
    return this.http.put<{ data: IKey }>(`${this.url}/key`, body, { params: { id: _id }, headers: this.headersJSON });
  }

  resetKey(_id: string, body: { status?: number } = {}) {
    return this.http.put<{ data: IKey }>(`${this.url}/key/reset`, body, { params: { id: _id }, headers: this.headersJSON });
  }
}
