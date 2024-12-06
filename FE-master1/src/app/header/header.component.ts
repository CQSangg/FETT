import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  loginForm: FormGroup; // FormGroup cho form đăng nhập

  constructor(private fb: FormBuilder, private http: HttpClient) {
    // Khởi tạo Reactive Form
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    const { username, password } = this.loginForm.value;

    // Gửi yêu cầu đăng nhập tới API
    this.http
      .post('URL_API_DANG_NHAP', { username, password })
      .subscribe(
        (response: any) => {
          if (response.success) {
            alert('Đăng nhập thành công!');
            // Xử lý logic khi đăng nhập thành công, ví dụ: lưu token, chuyển trang, v.v.
          } else {
            alert('Tên đăng nhập hoặc mật khẩu không đúng!');
          }
        },
        (error) => {
          alert('Có lỗi xảy ra khi đăng nhập!');
          console.error(error);
        }
      );
  }
}
