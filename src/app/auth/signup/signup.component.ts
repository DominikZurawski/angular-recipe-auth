import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from '../auth.service';
import { Router } from '@angular/router';

function equalValues(controlName1: string, controlName2: string) {
    return (control: AbstractControl) => {
      const val1 = control.get(controlName1)?.value;
      const val2 = control.get(controlName2)?.value;

      if (val1 === val2) {
        return null;
      }

      return { valuesNotEqual: true };
    };
  }

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
    error: string | null = null;

    constructor(private authService: AuthService, private router: Router) {}

    form = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.email, Validators.required],
      }),
      passwords: new FormGroup(
        {
          password: new FormControl('', {
            validators: [Validators.required, Validators.minLength(6)],
          }),
          confirmPassword: new FormControl('', {
            validators: [Validators.required, Validators.minLength(6)],
          }),
        },
        {
          validators: [equalValues('password', 'confirmPassword')],
        }
      ),
      firstName: new FormControl('', { validators: [Validators.required] }),
      agree: new FormControl(false, { validators: [Validators.required] }),
    });

    onSubmit() {
      if (this.form.invalid) {
        console.log('INVALID FORM');
        return;
      }
      console.log(this.form);
      const enteredEmail: string = this.form.value.email!;
      const enteredPassword: string | null = this.form.value.passwords?.password!;
      const enteredName: string = this.form.value.firstName!;
      console.log(enteredEmail, enteredPassword, enteredName);

      let registerObs: Observable<AuthResponseData>;
      registerObs = this.authService.signUp(enteredEmail, enteredPassword, enteredName);

      registerObs.subscribe(
        resData => {
          console.log(resData);

          this.router.navigate(['/login']);
        },
        errorMessage => {
          console.log(errorMessage);
          this.error = errorMessage;

        }
      );
    }

    onReset() {
      this.form.reset();
    }
  }
