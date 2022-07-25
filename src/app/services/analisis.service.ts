import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Cola } from '../models/cola';
import { Evento } from '../models/evento';
import { Objeto } from '../models/objeto';

@Injectable({
  providedIn: 'root',
})
export class AnalisisService {
  private EVENTOS: Evento[] = [
    {
      id: 1,
      nombre: 'llegada persona',
      distribucion: 'poisson (media = 60)',
      formula: '(ver algorítmo)',
    },
    {
      id: 2,
      nombre: 'fin actualizacion',
      distribucion: 'exp neg (media = 40)',
      formula: 'X = -40 * ln (1 - RND)',
    },
    {
      id: 3,
      nombre: 'fin informacion',
      distribucion: 'cte (20)',
      formula: 'X = 20',
    },
    {
      id: 4,
      nombre: 'fin cobro',
      distribucion: 'uniforme (a = 15, b = 25)',
      formula: 'X = 15 + RND * (25 - 15)',
    },
  ];

  private OBJETOS: Objeto[] = [
    {
      nombre: 'persona',
      tipo: 'temporal',
      estado: [
        'siendo atendida en caja cobro <N> (SA CC<N>)',
        ' siendo atendida en caja actualizacion (SA CA)',
        ' siendo atendida en caja informacion (SA CI)',
        ' esperando atencion en caja cobro (EA CC)',
        ' esperando atencion en caja actualizacion (EA CA)',
        ' esperando atencion en caja informacion (EA CI)',
      ],
    },
    {
      nombre: 'caja actualizacion',
      tipo: 'permanente',
      estado: ['libre', ' ocupado'],
    },
    {
      nombre: 'caja informacion',
      tipo: 'permanente',
      estado: ['libre', ' ocupado'],
    },
    {
      nombre: `caja cobro <N> (N = 1, 2, 3)`,
      tipo: 'permanente',
      estado: ['libre', ' ocupado'],
    },
  ];

  private COLAS: Cola[] = [
    {
      nombre: 'cola actualizacion',
    },
    {
      nombre: 'cola informacion',
    },
    {
      nombre: 'cola cobro',
    },
  ];

  constructor() {}

  getEvents(): Observable<Evento[]> {
    return of(this.EVENTOS);
  }

  getObjects(): Observable<Objeto[]> {
    return of(this.OBJETOS);
  }

  getQueues(): Observable<Cola[]> {
    return of(this.COLAS);
  }
}
