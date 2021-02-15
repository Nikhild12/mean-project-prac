import { AbstractControl } from "@angular/forms";
import { Observable, Observer, of } from "rxjs";

export const mimeType = (control:AbstractControl): Promise<{[key:string]:any}> | Observable<{[key:string]:any}> => {
  if(typeof(control.value) == 'string'){
    return of(null);
  }
  const file = control.value as File;
  const fileReader = new FileReader();
  const frObs = Observable.create((observer:Observer<{[key:string]:any}>) =>{
    fileReader.addEventListener("loadend",() => {
      const arr = new Uint8Array(<ArrayBuffer>fileReader.result).subarray(0,4);
      let header = "";
      let isValid = false;
      for(let i = 0;i < arr.length; i++){
        header += arr[i].toString(16);
      }
      switch (header){
        case "89504e47":
          isValid = true;
        case "ffd88ffe0":
        case "ffd88ffe1":
        case "ffd88ffe2":
        case "ffd88ffe3":
        case "ffd88ffe8":
          isValid = true;
        default:
          isValid = false;
          break;
      }
      if(isValid){
        observer.next(null);
      }else{
        observer.next({invalidMimeType:true})
      }
    });
    fileReader.readAsArrayBuffer(file);
  })
  return frObs;
}
