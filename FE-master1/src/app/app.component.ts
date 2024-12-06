import { Component, OnInit } from '@angular/core';
import { ExamService } from './service/exam.service'; // Import ExamService
import { MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  data: any;  // Biến lưu trữ dữ liệu trả về từ API

  constructor(
    private testService: ExamService,
    private dialog: MatDialog,

  ) {}

  ngOnInit(): void {
    this.loadData();  // Gọi phương thức loadData khi component khởi tạo
  }

  // Phương thức gọi API và lưu dữ liệu
  loadData(): void {
    this.testService.getExams().subscribe(
      (response: any) => {
        this.data = response;  // Lưu dữ liệu vào biến 'data'
        console.log('Dữ liệu từ API:', this.data);
      },
      (error: any) => {
        console.error('Lỗi khi gọi API:', error);
      }
    );
  }


  title = () => {

  }
}
