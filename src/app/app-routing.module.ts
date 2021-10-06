import { NgModule } from '@angular/core';
import {AuthPageModule} from './auth/auth.module';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: (): Promise<AuthPageModule> => import('./auth/auth.module')
        .then((m) => m.AuthPageModule),
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
