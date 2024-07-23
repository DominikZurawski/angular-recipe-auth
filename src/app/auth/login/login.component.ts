import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { debounceTime, Observable, of } from 'rxjs';

import { AuthService, AuthResponseData } from '../auth.service';
import { Router } from '@angular/router';

// function mustContainQuestionMark(control: AbstractControl) {
//     if (control.value.includes('?')) {
//       return null;
//     }

//     return { doesNotContainQuestionMark: true };
//   }

function emailIsUnique(control: AbstractControl) {
  if (control.value !== 'test@example.com') {
    return of(null);
  }

  return of({ notUnique: true });
}

let initialEmailValue = '';
const savedForm = window.localStorage.getItem('saved-login-form');

if (savedForm) {
  const loadedForm = JSON.parse(savedForm);
  initialEmailValue = loadedForm.email;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  isLoading = false;
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  private destroyRef = inject(DestroyRef);
  form = new FormGroup({
    email: new FormControl(initialEmailValue, {
      validators: [Validators.email, Validators.required],
      asyncValidators: [emailIsUnique],
    }),
    password: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(6),
        //   mustContainQuestionMark,
      ],
    }),
  });

  get emailIsInvalid() {
    return (
      this.form.controls.email.touched &&
      this.form.controls.email.dirty &&
      this.form.controls.email.invalid
    );
  }

  get passwordIsInvalid() {
    return (
      this.form.controls.password.touched &&
      this.form.controls.password.dirty &&
      this.form.controls.password.invalid
    );
  }

  ngOnInit() {
    const subscription = this.form.valueChanges
      .pipe(debounceTime(500))
      .subscribe({
        next: (value) => {
          window.localStorage.setItem(
            'saved-login-form',
            JSON.stringify({ email: value.email })
          );
        },
      });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }
    console.log(this.form);
    const enteredEmail: string = this.form.value.email!;
    const enteredPassword: string = this.form.value.password!;
    console.log(enteredEmail, enteredPassword);

    let authObs: Observable<AuthResponseData>;
    let authLogin: Observable<AuthResponseData>;

    this.isLoading = true;

    authObs = this.authService.getToken(enteredEmail, enteredPassword);

    authObs.subscribe(
      (resData) => {
        console.log(`Token ${resData.token}`);

        authLogin = this.authService.login(resData.token);

        authLogin.subscribe(
          (resData) => {
            console.log(resData);
            this.isLoading = false;
            this.authService.isLogin.set(false)
            this.router.navigate(['/recipes']);
          },
          (errorMessage) => {
            console.log(errorMessage);
            this.error = errorMessage;
            this.isLoading = false;
          }
        );
      },
      (errorMessage) => {
        console.log(errorMessage);
        this.error = errorMessage;
        this.isLoading = false;
      }
    );

    this.form.reset();
  }
}
