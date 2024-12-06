import {RouterModule, Routes} from '@angular/router';
import {TestComponent} from './page/test/test.conponent';
import {ExamComponent} from './page/exam/exam.conponent';
import {QuestiontypeComponent} from './page/questiontype/questiontype.conponent';
import {NgModule} from '@angular/core';
import {UpdateSubjectComponent} from './page/update-subject/update-subject.component';


export const routes: Routes = [
  { path: '', redirectTo: '/exam', pathMatch: 'full' }, // Trang mặc định
  { path: 'test', loadComponent: () => import('./page/test/test.conponent').then(m => m.TestComponent) },
  { path: 'exam', loadComponent: () => import('./page/exam/exam.conponent').then(m => m.ExamComponent) },
  { path: 'question', loadComponent: () => import('./page/questiontype/questiontype.conponent').then(m => m.QuestiontypeComponent) },
  { path: 'student', loadComponent: () => import('./page/student/student.component').then(m => m.StudentComponent) },
  { path: 'subjects', loadComponent: () => import('./page/subjects/subjects-list.component').then(m => m.SubjectsListComponent) },
  { path: 'subjects/update-subject-subject/:id', component: UpdateSubjectComponent },
  { path: 'class', loadComponent: () => import('./page/class/classes-list.component').then(m => m.ClassesListComponent) },
  { path: 'answer', loadComponent: () => import('./page/answer/answer.component').then(m => m.AnswerComponent) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
