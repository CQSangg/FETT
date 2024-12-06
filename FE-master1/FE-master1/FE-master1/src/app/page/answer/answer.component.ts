import { Component, OnInit } from '@angular/core';
import { AnswerService } from '../../service/answer.service';  // Đảm bảo đường dẫn đúng
import { FormsModule } from '@angular/forms';
import { NgIf, NgForOf } from '@angular/common';

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  standalone: true,
  imports: [FormsModule, NgIf, NgForOf],
  styleUrls: ['./answer.component.css']
})
export class AnswerComponent implements OnInit {
  data: any[] = [];  // Dữ liệu bài thi
  questions: any[] = [];  // Dữ liệu môn học
  answerForm: any = {};  // Dữ liệu form cho bài thi
  isModalOpen: boolean = false;  // Điều khiển trạng thái modal

  constructor(private answerService: AnswerService) {}

  // Hàm để mở modal và reset form
  showModal(answer?: any) {
    if (answer) {
      // Nếu có đối tượng bài thi (edit), gán vào examForm
      this.answerForm = { ...answer };  // Sao chép dữ liệu của bài thi để chỉnh sửa
    } else {
      // Nếu không có, tạo mới form
      this.answerForm = {
        answerCode: '',
        answerName: '',
        answerTextContent: '',
        answerImgContent: null,
        questionID: null,
      };
    }
    this.isModalOpen = true;
  }

  ngOnInit(): void {
    this.loadData();  // Tải dữ liệu bài thi
    this.getQuestions();  // Tải danh sách môn học
  }

  // Hàm để đóng modal
  closeModal() {
    this.isModalOpen = false;
  }

  // Hàm để lưu bài thi
  saveAnswer() {
    // if (!this.answerForm.answerCode || !this.answerForm.answerName || !this.answerForm.answerTextContent || !this.answerForm.answerImgContent || !this.answerForm.questionID) {
    //   alert('Các trường bắt buộc chưa được điền đầy đủ');
    //   return; // Dừng lại nếu có trường bắt buộc thiếu
    // }
    console.log('Dữ liệu gửi đi:', this.answerForm);

    if (this.answerForm.answerID != undefined) {
      this.answerService.updateAnswer(this.answerForm).subscribe(
        (response) => {
          console.log('Cập nhật câu trả lời thành công:', response);
          alert('Cập nhật câu trả lời thành công');
          this.loadData();
          this.closeModal();
        },
        (error) => {
          console.error('Lỗi khi cập nhật câu trả lời:', error);
          alert('Lỗi khi cập nhật câu trả lời ');
        }
      );
    } else {
      // Thêm mới bài thi
      this.answerService.createAnswer(this.answerForm).subscribe(
        (response) => {
          console.log('Thêm mới câu trả lời thành công:', response);
          alert('Thêm câu hỏi trả lời thành công');
          this.loadData();
          this.closeModal();
        },
        (error) => {
          console.error('Lỗi khi thêm mới câu trả lời:', error);
          alert('Lỗi khi thêm mới câu trả lời');
        }
      );
    }
  }

  // Hàm tải lại danh sách dữ liệu
  loadData() {
    this.answerService.getAllAnwser().subscribe(
      (data) => {
        this.data = data;
      },
      (error) => {
        console.error('Lỗi khi tải dữ liệu:', error);
      }
    );
  }

  // Hàm để xóa câu hỏi
  deleteAnswer(answerID: number) {

    const confirmed = window.confirm(`Bạn có chắc là xóa câu trả lời ${answerID} này?`);
    if (!confirmed) {
      return; // Do nothing if the user cancels
    }

    this.answerService.deleteAnswer(answerID).subscribe(
      (response) => {
        console.log('Xóa câu trả lời thành công:', response);
        alert('Xoá câu trả lời thành công thành công');
        this.loadData();  // Tải lại danh sách dữ liệu
      },
      (error) => {
        console.error('Lỗi khi xóa câu trả lời:', error);
        alert(' Lỗi khi xoá câu trả lời ');
      }
    );
  }

  // Hàm để lấy danh sách môn học
  getQuestions() {
    this.answerService.getQuestions().subscribe(
      (data) => {
        this.questions = data;
      },
      (error) => {
        console.error('Lỗi khi lấy câu hỏi:', error);
      }
    );
  }

  protected readonly Number = Number;
  protected readonly parseInt = parseInt;
}

