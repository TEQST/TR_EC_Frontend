import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditorListPageRoutingModule } from './editor-list-routing.module';

import { EditorListPage } from './editor-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditorListPageRoutingModule
  ],
  declarations: [EditorListPage]
})
export class EditorListPageModule {}
