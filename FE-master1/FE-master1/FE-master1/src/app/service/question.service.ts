import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class QuestionTypeService {

    private apiUrl = 'http://localhost:3000';  // URL API backend

    constructor(private http: HttpClient) {}

    // Lấy tất cả bài thi
    getQuestion(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/getQuestion`);  // Đổi endpoint thành /getExem
    }

    // Thêm bài thi mới
    createQuestion(question: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/createQuestion`, question);  // Đổi endpoint thành /createExam
    }

    // Xóa bài thi
    deleteQuestion(QuestionTypeID: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/deleteQuestion/${QuestionTypeID}`);  // Đổi endpoint thành /deleteExam
    }

    // Cập nhật bài thi
    updateQuestion(question: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/updateExam/${question.QuestionTypeID}`, question);  // Đổi endpoint thành /updateExam
    }

    // Lấy danh sách môn học
    getSubjects(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/getData`);
    }
}
