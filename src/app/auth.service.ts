import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
get isUserLoggedIn(){
    let status:boolean=false
    if(((window.location.origin)=='http://localhost/4200/succefull'))
    {
      status=false
    }
    else{
      status=true
    }
    return status
  }
}
