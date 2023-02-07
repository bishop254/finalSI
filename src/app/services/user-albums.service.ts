import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserAlbumsService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    return this.http.get('https://jsonplaceholder.typicode.com/users').pipe(
      map((resp) => {
        if (resp) {
          // console.log(resp, 'users');
          localStorage.setItem('users', JSON.stringify(resp));
          return resp;
        }
        throw new Error('Could not load data');
      })
    );
  }

  getUserAlbums(id: string | number): Observable<any> {
    return this.http
      .get(`https://jsonplaceholder.typicode.com/users/${id.toString()}/albums`)
      .pipe(
        map((resp) => {
          if (resp) {
            console.log(resp, 'albums');
            return { albums: resp, count: (resp as unknown as []).length };
          }
          throw new Error('Could not load data');
        })
      );
  }

  getAlbumPhotos(id: string | number): Observable<any> {
    return this.http
      .get(
        `https://jsonplaceholder.typicode.com/albums/${id.toString()}/photos`
      )
      .pipe(
        map((resp) => {
          if (resp) {
            console.log(resp, 'albumPhotos');
            return resp;
          }
          throw new Error('Could not load data');
        })
      );
  }
}
