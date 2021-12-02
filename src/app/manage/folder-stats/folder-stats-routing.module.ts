import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FolderStatsPage } from './folder-stats.page';

const routes: Routes = [
  {
    path: '',
    component: FolderStatsPage
  },
  {
    path: 'editor-list',
    loadChildren: () => import('./editor-list/editor-list.module').then( m => m.EditorListPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FolderStatsPageRoutingModule {}
