import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../user/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, // for ngIf, etc.
    ReactiveFormsModule // Enables reactive forms directives
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);

  loginForm!: FormGroup;
  passwordVisible = false;


  ngOnInit(): void {
    this.loginForm = this.fb.group({
      // FormControl for username with a required validator
      username: ['', [Validators.required, Validators.minLength(3)]],
      // FormControl for password with a required validator
      password: ['', Validators.required]
    });
  }

  // Getter for easy access to form controls in the template
  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit(): void {
    // Stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.userService.login(this.loginForm.value.username);
  }
}
