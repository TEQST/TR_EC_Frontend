import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TranscribePageRoutingModule } from './transcribe-routing.module';

import { TranscribePage } from './transcribe.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranscribePageRoutingModule
  ],
  declarations: [TranscribePage]
})
export class TranscribePageModule {}
