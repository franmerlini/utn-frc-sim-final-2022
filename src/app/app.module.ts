import { NgModule } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EnunciadoComponent } from './components/enunciado/enunciado.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { SimulacionComponent } from './components/simulacion/simulacion.component';
import { MyCustomPaginatorIntl } from './shared/custom-paginator/custom-paginator';
import { FooterComponent } from './shared/footer/footer.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    InicioComponent,
    EnunciadoComponent,
    SimulacionComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl }],
  bootstrap: [AppComponent],
})
export class AppModule {}
