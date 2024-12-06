import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private apiUrl = 'http://localhost:3000'; // URL API backend

  constructor(private http: HttpClient) {}

  // Lấy danh sách sinh viên
  getStudents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getStudents`);
  }

  // Thêm sinh viên mới
  createStudent(student: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/createStudent`, student);
  }

  // Xóa sinh viên
  deleteStudent(studentID: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteStudent/${studentID}`);
  }

  // Cập nhật thông tin sinh viên
  updateStudent(studentForm: any): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/updateStudent/${studentForm.StudentID}`,
      studentForm
    );
  }
}
