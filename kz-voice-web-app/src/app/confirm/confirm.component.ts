import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CognitoService } from '../service/cognito.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {

  public confirmForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cognito: CognitoService
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.confirmForm = this.fb.group({
      'code': ['', Validators.required]
    });
  }

  onSubmitConfirm(value: any) {
    const code = value.code;
    this.cognito.confirm(code)
      .then((result) => {
        return console.log(result) || this.router.navigate(['/login']);
      }).catch((err) => {
        console.log(err);
      });
  }
}
