import { Component, OnInit } from '@angular/core';
import { FormControl, FormControlName, FormGroup } from '@angular/forms';
import { UserserviceService } from '../userservice.service';
import {Router} from "@angular/router";
import { SuccefullComponent } from '../succefull/succefull.component';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  constructor(private user: UserserviceService,private router:Router, private success:SuccefullComponent) { }
  addContact = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl('')
  })
  collection() {
    const body =
    {
      properties:
        [
          { property: 'firstname', value: this.addContact.value.firstName },
          { property: 'lastname', value: this.addContact.value.lastName },
          { property: 'email', value: this.addContact.value.email },
          { property: 'phone', value: this.addContact.value.phone }
        ]
    }
    this.user.create(body).subscribe((data) => {
      
      let newRouterLink = '/succefull';
			this.router.navigate([ newRouterLink ]).then(() => {
				this.success.ngOnInit();
        window.alert(data)
			});
    })
    // console.log(body)


  }
  ngOnInit(): void {
  }

}
