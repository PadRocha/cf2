import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { IKeyInfo, IPaginate } from '../../models/metadata';
import { ILine } from '../../models/line';
import { IKey } from '@home/models/key';

@Injectable({
  providedIn: 'root'
})
export class ArrivalsService {
  private url: string;

  constructor(
    private http: HttpClient,
  ) {
    this.url = environment.httpUrl;
  }

  getLines(params: { page?: number; regex?: string; count?: 'key'; } = {}) {
    return this.http.get<{ data: ILine[]; metadata: IPaginate; }>(`${this.url}/line`, { params, withCredentials: false });
  }

  getLineById(params: { id: string; count?: 'key'; }) {
    return this.http.get<{ data: ILine; }>(`${this.url}/line`, { params, withCredentials: false });
  }

  getKeys(params = {}) {
    return this.http.get<{ data: IKey[]; metadata: IPaginate; }>(`${this.url}/key`, { params, withCredentials: false });
  }
}
