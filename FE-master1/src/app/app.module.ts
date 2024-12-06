import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
// Import standalone components
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import {ExamComponent, } from './page/exam/exam.conponent';
import {AppComponent} from './app.component'; // Đảm bảo import đúng tên
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {TestComponent} from './page/test/test.conponent';
import {AppRoutingModule} from './app.routes';
import {RouterModule} from '@angular/router';
import {QuestiontypeComponent} from './page/questiontype/questiontype.conponent';
import {StudentComponent} from './page/student/student.component';
import {SubjectsListComponent} from './page/subjects/subjects-list.component';
import {UpdateSubjectComponent} from './page/update-subject/update-subject.component';
import {ClassesListComponent} from './page/class/classes-list.component';
import {AnswerComponent} from './page/answer/answer.component';

@NgModule({
  declarations: [
    AppComponent,


    // Các component khác nếu có
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    // Standalone components không cần khai báo trong declarations
    ExamComponent,
    TestComponent,
    QuestiontypeComponent,
    HeaderComponent,
    StudentComponent,
    SubjectsListComponent,
    UpdateSubjectComponent,
    ClassesListComponent,
    AnswerComponent,
    FooterComponent,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    AppRoutingModule,
    RouterModule,
    BrowserAnimationsModule,
    MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
