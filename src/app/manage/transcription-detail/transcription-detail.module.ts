import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TranscriptionDetailPageRoutingModule } from './transcription-detail-routing.module';

import { TranscriptionDetailPage } from './transcription-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranscriptionDetailPageRoutingModule
  ],
  declarations: [TranscriptionDetailPage]
})
export class TranscriptionDetailPageModule {}
