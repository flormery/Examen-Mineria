import { Routes } from '@angular/router';

export const routes: Routes = [
        {
        path: '',
        loadComponent: () =>
           import('../app/noticiasp/noticiass.component').then(m => m.NewsPortalComponent),
},
];
