import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserserviceService {

  constructor(private http:HttpClient,) { 
 
  }
   subject= new Subject<void>()
  getall():Observable<any>{
    
    this.subject.next()
   return this.http.get('/api/send')

    
  }
delete(email:any):Observable<any>{
 return this.http.delete(`/api/delete/${email}`)
}
// data1='test' 




// demo():Observable<any>{
//   return this.http.get('/api/oauth-callback')
// }


get(email:any):Observable<any>{
  return this.http.get(`/api/getData/${email}`)
}
update(email:any,body:any):Observable<any>{
  return this.http.put(`/api/edit/${email}`,body)
  
}
create(body:any):Observable<any>{
  return this.http.post('/api/create',body)
}
//==============for logging out========================
redirect():Observable<any>{
  return this.http.get("https://app.hubspot.com/login-api/v1/logout/all")
}
}
