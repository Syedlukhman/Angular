import { Component ,OnInit} from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { UserserviceService } from './userservice.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'NHubSPot';
  constructor(private user:UserserviceService){
  
  }
  enable:boolean=false
   check() {
       
    if (window.location.href !== "http://localhost:4200") {
      this.enable=true
    return this.enable 
    }
    else {
      this.enable=false
      return this.enable
    }
  }


 get(){
  window.location.href='https://app-eu1.hubspot.com/oauth/authorize?client_id=072813f0-eb7a-455f-ae3c-e8836374f673&redirect_uri=http://localhost:3000/api/oauth-callback&scope=crm.objects.contacts.read%20crm.objects.contacts.write%20crm.schemas.contacts.read%20crm.schemas.contacts.write'
// this.user.demo().subscribe((data)=>{
//   console.log(data)
// })
}

ngOnInit(){

}
}








