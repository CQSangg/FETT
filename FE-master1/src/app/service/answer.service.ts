import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})

export class AnswerService {
  private apiUrl = 'http://localhost:5183/api/Answer';  // Adjust the URL to your backend
  private apiUrlQuestion = 'http://localhost:5183/api/Question';
  constructor(private http: HttpClient) { }
  //Các phương thức khác

  // Lấy tất cả answer
  getAllAnwser(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/GetAllAnswers`);  // Đổi endpoint thành /getExem
  }

  // Get answer by ID
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetAnswerById/${id}`);
  }

  // Add a new answer
  createAnswer(answer: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/AddAnswer`, answer);
  }

  // Update an existing answer
  updateAnswer(answerForm: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/UpdateAnswer/${answerForm.answerID}`, answerForm);
  }

  // Delete an answer
  deleteAnswer(answerID: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteAnswer/${answerID}`);
  }

  // Hàm lấy danh sách Câu hỏi
  getQuestions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlQuestion}/GetAllQuestions`);
  }
}
