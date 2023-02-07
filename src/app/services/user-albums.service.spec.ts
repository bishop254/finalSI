import { TestBed } from '@angular/core/testing';

import { UserAlbumsService } from './user-albums.service';

describe('UserAlbumsService', () => {
  let service: UserAlbumsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserAlbumsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
