import { Routes } from '@angular/router';

//pages
import { ListComponent } from './modulos/lista-de-tarefas/pages/list/list.component';

export const routes: Routes = [
    {
        path: '',
        component: ListComponent,
    },
];
