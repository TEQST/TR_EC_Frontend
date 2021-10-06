import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';

import {AccessGuard} from '../auth/access.guard';
import {TabsPage} from './tabs.page';
import {RouterModule, Routes} from '@angular/router';
import {ManagePageModule} from '../manage/manage.module';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: '/tabs/transcribe',
        pathMatch: 'full',
      },
      {
        path: 'transcribe',
        loadChildren: ()
        :Promise<TranscribePageModule> => import('../transcribe/transcribe.module')
            .then((m) => m.TranscribePageModule),
        data: {requiresLogin: true},
        canActivate: [AccessGuard],
      },
      {
        path: 'manage',
        loadChildren: ()
        :Promise<ManagePageModule> => import('../manage/manage.module')
            .then((m) => m.ManagePageModule),
        data: {requiresLogin: true, requiredRole: 'publisher'},
        canActivate: [AccessGuard],
      }
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/transcribe',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [TabsPage],
})
export class TabsPageModule {}
