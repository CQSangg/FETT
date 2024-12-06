import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  private apiUrl = 'http://localhost:3000';  // URL API backend

  constructor(private http: HttpClient) {}

  // Lấy tất cả bài kiểm tra
  getTests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getData`);
  }

  // Thêm bài kiểm tra mới
  createTest(test: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/createData`, test);
  }

  // Xóa bài kiểm tra
  deleteTest(testID: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteData/${testID}`);
  }

  // Lấy danh sách môn học
  getSubjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getSubjects`);
  }

  // Cập nhật bài kiểm tra
  updateTest(testForm: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/updateData/${testForm.TestID}`, testForm);
  }
}
