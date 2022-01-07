import { RouterModule, Routes } from '@angular/router';
import { ChannelComponent } from './channel/channel.component';
import { DataPointComponent } from './data-point/data-point.component';
import { DeviceComponent } from './device/device.component';
import { DevicesComponent } from './devices/devices.component';
import { FunctionComponent } from './function/function.component';
import { FunctionsComponent } from './functions/functions.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { ProgramComponent } from './program/program.component';
import { ProgramsComponent } from './programs/programs.component';
import { RoomComponent } from './room/room.component';
import { RoomsComponent } from './rooms/rooms.component';
import { SysVarComponent } from './sysvar/sysvar.component';
import { SysVarsComponent } from './sysvars/sysvars.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'device', component: DevicesComponent },
  { path: 'device/:deviceAddress', component: DeviceComponent },
  { path: 'device/:deviceAddress/:channelAddress', component: ChannelComponent },
  { path: 'device/:deviceAddress/:channelAddress/:dataPointAddress', component: DataPointComponent },
  { path: 'room', component: RoomsComponent },
  { path: 'room/:roomAddress', component: RoomComponent },
  { path: 'function', component: FunctionsComponent },
  { path: 'function/:functionAddress', component: FunctionComponent },
  { path: 'program', component: ProgramsComponent },
  { path: 'program/:programAddress', component: ProgramComponent },
  { path: 'sysvar', component: SysVarsComponent },
  { path: 'sysvar/:sysVarAddress', component: SysVarComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
