import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { UserserviceService } from '../userservice.service';
import { SuccefullComponent } from '../succefull/succefull.component';
import { NgxSpinnerModule } from 'ngx-spinner';
@Component({
	selector: 'app-edit',
	templateUrl: './edit.component.html',
	styleUrls: [ './edit.component.css' ]
})
export class EditComponent implements OnInit {
	addContact = new FormGroup({
		firstName: new FormControl(''),
		lastName: new FormControl(''),
		email: new FormControl(''),
		phone: new FormControl('')
	});
	l = this.route.snapshot.paramMap.get('email');

	constructor(
		private route: ActivatedRoute,
		private user: UserserviceService,
		private router: Router,
		private success: SuccefullComponent
	) {}

	ngOnInit(): void {
		this.user.get(this.l).subscribe((data) => {
			this.addContact = new FormGroup({
				firstName: new FormControl(data[0].firstName),
				lastName: new FormControl(data[0].lastName),
				email: new FormControl(data[0].email),
				phone: new FormControl(data[0].phone)
			});
		});
	}
	collection() {
		
	
		const body = {
			properties: [
				{ property: 'firstname', value: this.addContact.value.firstName },
				{ property: 'lastname', value: this.addContact.value.lastName },
				{ property: 'email', value: this.addContact.value.email },
				{ property: 'phone', value: this.addContact.value.phone }
			]
		};
		this.user.update(this.l, body).subscribe((data) => {
		this.success.enable = false;
  	let newRouterLink = '/succefull';
			this.router.navigate([ newRouterLink ]).then(() => {
				this.success.ngOnInit();
			});
      window.alert(data)
		});
	
	}
}
