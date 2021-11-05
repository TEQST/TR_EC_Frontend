import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditPageModule } from 'src/app/edit/edit.module';
import { TextListPage } from './text-list.page';

const routes: Routes = [
  {
    path: '',
    component: TextListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TextListPageRoutingModule {}
