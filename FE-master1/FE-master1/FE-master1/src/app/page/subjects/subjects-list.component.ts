import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubjectsService, Subjects } from '../../service/subjects.service';
import { HttpClientModule } from '@angular/common/http';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Observable, Subject, Subscription} from 'rxjs';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import * as bootstrap from 'bootstrap';

// @ts-ignore

@Component({
  selector: 'app-subjects-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, RouterLink, ReactiveFormsModule],
  templateUrl: './subjects-list.component.html',
  styleUrl: './subjects-list.component.css'
})

export class SubjectsListComponent implements OnInit {
  subjects: Subjects[] = []; // Danh sách Subjects
  isLoading: boolean = true;
  searchName: string | undefined; //Tìm name
  upSubject: Subjects ={};
  errorMessage: string  | null = null; //thông báo lỗi
  successMessage: string | null = null; //thông báo thành công
  // Dữ liệu cho form thêm mới Subject
  newSubject: Subjects = {
    subjectsCode: '',
    subjectsName: '',
  };
  addSubjectForm: FormGroup;
  paginatedSubjects: Subjects[] = [];
  currentPage: number = 1; //Trang hiện tại
  pageSize: number = 5; //Số dữ liệu trên 1 trang
  totalPages: number = 0;//Tổng trang
  totalPagesArray: number[] = []; //Mảng chứa trang

  constructor(private fb: FormBuilder, private subjectsService: SubjectsService,
              private router: Router) {
    this.addSubjectForm = this.fb.group({
      subjectsCode: ['', [Validators.required]], // Mã môn học: Bắt buộc
      subjectsName: ['', [Validators.required]], // Tên môn học: Bắt buộc
    });
  }

  ngOnInit(): void {
    this.fetchSubjects();
  }

  //Hàm hiển thị thông báo thành công
  showSuccessMessage(message: string): void {
    this.successMessage = message;
    this.autoHideMessage('successMessage');
  }
  // Hàm hiển thị thông báo lỗi
  showErrorMessage(message: string): void {
    this.errorMessage = message;
    this.autoHideMessage('errorMessage');
  }
  // Tự động ẩn thông báo sau 5 giây
  private autoHideMessage(type: 'successMessage' | 'errorMessage'): void {
    setTimeout(() => {
      this[type] = null;
    }, 5000);
  }

  // Cập nhật logic phân trang
  updatePagination(): void {
    this.totalPages = Math.ceil(this.subjects.length / this.pageSize); // Tính tổng số trang
    this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1); // Tạo mảng số trang
    const startIndex = (this.currentPage - 1) * this.pageSize; // Chỉ số bắt đầu
    this.paginatedSubjects = this.subjects.slice(startIndex, startIndex + this.pageSize); // Lấy dữ liệu cho trang hiện tại
  }
  //Chuyển trang
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return; // Không cho phép vượt ngoài giới hạn
    this.currentPage = page;
    this.updatePagination();
  }

//Đổ dữ liệu
  fetchSubjects(): void {
    this.isLoading = true;
    this.subjectsService.getAll().subscribe({
      next: (data) => {
        this.subjects = data;
        this.isLoading = true;
        this.updatePagination();
      },
      error: (err) => {
        console.error('Lỗi khi tải dữ liệu:', err);
        this.isLoading = false;
      }
    });
  }

  //Thêm dữ liệu
  addSubject(): void {
    if (this.addSubjectForm.invalid) {
      this.showErrorMessage('Vui lòng điền đầy đủ thông tin.');
      return;
    }
    const newSubject = this.addSubjectForm.value;
    this.subjectsService.createSubject(newSubject).subscribe({
      next: (response) => {
        this.showSuccessMessage('Thêm môn học thành công!');
        this.addSubjectForm.reset();
        this.closeModal();
        this.fetchSubjects();
      },
      error: (error) => {
        this.showErrorMessage('Thêm thất bại. Vui lòng thử lại.');
      },
    });
  }

  closeModal(): void {
    const modalElement = document.getElementById('addStudentModal');
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance?.hide();

      // Loại bỏ lớp 'modal-backdrop' nếu còn tồn tại
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }

      // Xóa class 'modal-open' khỏi body
      document.body.classList.remove('modal-open');
    }
  }

  //Tìm kiếm
  serchSubject(): void {
    if(this.searchName){
      this.subjectsService.getSubjectByName(this.searchName).subscribe({
        next: (data) => {
          console.log('API Response:', data);
          this.subjects = data
          this.isLoading = true;
          this.updatePagination();
        },
        error: (err) => {
          this.showErrorMessage('Không tìm thấy. Vui lòng thử lại.');
        }
      })
    }
  }
  //Clear tìm kiếm
  clear(): void {
    this.searchName = undefined;
    this.fetchSubjects();
    this.isLoading = false;
  }

  //Ẩn Subject
  deleteSubject(id: number | undefined): void {
    if (confirm('Are you sure you want to delete this subject?')) {
      this.subjectsService.deleteSubject(id).subscribe({
        next: () => {
          alert('Subject deleted successfully.');
          // this.subjects = this.subjects.filter(subject => subject.subjectsID !== id);
          this.fetchSubjects();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error deleting subject:', err);
          // alert(`Failed to delete subject. Status: ${err.status} - ${err.message}`);
        },
      });
    }
  }

}
