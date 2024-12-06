import { Component, OnInit } from '@angular/core';
import { TestService } from '../../service/test.service';  // Đảm bảo đường dẫn đúng
import { FormsModule } from '@angular/forms';
import {NgIf, NgForOf, DatePipe} from '@angular/common';


@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  standalone: true,
  imports: [FormsModule, NgIf, NgForOf, DatePipe],
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  data: any[] = [];  // Dữ liệu bài kiểm tra
  subjects: any[] = [];  // Dữ liệu môn học
  testForm: any = {};  // Dữ liệu form cho bài kiểm tra
  isModalOpen: boolean = false;  // Điều khiển trạng thái modal

  constructor(private testService: TestService) {}

  // Hàm để mở modal và reset form
  showModal(test?: any) {
    if (test) {
      // Nếu có đối tượng bài kiểm tra (edit), gán vào testForm
      this.testForm = { ...test };  // Sao chép dữ liệu của bài kiểm tra để chỉnh sửa
    } else {
      // Nếu không có, tạo mới form
      this.testForm = {
        TestID: null,  // Chưa có TestID khi tạo mới
        TestCode: '',
        TestName: '',
        NumberOfQuestions: 0,
        SubjectsID: null
      };
    }
    this.isModalOpen = true;
  }
  ngOnInit(): void {
    this.loadData();  // Tải dữ liệu bài kiểm tra
    this.getSubjects();  // Tải danh sách môn học
  }
  // Hàm để đóng modal
  closeModal() {
    this.isModalOpen = false;
  }

  // Hàm để lưu bài kiểm tra
  saveTest() {
    console.log('Dữ liệu gửi đi:', this.testForm);  // Kiểm tra dữ liệu gửi đi

    if (this.testForm.TestID) {
      // Nếu có TestID, thực hiện cập nhật bài kiểm tra (PUT)
      this.testService.updateTest(this.testForm).subscribe(
        (response) => {
          console.log('Cập nhật bài kiểm tra thành công:', response);
          alert('Cập nhật bài kiểm tra thành công');
          this.loadData();  // Tải lại danh sách dữ liệu
          this.closeModal(); // Đóng modal sau khi lưu
        },
        (error) => {
          console.error('Lỗi khi cập nhật bài kiểm tra:', error);
          alert('Lỗi khi cập nhật bài kiểm tra ');
        }
      );
    } else {
      // Nếu không có TestID, thực hiện thêm mới bài kiểm tra (POST)
      this.testService.createTest(this.testForm).subscribe(
        (response) => {
          console.log('Thêm mới bài kiểm tra thành công:', response);
          alert('Thêm mới bài kiểm tra thành công');
          this.loadData();  // Tải lại danh sách dữ liệu
          this.closeModal(); // Đóng modal sau khi lưu
        },
        (error) => {
          console.error('Lỗi khi thêm mới bài kiểm tra:', error);
          alert('Lỗi khi thêm mới bài kiểm tra ');
        }
      );
    }
  }

  // Hàm tải lại danh sách dữ liệu
  loadData() {
    this.testService.getTests().subscribe(
      (data) => {
        this.data = data;
      },
      (error) => {
        console.error('Lỗi khi tải dữ liệu:', error);
      }
    );
  }

  // Hàm để xóa bài kiểm tra
  deleteTest(testID: number) {
    this.testService.deleteTest(testID).subscribe(
      (response) => {
        console.log('Xóa bài kiểm tra thành công:', response);
        alert('Xoá bài kiểm tra thành công');
        this.loadData();  // Tải lại danh sách dữ liệu
      },
      (error) => {
        console.error('Lỗi khi xóa bài kiểm tra:', error);
        alert('Lỗi khi xoá bài kiểm tra');
      }
    );
  }

  // Hàm để lấy danh sách môn học
  getSubjects() {
    this.testService.getSubjects().subscribe(
      (data) => {
        this.subjects = data;
      },
      (error) => {
        console.error('Lỗi khi lấy môn học:', error);
      }
    );
  }
}
