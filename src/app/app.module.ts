import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { GroupsComponent } from './groups/groups.component';
import { EditGroupComponent } from './edit-group/edit-group.component';
import { HomeComponent } from './home/home.component';
import { AddChannelComponent } from './add-channel/add-channel.component';
import { EditChannelComponent } from './edit-channel/edit-channel.component';

@NgModule({
  declarations: [AppComponent, GroupsComponent, EditGroupComponent, HomeComponent, AddChannelComponent, EditChannelComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
