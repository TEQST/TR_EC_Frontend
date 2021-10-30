import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManagePageRoutingModule } from './manage-routing.module';

import { ManagePage } from './manage.page';
import { CreateFolderPageModule } from './create-folder/create-folder.module';
import { CreateTranscriptionPageModule } from './create-transcription/create-transcription.module';
import { ShareFolderPageModule } from './share-folder/share-folder.module';
import { TranscriptionDetailPageModule } from './transcription-detail/transcription-detail.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManagePageRoutingModule,
    CreateFolderPageModule,
    CreateTranscriptionPageModule,
    ShareFolderPageModule,
    TranscriptionDetailPageModule
  ],
  declarations: [ManagePage]
})
export class ManagePageModule {}
