import { TestBed } from '@angular/core/testing';

import { SupabaseServiceService } from './supabase-service.service';

describe('SupabaseServiceService', () => {
  let service: SupabaseServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupabaseServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
