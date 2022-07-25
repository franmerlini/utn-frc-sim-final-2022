import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Column } from 'src/app/models/column';
import { ColumnsService } from 'src/app/services/columns.service';
import { SimulationService } from 'src/app/services/simulation.service';
import { CustomValidators } from 'src/app/shared/custom-validators/custom-validators';

@Component({
  selector: 'app-simulacion',
  templateUrl: './simulacion.component.html',
  styleUrls: ['./simulacion.component.scss'],
})
export class SimulacionComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(FormGroupDirective) formRef: FormGroupDirective;

  public form: FormGroup;
  public loading: boolean = true;
  public dataSource: MatTableDataSource<any>;
  public columns: Column[];
  public displayedColumns: string[];
  public consignas: string[] = [];
  public submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private simulationService: SimulationService,
    private snackBar: MatSnackBar,
    private columnsService: ColumnsService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.suscribeTxtAUniformeChanges();
  }

  private createForm(): void {
    this.form = this.fb.group({
      txtX: ['', [Validators.required, CustomValidators.positiveNumber]],
      txtN: ['', [Validators.required, CustomValidators.positiveNumber]],
      txtDesde: ['', [Validators.required, CustomValidators.positiveNumber]],
      txtHasta: ['', [Validators.required, CustomValidators.positiveNumber]],
      txtProbVencida: ['', [Validators.required, CustomValidators.probability]],
      txtProbActualiza: [
        '',
        [Validators.required, CustomValidators.probability],
      ],
      txtProbPaga: ['', [Validators.required, CustomValidators.probability]],
      txtMediaPoisson: [
        '',
        [Validators.required, CustomValidators.positiveNumber],
      ],
      txtAUniforme: [
        '',
        [Validators.required, CustomValidators.positiveNumber],
      ],
      txtBUniforme: [
        '',
        [Validators.required, CustomValidators.positiveNumber],
      ],
      txtMediaExpNeg: [
        '',
        [Validators.required, CustomValidators.positiveNumber],
      ],
      txtCte: ['', [Validators.required, CustomValidators.positiveNumber]],
    });
  }

  public suscribeTxtAUniformeChanges(): void {
    this.txtAUniforme.valueChanges.subscribe((value) => {
      this.txtBUniforme.clearValidators();
      this.txtBUniforme.addValidators([Validators.required]);
      this.txtBUniforme.addValidators([Validators.min(value)]);
      this.txtBUniforme.updateValueAndValidity();
    });
  }

  public reset(): void {
    this.formRef.resetForm();
    this.columnsService.resetColumns();
    this.loading = true;
    this.submitted = false;
  }

  public simulate(): void {
    this.submitted = true;

    if (this.form.valid) {
      this.loading = true;
      this.columnsService.resetColumns();

      try {
        const [
          filas,
          cantPersonas,
          consignas,
          idPrimerPersona,
          idUltimaPersona,
        ] = this.simulationService.simulate(
          +this.txtX.value,
          +this.txtN.value,
          +this.txtDesde.value,
          +this.txtHasta.value,
          +this.txtProbVencida.value,
          +this.txtProbActualiza.value,
          +this.txtProbPaga.value,
          +this.txtMediaPoisson.value,
          +this.txtAUniforme.value,
          +this.txtBUniforme.value,
          +this.txtMediaExpNeg.value,
          +this.txtCte.value
        );

        this.consignas = consignas;

        for (let i = idPrimerPersona; i <= idUltimaPersona; i++) {
          this.columnsService.addColumn({
            columnDef: `estadoP${i}`,
            header: `Estado P${i}`,
            cell: (fila: any) => {
              const aux = `estadoP${i}`;
              if (fila[aux] !== '') {
                return fila[aux];
              } else {
                return '';
              }
            },
          });

          this.columnsService.addColumn({
            columnDef: `tiempoLlegadaP${i}`,
            header: `Tiempo llegada P${i}`,
            cell: (fila: any) => {
              const aux = `tiempoLlegadaP${i}`;
              if (fila[aux] !== '') {
                return fila[aux];
              } else {
                return '';
              }
            },
          });
        }

        this.columnsService.getColumns().subscribe((data) => {
          this.columns = data;
          this.columnsService.addDisplayedColumn(
            this.columns.map((c) => c.columnDef)
          );
        });

        this.columnsService.getDisplayedColumns().subscribe((data) => {
          this.displayedColumns = data;
        });

        this.dataSource = new MatTableDataSource(filas);
        this.dataSource.paginator = this.paginator;
        this.loading = false;
      } catch (e) {
        console.error(e);
      }
    } else {
      this.snackBar.open(
        'Asegúrese que todos los campos sean correctos.',
        'Cerrar',
        {
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['snackbar-error'],
          duration: 5000,
        }
      );
    }
  }

  public loadDefaultValues(): void {
    this.form.patchValue({
      txtX: 1000,
      txtN: 50,
      txtDesde: 0,
      txtHasta: 1000,
      txtProbVencida: 0.4,
      txtProbActualiza: 0.75,
      txtProbPaga: 0.8,
      txtMediaPoisson: 60,
      txtAUniforme: 15,
      txtBUniforme: 25,
      txtMediaExpNeg: 40,
      txtCte: 20,
    });
  }

  get txtX(): AbstractControl {
    return this.form.get('txtX') as AbstractControl;
  }

  get txtN(): AbstractControl {
    return this.form.get('txtN') as AbstractControl;
  }

  get txtDesde(): AbstractControl {
    return this.form.get('txtDesde') as AbstractControl;
  }

  get txtHasta(): AbstractControl {
    return this.form.get('txtHasta') as AbstractControl;
  }

  get txtProbVencida(): AbstractControl {
    return this.form.get('txtProbVencida') as AbstractControl;
  }

  get txtProbActualiza(): AbstractControl {
    return this.form.get('txtProbActualiza') as AbstractControl;
  }

  get txtProbPaga(): AbstractControl {
    return this.form.get('txtProbPaga') as AbstractControl;
  }

  get txtMediaPoisson(): AbstractControl {
    return this.form.get('txtMediaPoisson') as AbstractControl;
  }

  get txtAUniforme(): AbstractControl {
    return this.form.get('txtAUniforme') as AbstractControl;
  }

  get txtBUniforme(): AbstractControl {
    return this.form.get('txtBUniforme') as AbstractControl;
  }

  get txtMediaExpNeg(): AbstractControl {
    return this.form.get('txtMediaExpNeg') as AbstractControl;
  }

  get txtCte(): AbstractControl {
    return this.form.get('txtCte') as AbstractControl;
  }
}
