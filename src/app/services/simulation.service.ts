import { Injectable } from '@angular/core';
import { VECTOR_ESTADO_LENGTH } from '../consts/consts';
import { Operaciones } from '../enums/operaciones';
import { Caja } from '../models/caja';
import { CajaActualizacion } from '../models/caja-actualizacion';
import { CajaCobro } from '../models/caja-cobro';
import { CajaInformacion } from '../models/caja-informacion';
import { Estado } from '../models/estado';
import { Fila } from '../models/fila';
import { Persona } from '../models/persona';

@Injectable({
  providedIn: 'root',
})
export class SimulationService {
  private ESTADOS_EA: Estado = {
    actualizacion: 'EA (CA)',
    cobro: 'EA (CC)',
    informacion: 'EA (CI)',
  };
  private ESTADOS_SA: Estado = {
    actualizacion: 'SA (CA)',
    cobro: (cajaCobro: CajaCobro) => `SA (CC${cajaCobro.id - 2})`,
    informacion: 'SA (CI)',
  };
  private operacionesEnum = Operaciones;

  simulate(
    x: number,
    n: number,
    desde: number,
    hasta: number,
    probVencida: number,
    probActualiza: number,
    probPaga: number,
    mediaPoisson: number,
    aUniforme: number,
    bUniforme: number,
    mediaExpNeg: number,
    cte: number
  ): [Fila[], number, string[], number, number] {
    let evento = '';
    let reloj = -1;
    let llegada = -1;
    let proximaLlegada = -1;
    let rndVencida = -1;
    let vencida: string | boolean = '';
    let rndActualiza = -1;
    let actualiza: string | boolean = '';
    let rndActualiza2 = -1;
    let actualizacion = -1;
    let proximaActualizacion = -1;
    let proximaInformacion = -1;
    let rndPaga = -1;
    let paga: string | boolean = '';
    let rndCobro = -1;
    let cobro = -1;
    let proximoCobro = -1;
    let caja1 = new CajaActualizacion(1, 'libre');
    let caja2 = new CajaInformacion(2, 'libre');
    let caja3 = new CajaCobro(3, 'libre', -1);
    let caja4 = new CajaCobro(4, 'libre', -1);
    let caja5 = new CajaCobro(5, 'libre', -1);
    let colaActualizacion = 0;
    let colaInformacion = 0;
    let colaCobro = 0;
    let acumPersonasNoPagan = 0;
    let acumTiempoPermanPersonas = 0;
    let cantPersonas = 0;
    let acumTiempoEsperaColaCobro = 0;
    let cantPersonasEsperaColaCobro = 0;

    let persona = new Persona(0, '', 0);

    let vectorEstado = [];

    // variables ausiliares
    let personas: Persona[] = [];
    let filas: Fila[] = [];
    let esPrimerPersona: boolean = true;
    let idPrimerPersona: number = 0;
    let idUltimaPersona: number = 0;

    for (let i = 0; i < n; i++) {
      // sirve para determinar si se crea un objeto Persona
      let existePersona: boolean = false;

      // Evento 1: inicio de la simulacion
      if (i === 0) {
        reloj = 0;
        evento = 'Inicialización';
        llegada = this.poisson(mediaPoisson);
        proximaLlegada = reloj + llegada;
      }

      // Evento 2: llegada de la primer persona
      else if (i === 1) {
        cantPersonas++;
        evento = `Llegada P${cantPersonas}`;
        vectorEstado[4] && (reloj = +vectorEstado[4]);

        // generar la proxima llegada
        llegada = this.poisson(mediaPoisson);
        proximaLlegada = reloj + llegada;

        // determinar si tiene factura vencida
        rndVencida = +Math.random().toFixed(2);
        vencida = this.determineBooleanResult(probVencida, rndVencida);

        // Caso 1): factura NO vencida
        // Respuesta: ir a pagar
        if (!vencida) {
          // generar cobro
          rndCobro = +Math.random().toFixed(2);
          cobro = this.uniform(aUniforme, bUniforme, rndCobro);
          proximoCobro = reloj + cobro;

          // ocupar alguna de las cajas de cobro (caja3, caja4 o caja5) --> por defecto se ocupa la caja3
          caja3.ocupar(proximoCobro);

          // crear el objeto Persona con el estado 'SA (CC3)' (siendo atendida en caja cobro 3)
          persona = this.crearPersona(
            cantPersonas,
            caja3,
            reloj,
            this.operacionesEnum.COBRO
          );
        }

        // Caso 2): factura vencida
        // Respuesta: ir a actualizar o ir a informarse
        else {
          // determinar si sabe actualizar
          rndActualiza = +Math.random().toFixed(2);
          actualiza = this.determineBooleanResult(probActualiza, rndActualiza);

          // Caso 2.1): sabe actualizar
          // Respuesta: ir a actualizar
          if (actualiza) {
            // determinar proxima actualizacion
            rndActualiza2 = +Math.random().toFixed(2);
            actualizacion = this.negativeExponential(
              mediaExpNeg,
              rndActualiza2
            );
            proximaActualizacion = reloj + actualizacion;

            // ocupar la caja de actualizacion (caja1)
            caja1.ocupar();

            // crear el objeto Persona con el estado 'SA (CA)' (siendo atendida en caja actualizacion)
            persona = this.crearPersona(
              cantPersonas,
              caja1,
              reloj,
              this.operacionesEnum.ACTUALIZACION
            );
          }

          // Caso 2.2): NO sabe actualizar
          // Respuesta: ir a informarse
          else {
            // determinar proxima informacion
            proximaInformacion = reloj + cte;

            // ocupar la caja de informacion (caja2)
            caja2.ocupar();

            // crear el objeto Persona con el estado 'SA (CI)' (siendo atendida en caja informacion)
            persona = this.crearPersona(
              cantPersonas,
              caja2,
              reloj,
              this.operacionesEnum.INFORMACION
            );
          }
        }

        existePersona = true;
        personas.push(persona);
      }

      // Evento 3 en adelante: resto de la simulacion
      else {
        let tiempos = [];
        if (typeof proximaLlegada === 'number' && proximaLlegada > -1) {
          tiempos.push([proximaLlegada, 0]);
        }
        if (
          typeof proximaActualizacion === 'number' &&
          proximaActualizacion > -1
        ) {
          tiempos.push([proximaActualizacion, 1]);
        }
        if (typeof proximaInformacion === 'number' && proximaInformacion > -1) {
          tiempos.push([proximaInformacion, 2]);
        }
        if (
          typeof caja3.proximoFinCobro === 'number' &&
          caja3.proximoFinCobro > -1
        ) {
          tiempos.push([caja3.proximoFinCobro, 3]);
        }
        if (
          typeof caja4.proximoFinCobro === 'number' &&
          caja4.proximoFinCobro > -1
        ) {
          tiempos.push([caja4.proximoFinCobro, 4]);
        }
        if (
          typeof caja5.proximoFinCobro === 'number' &&
          caja5.proximoFinCobro > -1
        ) {
          tiempos.push([caja5.proximoFinCobro, 5]);
        }

        let menor = tiempos[0][0];
        let idx = 0;
        for (let i = 0; i < tiempos.length; i++) {
          if (tiempos[i][0] < menor) {
            menor = tiempos[i][0];
            idx = tiempos[i][1];
          }
        }

        // Determinar cual evento es el siguiente
        switch (idx) {
          case 0:
            cantPersonas++;
            evento = `Llegada P${cantPersonas}`;
            vectorEstado[4] && (reloj = +vectorEstado[4]);

            // generar la proxima llegada
            llegada = this.poisson(mediaPoisson);
            proximaLlegada = reloj + llegada;

            // determinar si tiene factura vencida
            rndVencida = +Math.random().toFixed(2);
            vencida = this.determineBooleanResult(probVencida, rndVencida);

            // Caso 1): factura NO vencida
            // Respuesta: ir a pagar
            if (!vencida) {
              // Caso 1.1): alguna caja de cobro libre
              if (caja3.estaLibre() || caja4.estaLibre() || caja5.estaLibre()) {
                // generar cobro
                rndCobro = +Math.random().toFixed(2);
                cobro = this.uniform(aUniforme, bUniforme, rndCobro);
                proximoCobro = reloj + cobro;

                let cajaLibre: CajaCobro;

                if (caja3.estaLibre()) {
                  cajaLibre = caja3;
                } else if (caja4.estaLibre()) {
                  cajaLibre = caja4;
                } else {
                  cajaLibre = caja5;
                }

                // ocupar la caja que corresponda
                cajaLibre.ocupar(proximoCobro);

                // crear el objeto Persona con el estado 'SA (CC${cajaLibre.id - 2})' (siendo atendida en caja cobro ${cajaLibre.id - 2})
                persona = this.crearPersona(
                  cantPersonas,
                  cajaLibre,
                  reloj,
                  this.operacionesEnum.COBRO
                );
              }

              // Caso 1.2): ninguna caja de cobro libre
              else {
                // no generar cobro
                rndCobro = -1;
                cobro = -1;
                proximoCobro = -1;

                // incrementar la cola de cobro
                colaCobro++;

                // incrementar el acumulador de personas en espera caja cobro
                cantPersonasEsperaColaCobro++;

                // crear el objeto Persona con el estado 'EA (CC)' (esperando atencion caja cobro)
                persona = this.crearPersona(
                  cantPersonas,
                  null,
                  reloj,
                  this.operacionesEnum.COBRO
                );
              }

              // no generar actualizacion
              rndActualiza = -1;
              actualiza = '';
              rndActualiza2 = -1;
              actualizacion = -1;
            }

            // Caso 2): factura vencida
            // Respuesta: ir a actualizar o ir a informarse
            else {
              // determinar si sabe actualizar
              rndActualiza = +Math.random().toFixed(2);
              actualiza = this.determineBooleanResult(
                probActualiza,
                rndActualiza
              );

              // Caso 2.1): sabe actualizar
              // Respuesta: ir a actualizar
              if (actualiza) {
                // Caso 2.1.1): caja de actualizacion libre
                if (caja1.estaLibre()) {
                  // determinar proxima actualizacion
                  rndActualiza2 = +Math.random().toFixed(2);
                  actualizacion = this.negativeExponential(
                    mediaExpNeg,
                    rndActualiza2
                  );
                  proximaActualizacion = reloj + actualizacion;

                  // ocupar la caja de actualizacion (caja1)
                  caja1.ocupar();

                  // crear el objeto Persona con el estado 'SA (CA)' (siendo atendida en caja actualizacion)
                  persona = this.crearPersona(
                    cantPersonas,
                    caja1,
                    reloj,
                    this.operacionesEnum.ACTUALIZACION
                  );
                }

                // Caso 2.1.2): caja de actualizacion ocupada
                else {
                  colaActualizacion++;

                  // crear el objeto Persona con el estado 'EA (CA)' (esperando atencion en caja actualizacion)
                  persona = this.crearPersona(
                    cantPersonas,
                    null,
                    reloj,
                    this.operacionesEnum.ACTUALIZACION
                  );

                  // no generar proxima actualizacion
                  rndActualiza2 = -1;
                  actualizacion = -1;
                }

                // no generar cobro
                rndCobro = -1;
                cobro = -1;
                proximoCobro = -1;
              }

              // Caso 2.2): NO sabe actualizar
              // Respuesta: ir a informarse
              else {
                // Caso 2.2.1): caja de informacion libre
                if (caja2.estaLibre()) {
                  // determinar proxima informacion
                  proximaInformacion = reloj + cte;

                  // ocupar la caja de informacion (caja2)
                  caja2.ocupar();

                  // crear el objeto Persona con el estado 'SA (CI)' (siendo atendida en caja informacion)
                  persona = this.crearPersona(
                    cantPersonas,
                    caja2,
                    reloj,
                    this.operacionesEnum.INFORMACION
                  );
                }

                // Caso 2.2.2): caja de informacion ocupada
                else {
                  colaInformacion++;

                  // crear el objeto Persona con el estado 'EA (CI)' (esperando atencion en caja informacion)
                  persona = this.crearPersona(
                    cantPersonas,
                    null,
                    reloj,
                    this.operacionesEnum.INFORMACION
                  );
                }

                // no generar cobro
                rndCobro = -1;
                cobro = -1;
                proximoCobro = -1;
              }
            }

            // no generar paga
            rndPaga = -1;
            paga = '';

            existePersona = true;
            personas.push(persona);

            break;

          case 1:
            evento = 'Fin actualización';
            vectorEstado[11] && (reloj = +vectorEstado[11]);

            // **************************************************************** Paso 1 ****************************************************************
            // determinar proximo estado de la persona
            // **************************************************************** Paso 1 ****************************************************************

            let personaFinActualizacion;
            for (let i = 0; i < personas.length; i++) {
              if (personas[i].estado === 'SA (CA)') {
                personaFinActualizacion = personas[i];
                break;
              }
            }

            if (personaFinActualizacion) {
              // determinar si paga
              rndPaga = +Math.random().toFixed(2);
              paga = this.determineBooleanResult(probPaga, rndPaga);

              // Caso 1): paga
              // Respuesta: ir a pagar
              if (paga) {
                // Caso 1.1): alguna caja de cobro libre
                if (
                  caja3.estaLibre() ||
                  caja4.estaLibre() ||
                  caja5.estaLibre()
                ) {
                  // determinar proximo cobro
                  rndCobro = +Math.random().toFixed(2);
                  cobro = this.negativeExponential(mediaExpNeg, rndCobro);
                  proximoCobro = reloj + cobro;

                  // determinar caja de cobro libre
                  let cajaLibre: CajaCobro;

                  if (caja3.estaLibre()) {
                    cajaLibre = caja3;
                  } else if (caja4.estaLibre()) {
                    cajaLibre = caja4;
                  } else {
                    cajaLibre = caja5;
                  }

                  // ocupar la caja que corresponda
                  cajaLibre.ocupar(proximoCobro);

                  // actualizar el estado de la persona a 'SA (CC${cajaLibre.id})' (siendo atendida caja cobro {cajaLibre.id})
                  personaFinActualizacion.enAtencionCajaCobro(cajaLibre);

                  // actualizar el vectorEstado
                  this.actualizarVectorEstado(
                    vectorEstado,
                    personaFinActualizacion
                  );
                }

                // Caso 1.2): ninguna caja de cobro libre
                else {
                  // no generar cobro
                  rndCobro = -1;
                  cobro = -1;
                  proximoCobro = -1;

                  // incrementar la cola de cobro
                  colaCobro++;

                  // incrementar el acumulador de personas en espera caja cobro
                  cantPersonasEsperaColaCobro++;

                  // actualizar el estado de la persona a 'EA (CC)' (esperando atencion caja cobro)
                  personaFinActualizacion.enEsperaCajaCobro();

                  // actualizar el vectorEstado
                  this.actualizarVectorEstado(
                    vectorEstado,
                    personaFinActualizacion
                  );
                }
              }

              // Caso 2): NO paga
              // Respuesta: retirarse
              else {
                // incrementar acum personas no pagan
                acumPersonasNoPagan++;

                // acumular el tiempo de permanencia
                acumTiempoPermanPersonas +=
                  reloj - personaFinActualizacion.tiempoLlegada;

                // destruir el objeto Persona
                personaFinActualizacion.destruir();

                // actualizar el vectorEstado
                this.actualizarVectorEstado(
                  vectorEstado,
                  personaFinActualizacion
                );

                // eliminar el objeto Persona del vector
                personas.splice(personas.indexOf(personaFinActualizacion), 1);

                // no generar cobro
                rndCobro = -1;
                cobro = -1;
                proximoCobro = -1;
              }
            }

            // **************************************************************** Paso 2 ****************************************************************
            // determinar si existe alguna persona en cola de actualizacion
            // **************************************************************** Paso 2 ****************************************************************

            // Caso 1): existe alguna persona en cola de actualizacion
            if (colaActualizacion > 0) {
              let siguientePersona;
              for (let i = 0; i < personas.length; i++) {
                if (personas[i].estado === 'EA (CA)') {
                  siguientePersona = personas[i];
                  break;
                }
              }

              if (siguientePersona) {
                // determinar proxima actualizacion
                rndActualiza2 = +Math.random().toFixed(2);
                actualizacion = this.negativeExponential(
                  mediaExpNeg,
                  rndActualiza2
                );
                proximaActualizacion = reloj + actualizacion;

                // ocupar la caja de actualizacion
                caja1.ocupar();

                // actualizar el estado de la persona a 'SA (CA)' (siendo atendida en caja actualizacion)
                siguientePersona.enAtencionCajaActualizacion();

                // actualizar el vectorEstado
                this.actualizarVectorEstado(vectorEstado, siguientePersona);

                // decrementar la cola de actualizacion
                colaActualizacion--;
              }
            }

            // Caso 2): no existe ninguna persona en cola de actualizacion
            else {
              // liberar la caja de actualizacion
              caja1.liberar();

              // actualizar el reloj
              vectorEstado[11] && (reloj = +vectorEstado[11]);

              // no generar proxima actualizacion
              rndActualiza2 = -1;
              actualizacion = -1;
              proximaActualizacion = -1;
            }

            // no generar vencida
            rndVencida = -1;
            vencida = '';

            // no generar actualiza
            rndActualiza = -1;
            actualiza = '';

            // no generar proxima llegada
            llegada = -1;

            break;

          case 2:
            evento = 'Fin información';
            vectorEstado[12] && (reloj = +vectorEstado[12]);

            // **************************************************************** Paso 1 ****************************************************************
            // determinar proximo estado de la persona
            // **************************************************************** Paso 1 ****************************************************************

            let personaFinInformacion;
            for (let i = 0; i < personas.length; i++) {
              if (personas[i].estado === 'SA (CI)') {
                personaFinInformacion = personas[i];
                break;
              }
            }

            if (personaFinInformacion) {
              // Caso 1): caja de actualizacion libre
              if (caja1.estaLibre()) {
                // determinar proxima actualizacion
                rndActualiza2 = +Math.random().toFixed(2);
                actualizacion = this.negativeExponential(
                  mediaExpNeg,
                  rndActualiza2
                );
                proximaActualizacion = reloj + actualizacion;

                // ocupar la caja de actualizacion (caja1)
                caja1.ocupar();

                // actualizar el estado de la persona a 'SA (CA)' (siendo atendida en caja actualizacion)
                personaFinInformacion.enAtencionCajaActualizacion();

                // actualizar el vectorEstado
                this.actualizarVectorEstado(
                  vectorEstado,
                  personaFinInformacion
                );
              }

              // Caso 2): caja de actualizacion ocupada
              else {
                colaActualizacion++;

                // actualizar el estado de la persona a 'EA (CA)' (esperando atencion caja actualizacion)
                personaFinInformacion.enEsperaCajaActualizacion();

                // actualizar el vectorEstado
                this.actualizarVectorEstado(
                  vectorEstado,
                  personaFinInformacion
                );

                // no generar proxima actualizacion
                rndActualiza2 = -1;
                actualizacion = -1;
              }
            }

            // **************************************************************** Paso 2 ****************************************************************
            // determinar si existe alguna persona en cola de informacion
            // **************************************************************** Paso 2 ****************************************************************

            // Caso 1): existe alguna persona en cola de informacion
            if (colaInformacion > 0) {
              let siguientePersona;
              for (let i = 0; i < personas.length; i++) {
                if (personas[i].estado === 'EA (CI)') {
                  siguientePersona = personas[i];
                  break;
                }
              }

              if (siguientePersona) {
                // determinar proxima informacion
                proximaInformacion = reloj + cte;

                // ocupar la caja de informacion
                caja2.ocupar();

                // actualizar el estado de la persona a 'SA (CI)' (siendo atendida en caja informacion)
                siguientePersona.enAtencionCajaInformacion();

                // actualizar el vectorEstado
                this.actualizarVectorEstado(vectorEstado, siguientePersona);

                // decrementar la cola de informacion
                colaInformacion--;
              }
            }

            // Caso 2): no existe ninguna persona en cola de informacion
            else {
              // liberar la caja de informacion
              caja2.liberar();

              // actualizar el reloj
              vectorEstado[12] && (reloj = +vectorEstado[12]);

              // no generar proxima informacion
              proximaInformacion = -1;
            }

            // no generar vencida
            rndVencida = -1;
            vencida = '';

            // no generar actualiza
            rndActualiza = -1;
            actualiza = '';

            // no generar cobro
            rndCobro = -1;
            cobro = -1;
            proximoCobro = -1;

            // no generar proxima llegada
            llegada = -1;

            break;

          case 3:
          case 4:
          case 5:
            let cajaFinCobro: CajaCobro;

            if (idx === 3) {
              cajaFinCobro = caja3;
              evento = 'Fin cobro CC1';
              vectorEstado[21] && (reloj = +vectorEstado[21]);
            } else if (idx === 4) {
              cajaFinCobro = caja4;
              evento = 'Fin cobro CC2';
              vectorEstado[23] && (reloj = +vectorEstado[23]);
            } else {
              cajaFinCobro = caja5;
              evento = 'Fin cobro CC3';
              vectorEstado[25] && (reloj = +vectorEstado[25]);
            }

            // **************************************************************** Paso 1 ****************************************************************
            // determinar proximo estado de la persona
            // **************************************************************** Paso 1 ****************************************************************

            for (let i = 0; i < personas.length; i++) {
              if (personas[i].estado === `SA (CC${cajaFinCobro.id - 2})`) {
                // acumular el tiempo de permanencia
                acumTiempoPermanPersonas += reloj - personas[i].tiempoLlegada;

                // destruir el objeto Persona
                personas[i].destruir();

                // actualizar el vectorEstado
                this.actualizarVectorEstado(vectorEstado, personas[i]);

                // eliminar el objeto Persona del vector
                personas.splice(i, 1);

                break;
              }
            }

            // **************************************************************** Paso 2 ****************************************************************
            // determinar si existe alguna persona en cola de cobro
            // **************************************************************** Paso 2 ****************************************************************

            // Caso 1): existe alguna persona en cola de cobro
            if (colaCobro > 0) {
              let siguientePersona;
              for (let i = 0; i < personas.length; i++) {
                if (personas[i].estado === 'EA (CC)') {
                  siguientePersona = personas[i];
                  break;
                }
              }

              if (siguientePersona) {
                // acumular tiempo de espera en cola de cobro
                acumTiempoEsperaColaCobro +=
                  reloj - siguientePersona.tiempoLlegada;

                // determinar proximo cobro
                rndCobro = +Math.random().toFixed(2);
                cobro = this.uniform(aUniforme, bUniforme, rndCobro);
                proximoCobro = reloj + cobro;

                // ocupar la caja que corresponda
                cajaFinCobro.ocupar(proximoCobro);

                // actualizar el estado de la persona a 'SA (CC${cajaFinCobro.id})' (siendo atendida en caja cobro ${cajaFinCobro.id})
                siguientePersona.enAtencionCajaCobro(cajaFinCobro);

                // actualizar el vectorEstado
                this.actualizarVectorEstado(vectorEstado, siguientePersona);

                // decrementar la cola de cobro
                colaCobro--;
              }
            }

            // Caso 2): no existe ninguna persona en cola de cobro
            else {
              // liberar la caja que corresponda
              cajaFinCobro.liberar();

              // actualizar el reloj segun corresponda
              if (idx === 3) {
                vectorEstado[21] && (reloj = +vectorEstado[21]);
              } else if (idx === 4) {
                vectorEstado[23] && (reloj = +vectorEstado[23]);
              } else {
                vectorEstado[25] && (reloj = +vectorEstado[25]);
              }

              // no generar vencida
              rndVencida = -1;
              vencida = '';

              // no generar actualizacion
              rndActualiza = -1;
              actualiza = '';
              rndActualiza2 = -1;
              actualizacion = -1;

              //no generar paga
              rndPaga = -1;
              paga = '';

              // no generar cobro
              rndCobro = -1;
              cobro = -1;
              proximoCobro = -1;
            }

            // no generar proxima llegada
            llegada = -1;

            break;
        }
      }

      vectorEstado[0] = i + 1;
      vectorEstado[1] = evento;
      vectorEstado[2] = reloj;
      vectorEstado[3] = llegada;
      vectorEstado[4] = proximaLlegada;
      vectorEstado[5] = rndVencida;
      vectorEstado[6] = vencida;
      vectorEstado[7] = rndActualiza;
      vectorEstado[8] = actualiza;
      vectorEstado[9] = rndActualiza2;
      vectorEstado[10] = actualizacion;
      vectorEstado[11] = proximaActualizacion;
      vectorEstado[12] = proximaInformacion;
      vectorEstado[13] = rndPaga;
      vectorEstado[14] = paga;
      vectorEstado[15] = rndCobro;
      vectorEstado[16] = cobro;
      vectorEstado[17] = proximoCobro;
      vectorEstado[18] = caja1.estado;
      vectorEstado[19] = caja2.estado;
      vectorEstado[20] = caja3.estado;
      vectorEstado[21] = caja3.proximoFinCobro;
      vectorEstado[22] = caja4.estado;
      vectorEstado[23] = caja4.proximoFinCobro;
      vectorEstado[24] = caja5.estado;
      vectorEstado[25] = caja5.proximoFinCobro;
      vectorEstado[26] = colaActualizacion;
      vectorEstado[27] = colaInformacion;
      vectorEstado[28] = colaCobro;
      vectorEstado[29] = acumPersonasNoPagan;
      vectorEstado[30] = acumTiempoPermanPersonas;
      vectorEstado[31] = cantPersonas;
      vectorEstado[32] = acumTiempoEsperaColaCobro;
      vectorEstado[33] = cantPersonasEsperaColaCobro;

      // en caso que se haya creado un objeto Persona, se lo agrega al final del vectorEstado
      if (existePersona) {
        vectorEstado.push(persona.estado);
        vectorEstado.push(persona.tiempoLlegada);
        existePersona = false;
      }

      // agregar filas desdeHasta
      if (reloj >= desde && reloj <= hasta) {
        if (esPrimerPersona) {
          idPrimerPersona = persona.id;
          esPrimerPersona = false;
        }
        filas.push(this.transformarVectorEstadoAFila(vectorEstado));
        idUltimaPersona = persona.id;
      }

      //Comparar si el reloj en cada iteracion es mayor que el x ingresado, en ese caso corta la simulacion.
      if (reloj >= x) {
        break;
      }
    }

    // agregar ultima fila en caso que 'hasta' sea menor que la cantidad de filas
    if (hasta < reloj) {
      filas.push(this.transformarVectorEstadoAFila(vectorEstado));
    }

    //Consignas
    let consignas = [];

    // a) El tiempo promedio general de espera en las cajas.
    cantPersonasEsperaColaCobro === 0
      ? consignas.push('0')
      : consignas.push(
          (acumTiempoEsperaColaCobro / cantPersonasEsperaColaCobro).toFixed(2)
        );

    // b) El promedio de permanencia en el sistema de las personas.
    consignas.push((acumTiempoPermanPersonas / cantPersonas).toFixed(2));

    // c) El porcentaje de personas que no pagan.
    consignas.push(((acumPersonasNoPagan / cantPersonas) * 100).toFixed(2));

    return [filas, cantPersonas, consignas, idPrimerPersona, idUltimaPersona];
  }

  private actualizarVectorEstado(vectorEstado: any, persona: Persona) {
    vectorEstado[persona.indice] = persona.estado;
    vectorEstado[persona.indice + 1] = persona.tiempoLlegada;
  }

  private crearPersona(
    id: number,
    caja: Caja | null,
    reloj: number,
    tipoOperacion: string
  ): Persona {
    let estado: string;

    if (caja) {
      tipoOperacion === this.operacionesEnum.COBRO
        ? (estado = this.ESTADOS_SA[tipoOperacion](caja))
        : (estado = this.ESTADOS_SA[tipoOperacion]);
    } else {
      estado = this.ESTADOS_EA[tipoOperacion];
    }

    return new Persona(id, estado, reloj);
  }

  private poisson(mean: number): number {
    let p = 1;
    let x = -1;
    let a = Math.exp(-mean);

    do {
      let u = +Math.random().toFixed(2);
      p *= u;
      x += 1;
    } while (p >= a);

    x == 0 && (x = 1); // hardcodeo para que no devuelva 0

    return x;
  }

  private uniform(a: number, b: number, rnd: number): number {
    return +(a + rnd * (b - a)).toFixed(2);
  }

  private negativeExponential(mean: number, rnd: number): number {
    rnd === 1 && (rnd = 0.5); // hardcodeo para que no de log de 0
    return +(-mean * Math.log(1 - rnd)).toFixed(2);
  }

  private determineBooleanResult(prob: number, rnd: number): boolean {
    return rnd <= prob - 0.01;
  }

  private transformarVectorEstadoAFila(vectorEstado: any): Fila {
    let fila: Fila = {
      n: vectorEstado[0].toString(),
      evento: vectorEstado[1].toString(),
      reloj: vectorEstado[2].toFixed(2),
      llegada: vectorEstado[3] === -1 ? '' : vectorEstado[3].toString(),
      proximaLlegada: vectorEstado[4] === -1 ? '' : vectorEstado[4].toString(),
      rndVencida: vectorEstado[5] === -1 ? '' : vectorEstado[5].toString(),
      vencida: vectorEstado[6] !== '' ? (vectorEstado[6] ? 'Si' : 'No') : '',
      rndActualiza: vectorEstado[7] === -1 ? '' : vectorEstado[7].toString(),
      actualiza: vectorEstado[8] !== '' ? (vectorEstado[8] ? 'Si' : 'No') : '',
      rndActualiza2: vectorEstado[9] === -1 ? '' : vectorEstado[9].toString(),
      actualizacion: vectorEstado[10] === -1 ? '' : vectorEstado[10].toString(),
      proximaActualizacion:
        vectorEstado[11] === -1 ? '' : vectorEstado[11].toFixed(2),
      proximaInformacion:
        vectorEstado[12] === -1 ? '' : vectorEstado[12].toFixed(2),
      rndPaga: vectorEstado[13] === -1 ? '' : vectorEstado[13].toString(),
      paga: vectorEstado[14] !== '' ? (vectorEstado[14] ? 'Si' : 'No') : '',
      rndCobro: vectorEstado[15] === -1 ? '' : vectorEstado[15].toString(),
      cobro: vectorEstado[16] === -1 ? '' : vectorEstado[16].toString(),
      proximoCobro: vectorEstado[17] === -1 ? '' : vectorEstado[17].toFixed(2),
      estadoCajaActualizacion: vectorEstado[18].toString(),
      estadoCajaInformacion: vectorEstado[19].toString(),
      estadoCajaCobro1: vectorEstado[20].toString(),
      proximoFinCobroCajaCobro1:
        vectorEstado[21] === -1 ? '' : vectorEstado[21].toFixed(2),
      estadoCajaCobro2: vectorEstado[22].toString(),
      proximoFinCobroCajaCobro2:
        vectorEstado[23] === -1 ? '' : vectorEstado[23].toFixed(2),
      estadoCajaCobro3: vectorEstado[24].toString(),
      proximoFinCobroCajaCobro3:
        vectorEstado[25] === -1 ? '' : vectorEstado[25].toFixed(2),
      colaActualizacion: vectorEstado[26].toString(),
      colaInformacion: vectorEstado[27].toString(),
      colaCobro: vectorEstado[28].toString(),
      acumPersonasNoPagan: vectorEstado[29].toString(),
      acumTiempoPermanPersonas: vectorEstado[30].toFixed(2),
      cantPersonas: vectorEstado[31].toString(),
      acumTiempoEsperaColaCobro: vectorEstado[32].toFixed(2),
      cantPersonasEsperaColaCobro: vectorEstado[33].toString(),
    };

    let aux: any = {};

    if (vectorEstado.length > VECTOR_ESTADO_LENGTH) {
      let numeroPersona = 0;
      for (let i = VECTOR_ESTADO_LENGTH + 1; i < vectorEstado.length; i += 2) {
        numeroPersona++;
        if (vectorEstado[i] !== '') {
          aux[`estadoP${numeroPersona}`] = vectorEstado[i];
          aux[`tiempoLlegadaP${numeroPersona}`] = vectorEstado[i + 1];
        }
      }
      fila = { ...fila, ...aux };
    }

    return fila;
  }
}
