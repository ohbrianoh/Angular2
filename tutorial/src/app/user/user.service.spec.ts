import { TestBed } from '@angular/core/testing';
import { first } from 'rxjs/operators';

import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have a guest user by default', (done: DoneFn) => {
    service.user$.pipe(first()).subscribe(user => {
      expect(user.isLogged).toBeFalse();
      expect(user.name).toBe('Guest');
      done(); // Call done() to signal that the async test is complete
    });
  });

  it('should log in a user', (done: DoneFn) => {
    const testName = 'brian';
    
    // Subscribe first
    service.user$.subscribe(user => {
      // This will run for the initial 'Guest' value and then for the logged-in user.
      // We only care about the state after login.
      if (user.isLogged) {
        expect(user.isLogged).toBeTrue();
        expect(user.name).toBe(testName);
        done();
      }
    });

    // Then perform the action
    service.login(testName);
  });

  // it('should log out a user', (done: DoneFn) => {
  //   // First, log in to have a state to log out from
  //   service.login('testuser');

  //   service.user$.subscribe(user => {
  //     expect(user.isLogged).toBeTrue();
  //     service.logout(); // Now trigger the logout
  //     expect(user.isLogged).toBeFalse(); // The BehaviorSubject emits synchronously
  //     done();
  //   }).unsubscribe(); // Unsubscribe to avoid re-triggering on subsequent emissions
  // });
  
});
