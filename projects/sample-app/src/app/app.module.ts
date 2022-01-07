import { CcuJackClientConfiguration, NgxCcuJackClientModule } from 'ngx-ccu-jack-client';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { ChannelComponent } from './channel/channel.component';
import { CommonModule } from '@angular/common';
import { DataPointComponent } from './data-point/data-point.component';
import { DeviceComponent } from './device/device.component';
import { DevicesComponent } from './devices/devices.component';
import { FormsModule } from '@angular/forms';
import { FunctionComponent } from './function/function.component';
import { FunctionsComponent } from './functions/functions.component';
import { HomeComponent } from './home/home.component';
import { MaterialModule } from './material.module';
import { NgModule } from '@angular/core';
import { ProgramComponent } from './program/program.component';
import { ProgramsComponent } from './programs/programs.component';
import { PropertyViewComponent } from './property-view/property-view.component';
import { RefTableComponent } from './ref-table/ref-table.component';
import { RoomComponent } from './room/room.component';
import { RoomsComponent } from './rooms/rooms.component';
import { SysVarComponent } from './sysvar/sysvar.component';
import { SysVarsComponent } from './sysvars/sysvars.component';
import { ValueDialogComponent } from './value-dialog/value-dialog.component';

const ccuJackClientConfiguration: CcuJackClientConfiguration = {
  connectMqttOnInit: true,
  hostnameOrIp: 'your-hostname-or-ip',
  port: 2122,
  secureConnection: true,
  auth: { user: 'your-user', password: 'your-password' }
};

@NgModule({
  declarations: [
    AppComponent,
    ChannelComponent,
    DataPointComponent,
    DeviceComponent,
    DevicesComponent,
    FunctionComponent,
    FunctionsComponent,
    HomeComponent,
    ProgramComponent,
    ProgramsComponent,
    PropertyViewComponent,
    RefTableComponent,
    RoomComponent,
    RoomsComponent,
    SysVarComponent,
    SysVarsComponent,
    ValueDialogComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    MaterialModule,
    NgxCcuJackClientModule.forRoot(ccuJackClientConfiguration)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
