import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassesService, Classes } from '../../service/classes.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-classes-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, RouterLink],
  templateUrl: './classes-list.component.html',

})
export class ClassesListComponent implements OnInit {
  classes: Classes[] = [];
  isLoading: boolean = true;
  searchId: number | undefined;
  upClass: Classes = {
    classCode: '',
    className: '',
  };
  errorMessage: string = '';
  newClass: Classes = {
    classCode: '',
    className: '',
  };

  constructor(private classesService: ClassesService) {}

  ngOnInit(): void {
    this.fetchClasses();
  }

  fetchClasses(): void {
    this.isLoading = true;
    this.classesService.getAllClasses().subscribe({
      next: (data) => {
        this.classes = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Lỗi khi tải dữ liệu:', err);
        this.isLoading = false;
      },
    });
  }

  addClasses(): void {
    this.isLoading = true;
    this.classesService.createClass(this.newClass).subscribe({
      next: () => {
        alert('Thêm thành công!');
        this.fetchClasses();
      },
      error: () => {
        alert('Thêm thất bại. Vui lòng thử lại.');
      },
    });
  }

  searchClasses(): void {
    if (this.searchId) {
      this.isLoading = true;
      this.classesService.getClassById(this.searchId).subscribe({
        next: (data) => {
          this.classes = [data];
          this.isLoading = false;
        },
        error: () => {
          alert('Subject not found or error fetching data.');
          this.isLoading = false;
        },
      });
    }
  }

  clear(): void {
    this.searchId = undefined;
    this.fetchClasses();
  }

  deleteClasses(id: number | undefined): void {
    if (!id) {
      alert('Invalid ID.');
      return;
    }
    if (confirm('Are you sure you want to delete this subject?')) {
      this.isLoading = true;
      this.classesService.deleteClass(id).subscribe({
        next: () => {
          alert('Subject deleted successfully.');
          this.fetchClasses();
        },
        error: () => {
          console.error('Error deleting subject.');
        },
      });
    }
  }
}
