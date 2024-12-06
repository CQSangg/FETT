import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Subjects {
  subjectsID?: number;
  subjectsCode?: string;
  subjectsName?: string;
  createDate?: Date;
  updateDate?: Date;
  isDelete?: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class SubjectsService {
  private apiUrl = 'http://localhost:5183/api/Subject'

  constructor(private http: HttpClient) { }

  getAll(): Observable<Subjects[]> {
    return this.http.get<Subjects[]>(`${this.apiUrl}/GetAll`);
  }

  // Lấy subject theo ID
  getSubjectById(id: number): Observable<Subjects> {
    return this.http.get<Subjects>(`${this.apiUrl}/GetById/${id}`);
  }

  getSubjectByName(name: string): Observable<Subjects[]> {
    return this.http.get<Subjects[]>(`${this.apiUrl}/FindByName?name=${name}`);
  }

  // Thêm mới một subject
  createSubject(subject: Subjects): Observable<Subjects> {
    return this.http.post<Subjects>(`${this.apiUrl}/CreateSubject`, subject);
  }

  // Cập nhật một subject
  updateSubject(id: number, subject: Subjects): Observable<Subjects> {
    return this.http.put<Subjects>(`${this.apiUrl}/UpdateSubject/${id}`, subject);
  }

  // Xóa một subject
  deleteSubject(id: number | undefined): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Delete?id=${id}`,{ responseType: 'text' as 'json' });
  }
}
