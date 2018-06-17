import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Message } from '../message';
import { MessageService } from '../service/message.service';
import { CognitoService } from '../service/cognito.service';

@Component({
  selector: 'app-messagelist',
  templateUrl: './messagelist.component.html',
  styleUrls: ['./messagelist.component.css']
})
export class MessagelistComponent implements OnInit {
  messages: Message[];

  public sendForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cognito: CognitoService,
    private messageService: MessageService) {
    this.cognito.isAuthenticated()
      .then(res => console.log(res))
      .catch((err) => {
        return console.log(err) || this.router.navigate(['/login']);
      });
  }

  ngOnInit() {
    this.initForm();
    this.getMessages();
  }

  initForm() {
    this.sendForm = this.fb.group({
      'message': ['', Validators.required]
    });
  }

  getMessages(): void {
    /*this.messageService.getMessageText()
      .subscribe(text => console.log(text));*/
    this.messageService.getMessages()
      .subscribe(messages => {
        console.log(JSON.stringify(messages));
        this.messages = messages;
      });
  }

  onClickUpdate(): void {
    this.getMessages();
  }

  onClickLogout(): void {
    this.cognito.logout();
    this.router.navigate(['/login']);
  }
  onClickSubmit(value: any) {
    const message = value.message;
    this.messageService.postMessage('3', '1', message)  // from "3"->みおり、"1"->パパ
      .subscribe((result) => {
        console.log(result);
        this.getMessages(); // 再読込
      });
  }
}
