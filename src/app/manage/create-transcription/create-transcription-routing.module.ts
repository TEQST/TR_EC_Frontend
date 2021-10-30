import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateTranscriptionPage } from './create-transcription.page';

const routes: Routes = [
  {
    path: '',
    component: CreateTranscriptionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateTranscriptionPageRoutingModule {}
