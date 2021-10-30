import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateTranscriptionPageRoutingModule } from './create-transcription-routing.module';

import { CreateTranscriptionPage } from './create-transcription.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateTranscriptionPageRoutingModule
  ],
  declarations: [CreateTranscriptionPage]
})
export class CreateTranscriptionPageModule {}
