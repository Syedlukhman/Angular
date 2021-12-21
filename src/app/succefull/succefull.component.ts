import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { UserserviceService } from '../userservice.service';

@Component({
  selector: 'app-succefull',
  templateUrl: './succefull.component.html',
  styleUrls: ['./succefull.component.css']
})
export class SuccefullComponent implements OnInit {
  Data: any = []
  hide=true
  Text="Connected with HubSpot successfully"
  constructor(private user: UserserviceService, private Route: ActivatedRoute,private router:Router) {}
 
  get(){//=======gets all data============
    this.user.getall().subscribe((data) => {
      this.Data = data
     
  })
  }
  ngOnInit() {
    this.get()
  }
 
  enable:boolean=false
   check() {
       
    if (window.location.href! == "http://localhost:4200/succefull" || window.location.href! == "http://localhost:4200/succefull/create") {
      return this.enable=true 
    }
    else {
      return this.enable=false
    }
  }

    delete(item:any){
      this.user.delete(item.email).subscribe((data)=>{
        window.alert(data)   
      })
    
      this.Data.forEach((contact:any,index:any)=>{
        if(contact==item) this.Data.splice(index,1);
     });
   
    }

 
    disconnect(){
     window.location.href="https://app.hubspot.com/login-api/v1/logout/all"
     
  setTimeout(() => {
     window.location.href="http://localhost:4200/succefull/disconnected"

  
  }, 500); 





  }

  }
