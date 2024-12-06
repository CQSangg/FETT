  import { Component, OnInit } from '@angular/core';
  import { ExamService } from '../../service/exam.service';
  import { FormsModule } from '@angular/forms';
  import { NgIf, NgForOf, CommonModule } from '@angular/common';
  import * as XLSX from 'xlsx';

  @Component({
    selector: 'app-exam',
    templateUrl: './exam.component.html',
    standalone: true,
    imports: [FormsModule, NgIf, NgForOf, CommonModule],
    styleUrls: ['./exam.component.css']
  })
  export class ExamComponent implements OnInit {
    data: any[] = [];  // Dữ liệu bài thi
    filteredData: any[] = [];  // Dữ liệu bài thi sau khi lọc
    subjects: any[] = [];  // Dữ liệu môn học
    examForm: any = {};  // Dữ liệu form cho bài thi
    isModalOpen: boolean = false;  // Điều khiển trạng thái modal
    searchKeyword: string = '';  // Từ khóa tìm kiếm

    exams = []; // Dữ liệu bài thi
    currentPage = 1;
    itemsPerPage = 5; // Số lượng bài thi trên mỗi trang
    totalPages = 0;

    constructor(private examService: ExamService) {}

    ngOnInit(): void {
      this.loadData();  // Tải dữ liệu bài thi
      this.getSubjects();  // Tải danh sách môn học
    }

    // Hàm tải lại danh sách dữ liệu
    loadData() {
      this.examService.getExams().subscribe(
        (data) => {
          this.data = data;
          this.filteredData = data;  // Lưu trữ dữ liệu ban đầu để tìm kiếm
          this.totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);  // Tính tổng số trang
        },
        (error) => {
          console.error('Lỗi khi tải dữ liệu:', error);
        }
      );
    }

    // Hàm tìm kiếm bài thi
    searchExam() {
      if (this.searchKeyword.trim() === '') {
        this.filteredData = this.data;  // Nếu không có từ khóa tìm kiếm, hiển thị tất cả dữ liệu
      } else {
        this.filteredData = this.data.filter((exam) =>
          exam.ExamName.toLowerCase().includes(this.searchKeyword.toLowerCase())
        );  // Lọc bài thi theo tên
      }
      this.totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);  // Cập nhật tổng số trang sau khi lọc
      this.currentPage = 1;  // Reset về trang đầu tiên khi tìm kiếm
    }

    // Hàm mở modal để thêm hoặc sửa bài thi
    showModal(exam?: any) {
      if (exam) {
        this.examForm = { ...exam };  // Nếu có đối tượng bài thi (edit), gán vào examForm
      } else {
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

    // Hàm đóng modal
    closeModal() {
      this.isModalOpen = false;
    }

    // Hàm lưu bài thi
    saveExam() {
      if (!this.examForm.ExamCode || !this.examForm.ExamName || !this.examForm.Duration || !this.examForm.NumberOfQuestions || !this.examForm.TestID) {
        console.error('Các trường bắt buộc chưa được điền đầy đủ');
        return;
      }

      this.examForm.TestID = parseInt(this.examForm.TestID, 10);
      if (this.examForm.ExamID) {
        this.examService.updateExam(this.examForm).subscribe(
          (response) => {
            alert('Cập nhật bài thi thành công');
            this.loadData();
            this.closeModal();
          },
          (error) => {
            alert('Lỗi khi cập nhật bài thi');
          }
        );
      } else {
        this.examService.createExam(this.examForm).subscribe(
          (response) => {
            alert('Thêm mới bài thi thành công');
            this.loadData();
            this.closeModal();
          },
          (error) => {
            alert('Lỗi khi thêm mới bài thi');
          }
        );
      }
    }

    // Hàm xóa bài thi
    deleteExam(examID: number) {
      this.examService.deleteExam(examID).subscribe(
        (response) => {
          alert('Xoá bài thi thành công');
          this.loadData();
        },
        (error) => {
          alert('Lỗi khi xoá bài thi');
        }
      );
    }

    // Hàm lấy danh sách môn học
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

    // Lọc dữ liệu để chỉ hiển thị bài thi theo trang hiện tại
    get paginatedData() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = this.currentPage * this.itemsPerPage;
      return this.filteredData.slice(startIndex, endIndex);
    }

    // Chuyển trang
    changePage(page: number) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
    }
    resetSearch() {
      this.searchKeyword = '';  // Xóa từ khóa tìm kiếm
      this.searchExam();        // Gọi lại hàm tìm kiếm để cập nhật danh sách
    }


    exportToExcel(): void {
      // Tạo một workbook và một sheet
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.paginatedData);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();

      // Thêm sheet vào workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Bài Thi');

      // Tạo tệp Excel và tải xuống
      XLSX.writeFile(wb, 'DanhSachBaiThi.xlsx');
    }

  }
