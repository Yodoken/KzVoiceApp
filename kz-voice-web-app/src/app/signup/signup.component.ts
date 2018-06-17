import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CognitoService } from '../service/cognito.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cognito: CognitoService
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.signupForm = this.fb.group({
      'email': ['', Validators.required],
      'password': ['', Validators.required],
    });
  }

  onSubmitSignup(value: any) {
    const email = value.email, password = value.password;
    this.cognito.register(email, password)
      .then((result) => {
        return console.log(result) || this.router.navigate(['/confirm']);
      }).catch((err) => {
        console.log(err);
      });
  }
}
