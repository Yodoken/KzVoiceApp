import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
 
import { Observable, of } from 'rxjs';

import { Message } from '../message';
import { CognitoService } from './cognito.service';
import { environment } from './../../environments/environment';
 
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
 
@Injectable({
  providedIn: 'root'
})
export class MessageService {
 
  private Url: string;  // URL to web api

  constructor(
    private http: Http,
    private httpClient: HttpClient,
    private cognito: CognitoService) {
    this.Url = environment.apiServerUrl;
  }
  
  postMessage(from:string, to:string, message:string): Observable<string> {
    const body = {
      "from":from,
      "to":to,
      "message":message
    };
    return this.httpClient.post<string>(this.Url, body, httpOptions);
  }

  // ###mada 実験用
  getMessageText(): Observable<string> {
    return this.httpClient.get<string>(this.Url);
  } 
  
  /** GET messages from the server */
  getMessages(): Observable<Message[]> {
    /*var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', this.Url, true);
    httpRequest.onreadystatechange = () => {
      switch ( httpRequest.readyState ) {
          case 0:
              // 未初期化状態.
              console.log( 'uninitialized!' );
              break;
          case 1: // データ送信中.
              console.log( 'loading...' );
              break;
          case 2: // 応答待ち.
              console.log( 'loaded.' );
              break;
          case 3: // データ受信中.
              console.log( 'interactive... '+httpRequest.responseText.length+' bytes.' );
              break;
          case 4: // データ受信完了.
              if( httpRequest.status == 200 || httpRequest.status == 304 ) {
                  var data = httpRequest.responseText; // responseXML もあり
                  console.log( 'COMPLETE! :'+data );
              } else {
                  console.log( 'Failed. HttpStatus: '+httpRequest.statusText );
              }
              break;
      }
    };
    httpRequest.send(null);
    return of([]);*/
    //return of([{datetime:"2018-06-28",from_name:"パパ",to_name:"まま",message:"おはよう"}]);
    return this.httpClient.get<Message[]>(this.Url, httpOptions);
  }
}
/*
@Injectable()
export class NoopInterceptor implements HttpInterceptor {
  constructor(private cognito: CognitoService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // サービスから認証ヘッダーを取得します。
    const authHeader = this.cognito.getCurrentUserIdToken();
    // 新しいヘッダーを加えたリクエストを複製します。
    const authReq = req.clone({ headers: req.headers.set('Authorization', authHeader) });
    // オリジナルのリクエストの代わりに複製したリクエストを投げます。
    return next.handle(authReq);
  }
}
*/