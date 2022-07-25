import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnunciadoComponent } from './components/enunciado/enunciado.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { SimulacionComponent } from './components/simulacion/simulacion.component';

const routes: Routes = [
  { path: 'inicio', component: InicioComponent },
  { path: 'enunciado', component: EnunciadoComponent },
  { path: 'simulacion', component: SimulacionComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'inicio' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
