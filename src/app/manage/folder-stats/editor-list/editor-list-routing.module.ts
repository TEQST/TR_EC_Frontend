import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditorListPage } from './editor-list.page';

const routes: Routes = [
  {
    path: '',
    component: EditorListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditorListPageRoutingModule {}
