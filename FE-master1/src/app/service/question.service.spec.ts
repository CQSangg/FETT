import { TestBed } from '@angular/core/testing';

import { ExamService } from './exam.service';
import {QuestionTypeService} from './question.service';

describe('QuestionService', () => {
  let service: QuestionTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuestionTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
