import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TranscriptionDetailPage } from './transcription-detail.page';

const routes: Routes = [
  {
    path: '',
    component: TranscriptionDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TranscriptionDetailPageRoutingModule {}
