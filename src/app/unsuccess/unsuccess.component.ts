import { Component, OnInit } from '@angular/core';
import { UserserviceService } from '../userservice.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-unsuccess',
  templateUrl: './unsuccess.component.html',
  styleUrls: ['./unsuccess.component.css']
})
export class UnsuccessComponent  {

  constructor(private http:HttpClient) { }
//   data="true"
//   ngOnInit():void {
//     this.http.post<any>('/api/post',{data: this.data}).subscribe() 
// }
 

    


}