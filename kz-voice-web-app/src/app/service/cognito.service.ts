import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import {
  CognitoUserPool,
  CognitoUser,
  CognitoUserAttribute,
  AuthenticationDetails
} from 'amazon-cognito-identity-js';
import * as AWS from 'aws-sdk';
import { ReadFromInjectorFn } from '@angular/core/src/render3/di';
 
@Injectable({
  providedIn: 'root'
})
export class CognitoService {
 
  private userPool: CognitoUserPool;
  private poolData: any;
  private cognitoUser: CognitoUser;
  public cognitoCreds: AWS.CognitoIdentityCredentials;
 
  constructor() {
    AWS.config.region = environment.region;
    this.poolData = { UserPoolId: environment.userPoolId, ClientId: environment.clientId };
    this.userPool = new CognitoUserPool(this.poolData);
  }
 
  //登録処理
  register(email: string, password: string): Promise<any> {
    var userPool = new CognitoUserPool(this.poolData);
    var userName = this.toUsername(email);

    var dataEmail = {
        Name : 'email',
        Value : email
    };
    var attributeEmail = new CognitoUserAttribute(dataEmail);
 
    var attributeList = [];
    attributeList.push(attributeEmail);

    return new Promise((resolve, reject) => {
      userPool.signUp(userName, password, attributeList, null, function(err, result) {
        if (err) {
          alert(err);
          reject(err);
        } else {
          this.cognitoUser = result.user;
          console.log('user name is ' + this.cognitoUser.getUsername());
          resolve(result);
        }
      });
    });
  }

  // コードの確認
  confirm(cofirmationCode: string) {
    return new Promise((resolve, reject) => {
      this.cognitoUser.confirmRegistration(cofirmationCode, true, function(err, result) {
          if (err) {
            alert(err);
            reject(err);
          } else {
            console.log('call result: ' + result);
            resolve(result);
          }
        }
      );
    });
  }
  
   //ログイン処理
  login(email: string, password: string): Promise<any> {
    const userData = {
      Username: this.toUsername(email),
      Pool: this.userPool,
      Storage: localStorage
    };
    const cognitoUser = new CognitoUser(userData);
    const authenticationData = {
      Username: this.toUsername(email),
      Password: password,
    };
    const authenticationDetails = new AuthenticationDetails(authenticationData);
    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
          alert('LogIn is success!');
          console.log('id token + ' + result.getIdToken().getJwtToken());
          console.log('access token + ' + result.getAccessToken().getJwtToken());
          console.log('refresh token + ' + result.getRefreshToken().getToken());
          resolve(result);
        },
        onFailure: function (err) {
          alert(err);
          console.log(err);
          reject(err);
        },
        newPasswordRequired: function (userAttributes, requiredAttributes) {
          var newpassword = "kengokengo";// ###mada　仮。そのまま使う。
          cognitoUser.completeNewPasswordChallenge(newpassword, userAttributes, this);
        }
      });
    });
  }
 
  //ログイン済確認処理
  isAuthenticated(): Promise<any> {
    const cognitoUser = this.userPool.getCurrentUser();
    return new Promise((resolve, reject) => {
      if (cognitoUser === null) { reject(cognitoUser); }
      cognitoUser.getSession((err, session) => {
        if (err) {
          reject(err);
        } else {
          if (!session.isValid()) {
            reject(session);
          } else {
            resolve(session);
          }
        }
      });
    });
  }
  
  //トークン取得処理
  getCurrentUserIdToken(): any {
    const cognitoUser = this.userPool.getCurrentUser();
    if (cognitoUser != null) {
      cognitoUser.getSession(function (err, session) {
        if (err) {
          alert(err);
          return;
          } else {
          return session.getIdToken().getJwtToken();
          }
        });
      }
    }
     
  //ログイン処理
  logout() {
    console.log('LogOut!');
    const currentUser = this.userPool.getCurrentUser();
    if (currentUser) {
      currentUser.signOut();
    }
  }

  toUsername(email) {
    return email.replace('@', '-at-');
  }
}