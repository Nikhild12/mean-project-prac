import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit,OnDestroy {
  isLoading:boolean = false;
  private authStatusSub:Subscription
  constructor(private authSrv:AuthService) { }

  ngOnInit(): void {
    this.authStatusSub = this.authSrv.getAuthStatusListenr().subscribe(
      authStatus =>{
        this.isLoading = false;
      }
    );
  }

  onSignUp(form:NgForm){
    console.log(form);
    if(form.invalid){
      return;
    }
    this.isLoading = true;
    this.authSrv.createUser(form.value.email,form.value.password)
  }

  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }
}
