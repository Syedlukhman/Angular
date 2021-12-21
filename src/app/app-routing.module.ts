import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import {SuccefullComponent} from './succefull/succefull.component'
import {UnsuccessComponent} from './unsuccess/unsuccess.component'
import {EditComponent} from './edit/edit.component';
import {CreateComponent} from './create/create.component'
import {DisconnectedComponent } from './disconnected/disconnected.component'


const routes: Routes = [
  {
    path: 'succefull',
    component:SuccefullComponent,
    children:[ {
      path:'edit/:email',
      component:EditComponent,
    },
    {
      path:'create',
      component:CreateComponent,
    },
    
    {
      path:'disconnected',
      component:DisconnectedComponent
    }
  ],
   
   },
   {
    path:'unsuccess',
    component:UnsuccessComponent
  }
  //  {
  //    path: '',
  //    redirectTo:''
  //  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    onSameUrlNavigation:'reload'
  })],
  exports: [RouterModule]

})
export class AppRoutingModule { }