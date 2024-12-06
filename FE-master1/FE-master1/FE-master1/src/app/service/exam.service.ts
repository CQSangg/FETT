import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExamService {

  private apiUrl = 'http://localhost:3000';  // URL API backend

  constructor(private http: HttpClient) {}

  // Lấy tất cả bài thi
  getExams(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getExem`);  // Đổi endpoint thành /getExem
  }

  // Thêm bài thi mới
  createExam(exam: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/createExam`, exam);  // Đổi endpoint thành /createExam
  }

  // Xóa bài thi
  deleteExam(examID: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteExam/${examID}`);  // Đổi endpoint thành /deleteExam
  }

  // Cập nhật bài thi
  updateExam(examForm: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/updateExam/${examForm.ExamID}`, examForm);  // Đổi endpoint thành /updateExam
  }

  // Lấy danh sách môn học
  getSubjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getData`);
  }
}
