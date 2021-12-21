import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule}  from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SuccefullComponent } from './succefull/succefull.component';
import { AuthGuard } from './auth.guard';
import { UnsuccessComponent } from './unsuccess/unsuccess.component';
import { FormsModule } from '@angular/forms';
import { EditComponent } from './edit/edit.component';
import { CreateComponent } from './create/create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DisconnectedComponent } from './disconnected/disconnected.component';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SuccefullComponent,
    UnsuccessComponent,
    EditComponent,
    CreateComponent,
    DisconnectedComponent,
   
    
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
    
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
