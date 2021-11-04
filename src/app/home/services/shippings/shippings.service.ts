import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { IKey } from '@home/models/key';

@Injectable({
  providedIn: 'root'
})
export class ShippingsService {
  private url: string;

  constructor(
    private http: HttpClient,
  ) {
    this.url = environment.httpUrl
  }

  sendImage(key: string, idN: number | string, formData: FormData) {
    return this.http.put<{ data: IKey }>(`${this.url}/image/${key}/${idN}`, formData);
  }
}
