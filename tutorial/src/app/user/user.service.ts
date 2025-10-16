import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root' //singlton 
})
export class UserService {
  // internal stateholder. Readonly means NOT reassignable.
  // BehaviorSubject provides the current state.
  private readonly userState = new BehaviorSubject<User>({ 
    id: 0,
    name: 'Guest',
    isLogged: false,
  });

  // public observable stream
  public readonly user$ = this.userState.asObservable();

  // public methods to change state
  public login(nameStr: string): void {
    const newUser: User = {
      id: 1,
      name: nameStr,
      isLogged: true,
    };
    this.userState.next(newUser);
  }

  public logout(): void {
    if (this.userState.value.isLogged) {
      // update the current state in BFF  (if session is active)
      // call BFF service to logout
      this.userState.next({ ...this.userState.value, isLogged: false });
    } else {
      const guestUser: User = {
        id: 0,
        name: 'Guest',
        isLogged: false,
      };
      this.userState.next(guestUser);
    }
  }

}
