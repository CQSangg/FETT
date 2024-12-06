import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Classes {
  classID?: number;
  classCode?: string;
  className?: string;
  session?: string;
  createDate?: Date;
  updateDate?: Date;
  isDelete?: boolean;
  subjectsID?: number;

}


@Injectable({
  providedIn: 'root'
})
export class ClassesService {
  private apiUrl = 'http://localhost:5183/api/Class'

  constructor(private http: HttpClient) { }

  getAllClasses(): Observable<Classes[]> {
    return this.http.get<Classes[]>(`${this.apiUrl}/GetAllClasses`);
  }

  // Lấy Class theo ID
  getClassById(id: number): Observable<Classes> {
    return this.http.get<Classes>(`${this.apiUrl}/GetClassById/${id}`);
  }

  // Thêm mới một Class
  createClass(classes: Classes): Observable<Classes> {
    return this.http.post<Classes>(`${this.apiUrl}/CreateClassAsync`, classes);
  }

  // Cập nhật một Class
  updateClass(id: number, classes: Classes): Observable<Classes> {
    return this.http.put<Classes>(`${this.apiUrl}/UpdateClassAsync/${id}`, classes);
  }

  // Xóa một Class
  deleteClass(id: number | undefined): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Delete?id=${id}`,{ responseType: 'text' as 'json' });
  }
}
