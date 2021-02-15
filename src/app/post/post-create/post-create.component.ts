import { Component, OnInit,EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { PostServiceService } from 'src/app/service/post-service.service';
import { Post } from '../../post.model';
import {mimeType} from "./mime-type.validator";
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit,OnDestroy {
  newPost = '';
  enteredContent='';
  enteredTitle = '';
  public mode = 'create';
  public postId:string
  public post:Post;
  public isLoading:boolean = false;
  form:FormGroup;
  imagePreview:any;
  private authStatusSub:Subscription
  @Output() postCreated = new EventEmitter<Post>();
  constructor(private postSrv:PostServiceService,private route:ActivatedRoute,private authSrv:AuthService) { }

  ngOnInit(): void {
    this.authStatusSub = this.authSrv.getAuthStatusListenr().subscribe(
      authStatus=>{
        this.isLoading = false;
      }
    )
    this.form = new FormGroup({
      title: new FormControl(null,
        {validators:[Validators.required,Validators.minLength(3)]
        }),
      content: new FormControl(null,{validators:[Validators.required]}),
      image: new FormControl(null,{validators:[Validators.required],asyncValidators:[mimeType]})
    });
    this.route.paramMap.subscribe((paramMap:ParamMap)=>{
      if(paramMap.has('postId')){
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postSrv.getPost(this.postId).subscribe(postData=>{
          this.post = {id:postData._id,title:postData.title,content:postData.content,imagePath:postData.imagePath,creator:postData.creator};
          console.log(this.post);

          this.form.setValue({
            title:this.post.title,
            content:this.post.content,
            image:this.post.imagePath
          })
          this.isLoading = false;
        });
      }else{
        this.mode = 'create';
        this.postId = null;
      }
    })
  }

  onSavePost(){
    if(this.form.invalid){
      return ;
    }
    this.isLoading = true;
    if(this.mode == 'create'){
      this.postSrv.addPost(this.form.value.title,this.form.value.content,this.form.value.image);
    }else{
      this.postSrv.updatePost(this.postId,this.form.value.title,this.form.value.content,this.form.value.image)
    }
    this.form.reset();
  }

  onImagePicked(event:Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image:file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }
}
