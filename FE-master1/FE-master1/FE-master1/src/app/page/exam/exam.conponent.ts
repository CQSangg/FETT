import { Component, OnInit } from '@angular/core';
import { ExamService } from '../../service/exam.service';  // Đảm bảo đường dẫn đúng
import { FormsModule } from '@angular/forms';
import {NgIf, NgForOf, CommonModule} from '@angular/common';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  standalone: true,
  imports: [FormsModule, NgIf, NgForOf,CommonModule],
  styleUrls: ['./exam.component.css']
})
export class ExamComponent implements OnInit {
  data: any[] = [];  // Dữ liệu bài thi
  subjects: any[] = [];  // Dữ liệu môn học
  examForm: any = {};  // Dữ liệu form cho bài thi
  isModalOpen: boolean = false;  // Điều khiển trạng thái modal

  constructor(private examService: ExamService) {}

  // Hàm để mở modal và reset form
  showModal(exam?: any) {
    if (exam) {
      // Nếu có đối tượng bài thi (edit), gán vào examForm
      this.examForm = { ...exam };  // Sao chép dữ liệu của bài thi để chỉnh sửa
    } else {
      // Nếu không có, tạo mới form
      this.examForm = {
        ExamCode: '',
        ExamName: '',
        ExamDate: '',
        Duration: 0,
        NumberOfQuestions: 0,
        TotalMarks: 0,
        TestID: null
      };
    }
    this.isModalOpen = true;
  }

  ngOnInit(): void {
    this.loadData();  // Tải dữ liệu bài thi
    this.getSubjects();  // Tải danh sách môn học
  }

  // Hàm để đóng modal
  closeModal() {
    this.isModalOpen = false;
  }

  // Hàm để lưu bài thi
  saveExam() {
    if (!this.examForm.ExamCode || !this.examForm.ExamName || !this.examForm.Duration || !this.examForm.NumberOfQuestions || !this.examForm.TestID) {
      console.error('Các trường bắt buộc chưa được điền đầy đủ');
      return; // Dừng lại nếu có trường bắt buộc thiếu
    }

    // Chuyển TestID thành số nếu cần
    this.examForm.TestID = parseInt(this.examForm.TestID, 10);

    console.log('Dữ liệu gửi đi:', this.examForm);

    if (this.examForm.ExamID) {
      // Cập nhật bài thi
      this.examService.updateExam(this.examForm).subscribe(
        (response) => {
          console.log('Cập nhật bài thi thành công:', response);
          alert('Cập nhật bài thi thành công');
          this.loadData();
          this.closeModal();
        },
        (error) => {
          console.error('Lỗi khi cập nhật bài thi:', error);
          alert('Lỗi khi cập nhật bài thi ');
        }
      );
    } else {
      // Thêm mới bài thi
      this.examService.createExam(this.examForm).subscribe(
        (response) => {
          console.log('Thêm mới bài thi thành công:', response);
          alert('Thêm mới bài kiểm tra thành công');
          this.loadData();
          this.closeModal();
        },
        (error) => {
          console.error('Lỗi khi thêm mới bài thi:', error);
          alert('Lỗi khi thêm mới bài thi');
        }
      );
    }
  }

  // Hàm tải lại danh sách dữ liệu
  loadData() {
    this.examService.getExams().subscribe(
      (data) => {
        this.data = data;
      },
      (error) => {
        console.error('Lỗi khi tải dữ liệu:', error);
      }
    );
  }

  // Hàm để xóa bài thi
  deleteExam(examID: number) {
    this.examService.deleteExam(examID).subscribe(
      (response) => {
        console.log('Xóa bài thi thành công:', response);
        alert('Xoá bài thi thành công thành công');
        this.loadData();  // Tải lại danh sách dữ liệu
      },
      (error) => {
        console.error('Lỗi khi xóa bài thi:', error);
        alert(' Lỗi khi xoá bài thi ');
      }
    );
  }

  // Hàm để lấy danh sách môn học
  getSubjects() {
    this.examService.getSubjects().subscribe(
      (data) => {
        this.subjects = data;
      },
      (error) => {
        console.error('Lỗi khi lấy môn học:', error);
      }
    );
  }

  protected readonly Number = Number;
  protected readonly parseInt = parseInt;
}
