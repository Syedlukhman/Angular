import { Component, OnInit } from '@angular/core';
import {SuccefullComponent} from '../succefull/succefull.component'

@Component({
  selector: 'app-disconnected',
  templateUrl: './disconnected.component.html',
  styleUrls: ['./disconnected.component.css']
})
export class DisconnectedComponent implements OnInit {

  constructor(private success:SuccefullComponent) { 
    this.success.hide=false
    this.success.Text="Diconnected from HubSpot"

  }
//   disconnect(){
//     window.location.href="https://app.hubspot.com/login-api/v1/logout/all"
    
//  setTimeout(() => {
//    window.location.href="http://localhost:4200"
//  }, 500); 
//  }

  ngOnInit(): void {
 

  }

}
