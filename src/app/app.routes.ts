// app.routes.ts

import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './componets/pages/dashboard/dashboard.component';
import { EquipamentosComponent } from './componets/pages/equipamentos/equipamentos.component';
import { AlertasComponent } from './componets/pages/alertas/alertas.component';
import { RelatoriosComponent } from './componets/pages/relatorio/relatorio.component';




export const routes: Routes = [
  {
    // Rota principal que usa o LayoutComponent
    path: '',
    component: LayoutComponent,
    children: [
      // Rotas filhas que serão renderizadas dentro do <router-outlet>
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Redireciona para o dashboard
      { path: 'dashboard', component: DashboardComponent },
      { path: 'equipamentos', component: EquipamentosComponent },
      { path: 'alertas', component: AlertasComponent },
      { path: 'relatorios', component: RelatoriosComponent },
    ]
  },
  // Você pode ter outras rotas fora desse layout, como uma página de login
  // { path: 'login', component: LoginComponent },
];
