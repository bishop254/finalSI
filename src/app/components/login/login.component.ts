import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  addressForm = this.fb.group({
    email: [null, Validators.required],
    password: [null, Validators.required],
  });

  hasUnitNumber = false;

  constructor(private fb: FormBuilder, private auth: AuthService) {}

  onSubmit(): void {
    let em: string = this.addressForm.controls['email'].value!;
    let pass: string = this.addressForm.controls['password'].value!;
    this.auth.SignIn(em, pass);
  }
}
