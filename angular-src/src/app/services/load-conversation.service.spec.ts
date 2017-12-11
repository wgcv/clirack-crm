import { TestBed, inject } from '@angular/core/testing';

import { LoadConversationService } from './load-conversation.service';

describe('LoadConversationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadConversationService]
    });
  });

  it('should be created', inject([LoadConversationService], (service: LoadConversationService) => {
    expect(service).toBeTruthy();
  }));
});
