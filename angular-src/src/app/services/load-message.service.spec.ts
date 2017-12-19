import { TestBed, inject } from '@angular/core/testing';

import { LoadMessageService } from './load-message.service';

describe('LoadMessageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadMessageService]
    });
  });

  it('should be created', inject([LoadMessageService], (service: LoadMessageService) => {
    expect(service).toBeTruthy();
  }));
});
