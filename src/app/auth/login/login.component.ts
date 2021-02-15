import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit,OnDestroy {
  isLoading:boolean = false;
  authStatusSub:Subscription
  constructor(private authSrv:AuthService) { }

  ngOnInit(): void {
    this.authStatusSub = this.authSrv.getAuthStatusListenr().subscribe(
      authStatus =>{
        this.isLoading = false;
      }
    );
  }
  onLogin(form:NgForm){
    console.log(form);
    if(form.invalid){
      return;
    }
    this.isLoading = true;
    this.authSrv.loginUser(form.value.email,form.value.password);
  }

  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }
}
