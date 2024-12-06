import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubjectsService,Subjects } from '../../service/subjects.service';
import {FormsModule} from '@angular/forms';


@Component({
  selector: 'app-update-subject',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './update-subject.component.html',

})
export class UpdateSubjectComponent implements OnInit{
  subject: Subjects = {
    subjectsCode: '',
    subjectsName: ''
  };
  isLoading = false;

  constructor(
    private subjectsService: SubjectsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}


  ngOnInit(): void {
    // Get the subject ID from the route parameters
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id) {
      // Fetch the subject data using the ID
      this.subjectsService.getSubjectById(id).subscribe({
        next: (subject) => {
          this.subject = subject; // Populate the form with existing subject data
        },
        error: (err) => {
          console.error('Error fetching subject data:', err);
          alert('Không thể lấy thông tin môn học');
        }
      });
    }
  }

  updateSubject(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));  // Lấy ID từ URL (ví dụ: /subjects/update/21)
    if (id) {
      // Sử dụng đối tượng 'this.subject' đã có sẵn trong component
      this.subjectsService.updateSubject(id, this.subject).subscribe({
        next: (updatedSubject) => {
          console.log('Cập nhật môn học thành công:', updatedSubject);
          alert('Cập nhật thành công!');
          this.router.navigate(['/subjects']);  // Điều hướng về danh sách môn học
        },
        error: (error) => {
          console.error('Lỗi khi cập nhật môn học:', error);
          alert('Cập nhật thất bại. Vui lòng thử lại.');
        }
      });
    }
  }

}
