import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Post } from '../post.model';
import { PostServiceService } from '../service/post-service.service';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit,OnDestroy {
  // posts = [
  //   // { title: 'First Post', content: "This is the first post's content"},
  //   // { title: 'Second Post', content: "This is the Second post's content"},
  //   // { title: 'Third Post', content: "This is the Third post's content"}
  // ];
  posts:Post[] = [];
  public isLoading:boolean = false;
  private postsSub:Subscription;
  totalPost = 0;
  postPerPage = 2;
  currentPage = 1
  pageSizeOptions = [1,2,5];
  userIsAuthenticated = false;
  userId:string;
  private authStatusSub:Subscription;
  constructor(private postSrv:PostServiceService,private authSrv:AuthService) {
   }

  ngOnInit(): void {
    this.postSrv.getPosts(this.postPerPage,this.currentPage);
    this.isLoading = true;
    this.userId = this.authSrv.getUserId();
    this.postsSub = this.postSrv.getPostUpdateListener().subscribe((postData:{posts:Post[],postCount:number})=>{
      this.posts = postData.posts;
      this.totalPost = postData.postCount;
      console.log(this.posts);
      console.log(this.userId);

      this.posts.forEach(id =>{
        console.log(this.userId == id.creator);

      })
      this.isLoading = false;
    });
    this.userIsAuthenticated = this.authSrv.getIsAuth();
    this.authStatusSub = this.authSrv.getAuthStatusListenr().subscribe(isAuthenticated =>{
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authSrv.getUserId();
    })

  }
  onChangePage(pageData:PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postPerPage = pageData.pageSize;
    this.postSrv.getPosts(this.postPerPage,this.currentPage);
  }
  ngOnDestroy(){
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onDelete(postId:string){
    this.isLoading = true;
    this.postSrv.deletePost(postId).subscribe(()=>{
      this.postSrv.getPosts(this.postPerPage,this.currentPage);
    },error=>{
      this.isLoading = false;
    });
  }
}
