import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { AngularMaterialModule } from "src/app/angular-material,module";
import { PostListComponent } from "src/app/post-list/post-list.component";
import { PostCreateComponent } from "./post-create.component";

@NgModule({
  declarations:[
    PostCreateComponent,
    PostListComponent,
  ],
  imports:[
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule
  ]
})
export class PostModule{}
