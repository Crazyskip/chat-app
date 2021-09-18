import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { GroupsComponent } from './components/groups/groups.component';
import { EditGroupComponent } from './components/edit-group/edit-group.component';
import { HomeComponent } from './components/home/home.component';
import { AddChannelComponent } from './components/add-channel/add-channel.component';
import { EditChannelComponent } from './components/edit-channel/edit-channel.component';
import { AddGroupComponent } from './components/add-group/add-group.component';
import { UsersComponent } from './components/users/users.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { MessagingComponent } from './components/messaging/messaging.component';

@NgModule({
  declarations: [
    AppComponent,
    GroupsComponent,
    EditGroupComponent,
    HomeComponent,
    AddChannelComponent,
    EditChannelComponent,
    AddGroupComponent,
    UsersComponent,
    EditUserComponent,
    AddUserComponent,
    MessagingComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
