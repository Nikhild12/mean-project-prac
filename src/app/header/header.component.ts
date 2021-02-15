import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit,OnDestroy {
  private authListenerSub:Subscription;
  userIsAuthenticated=false;
  constructor(private authSrv:AuthService) { }

  ngOnInit(): void {
    this.userIsAuthenticated = this.authSrv.getIsAuth();
    this.authListenerSub = this.authSrv.getAuthStatusListenr().subscribe(isAuthenticated =>{
      this.userIsAuthenticated = isAuthenticated;
    });
  }
  ngOnDestroy(){
    this.authListenerSub.unsubscribe();
  }

  onLogout(){
    this.authSrv.logout();
  }
}
