import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../service/student.service';  // Đảm bảo đường dẫn đúng
import { FormsModule } from '@angular/forms';
import {NgIf, NgForOf, CommonModule} from '@angular/common';

@Component({
  selector: 'app-page',
  templateUrl: './student.component.html',
  standalone: true,
  imports: [FormsModule,CommonModule, NgIf, NgForOf],
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  students: any[] = [];  // Dữ liệu học viên
  studentForm: any = {};  // Dữ liệu form cho học viên
  isModalOpen: boolean = false;  // Điều khiển trạng thái modal
  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.loadData();  // Tải dữ liệu học viên
  }

  // Hàm để mở modal và reset form
  showModal(student?: any) {
    if (student) {
      // Nếu có đối tượng học viên (edit), gán vào studentForm
      this.studentForm = { ...student };  // Sao chép dữ liệu của học viên để chỉnh sửa
    } else {
      // Nếu không có, tạo mới form
      this.studentForm = {
        StudentID: null,  // Chưa có StudentID khi tạo mới
        StudentCode: '',
        StudentName: '',
        Gender: '',
        NumberPhone: '',
        Address: '',
        BirthdayDate: null,
        Email: '',
      };
    }
    this.isModalOpen = true;
  }

  // Hàm để đóng modal
  closeModal() {
    this.isModalOpen = false;
  }

  // Hàm để lưu học viên
  saveStudent() {
    if (this.studentForm.Gender === null) {
      alert('Giới tính là bắt buộc!');
      return; // Nếu không có giới tính, không tiếp tục
    }

    const studentData = {
      StudentCode: this.studentForm.StudentCode?.trim() || null,
      StudentName: this.studentForm.StudentName?.trim() || null,
      Gender: this.studentForm.Gender !== null ? Number(this.studentForm.Gender) : null,
      NumberPhone: this.studentForm.NumberPhone?.trim() || null,
      Address: this.studentForm.Address?.trim() || null,
      BirthdayDate: this.studentForm.BirthdayDate
        ? new Date(this.studentForm.BirthdayDate).toISOString().split('T')[0]
        : null, // Định dạng YYYY-MM-DD
      Email: this.studentForm.Email?.trim() || null,
    };

    console.log('Student data to be sent:', studentData);

    this.studentService.createStudent(studentData).subscribe(
      (response) => {
        console.log('Thêm mới học sinh thành công', response);
        alert('Thêm mới học sinh thành công');
        this.isModalOpen = false; // Đóng modal
        this.loadData(); // Tải lại danh sách học viên
      },
      (error) => {
        console.error('Error occurred:', error);
        alert('Lỗi khi thêm mới học sinh');
      }
    );
  }




  // Hàm tải lại danh sách dữ liệu
  loadData() {
    this.studentService.getStudents().subscribe(
      (data) => {
        this.students = data;
      },
      (error) => {
        console.error('Lỗi khi tải dữ liệu:', error);
      }
    );
  }

  // Hàm để xóa học viên
  deleteStudent(studentID: number) {
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa học viên này?');
    if (confirmDelete) {
      this.studentService.deleteStudent(studentID).subscribe(
        (response) => {
          console.log('Xóa học viên thành công:', response);
          alert('Xoá học viên thành công');
          this.loadData();  // Tải lại danh sách dữ liệu
        },
        (error) => {
          console.error('Lỗi khi xóa học viên:', error);
          alert('Lỗi khi xoá học viên');
        }
      );
    }
  }
  submit(){
    console.log(this.studentForm);
}
}
