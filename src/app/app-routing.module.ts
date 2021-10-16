import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';

import {AccessGuard} from './auth/access.guard';
import {AuthPageModule} from './auth/auth.module';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {TabsPageModule} from './tabs/tabs.module';

const routes: Routes = [
  {
    path: 'tabs',
    loadChildren: (): Promise<TabsPageModule> => import('./tabs/tabs.module')
        .then((m) => m.TabsPageModule),
  },
  {
    path: '',
    loadChildren: (): Promise<AuthPageModule> => import('./auth/auth.module')
        .then((m) => m.AuthPageModule),
    data: {redirectIfLoggedIn: true},
    canActivate: [AccessGuard],
  },
  {
    path: '**',
    component: PageNotFoundComponent,
    data: {requiresLogin: true},
    canActivate: [AccessGuard],
  },
  {
    path: 'transcribe',
    loadChildren: () => import('./transcribe/transcribe.module').then( m => m.TranscribePageModule)
  },
  {
    path: 'edit',
    loadChildren: () => import('./edit/edit.module').then( m => m.EditPageModule)
  },
  {
    path: 'manage',
    loadChildren: () => import('./manage/manage.module').then( m => m.ManagePageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules}),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
