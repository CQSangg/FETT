import { Component, OnInit } from '@angular/core';
import { ExamService } from '../../service/exam.service';  // Đảm bảo đường dẫn đúng
import { FormsModule } from '@angular/forms';
import {NgIf, NgForOf, DatePipe} from '@angular/common';
import {QuestionTypeService} from '../../service/question.service';

@Component({
  selector: 'app-questiontype',
  templateUrl: './questiontype.component.html',
  standalone: true,
  imports: [FormsModule, NgIf, NgForOf, DatePipe],
  styleUrls: ['./questiontype.component.css']
})
export class QuestiontypeComponent implements OnInit {
  data: any[] = [];  // Dữ liệu bài thi
  subjects: any[] = [];  // Dữ liệu môn học
  examForm: any = {};  // Dữ liệu form cho bài thi
  question: any = {};
  isModalOpen: boolean = false;  // Điều khiển trạng thái modal

  constructor(private questionService: QuestionTypeService) {}

  // Hàm để mở modal và reset form
  showModal(question?: any) {
    if (question) {
      // Nếu có đối tượng bài thi (edit), gán vào examForm
      this.question = { ...question };  // Sao chép dữ liệu của bài thi để chỉnh sửa
    } else {
      // Nếu không có, tạo mới form
      this.question = {
        QuestionTypeCode: '',
        QuestionTypeName: '',
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
  saveQuestion() {
    if (!this.question.QuestionTypeCode || !this.question.QuestionTypeName ) {
      console.error('Các trường bắt buộc chưa được điền đầy đủ');
      return; // Dừng lại nếu có trường bắt buộc thiếu
    }

    // Chuyển TestID thành số nếu cần

    console.log('Dữ liệu gửi đi:', this.question);

    if (this.question.QuestionTypeID) {
      // Cập nhật bài thi
      this.questionService.updateQuestion(this.question).subscribe(
        (response) => {
          console.log('Cập nhật bài thi thành công:', response);
          this.loadData();
          this.closeModal();
        },
        (error) => {
          console.error('Lỗi khi cập nhật loại câu hỏi:', error);
        }
      );
    } else {
      // Thêm mới bài thi
      this.questionService.createQuestion(this.question).subscribe(
        (response) => {
          console.log('Thêm mới loại câu hỏi thành công:', response);
          alert('Thêm mới loại câu hỏi thành công');
          this.loadData();
          this.closeModal();
        },
        (error) => {
          console.error('Lỗi khi thêm mới loại câu hỏi:', error);
          alert('Lỗi khi thêm mới loại câu hỏi');
        }
      );
    }
  }

  // Hàm tải lại danh sách dữ liệu
  loadData() {
    this.questionService.getQuestion().subscribe(
      (data) => {
        this.data = data;
      },
      (error) => {
        console.error('Lỗi khi tải dữ liệu:', error);
      }
    );
  }

  // Hàm để xóa bài thi
  deleteQuestion(QuestionTypeID: number) {
    this.questionService.deleteQuestion(QuestionTypeID).subscribe(
      (response) => {
        console.log('Xóa loại câu hỏi thành công:', response);
        alert('Xoá loại câu hỏi thành công');
        this.loadData();  // Tải lại danh sách dữ liệu
      },
      (error) => {
        console.error('Lỗi khi xóa loại câu hỏi:', error);
      }
    );
  }

  // Hàm để lấy danh sách môn học
  getSubjects() {
    this.questionService.getSubjects().subscribe(
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
