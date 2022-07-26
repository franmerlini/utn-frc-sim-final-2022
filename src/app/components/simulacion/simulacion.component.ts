import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { COLUMNS_WITH_BORDER } from 'src/app/consts/consts';
import { Fila } from 'src/app/models/fila';
import { HeaderColumn } from 'src/app/models/header-column';
import { HeaderGroupColumn } from 'src/app/models/header-group-column';
import { ColumnsService } from 'src/app/services/columns.service';
import { SimulationService } from 'src/app/services/simulation.service';
import { CustomValidators } from 'src/app/shared/custom-validators/custom-validators';

@Component({
  selector: 'app-simulacion',
  templateUrl: './simulacion.component.html',
  styleUrls: ['./simulacion.component.scss'],
})
export class SimulacionComponent implements OnInit {
  @ViewChild(FormGroupDirective) formRef: FormGroupDirective;

  public form: FormGroup;
  public loading: boolean = true;
  public dataSource: MatTableDataSource<any>;
  public columns: HeaderColumn[];
  public displayedColumns: string[];
  public headerGroupColumns: HeaderGroupColumn[];
  public displayedHeaderGroupColumns: string[] = [];
  public clickedRows = new Set<Fila>();
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
        const [filas, consignas, idPrimerPersona, idUltimaPersona] =
          this.simulationService.simulate(
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

        this.columnsService.addHeaderGroupColumn({
          columnDef: 'personas',
          header: 'Personas',
          colspan: idUltimaPersona * 2,
        });

        for (let i = idPrimerPersona; i <= idUltimaPersona; i++) {
          let columnDef = `estadoP${i}`;
          this.columnsService.addColumn({
            columnDef,
            header: `Estado P${i}`,
            cell: (fila: any, columnDef: string) => {
              if (fila[columnDef] !== '') {
                return fila[columnDef];
              } else {
                return '';
              }
            },
          });

          columnDef = `tiempoLlegadaP${i}`;
          this.columnsService.addColumn({
            columnDef,
            header: `Tiempo llegada P${i}`,
            cell: (fila: any, columnDef: string) => {
              if (fila[columnDef] !== '') {
                return fila[columnDef];
              } else {
                return '';
              }
            },
          });
        }

        this.columnsService.getHeaderGroupColumns().subscribe((data) => {
          this.headerGroupColumns = data;
          this.columnsService.addDisplayedHeaderGroupColumn(
            this.headerGroupColumns.map((c) => c.columnDef)
          );
        });

        this.columnsService
          .getDisplayedHeaderGroupColumns()
          .subscribe((data) => {
            this.displayedHeaderGroupColumns = data;
          });

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
        this.loading = false;
      } catch (e) {
        console.error(e);
        this.snackBar.open(
          '¡Ooops! Algo no funcionó como se esperaba.',
          'Cerrar',
          {
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['snackbar-error'],
          }
        );
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

  public isSticky(column: HeaderColumn): boolean {
    return (
      column.columnDef === 'n' ||
      column.columnDef === 'evento' ||
      column.columnDef === 'reloj'
    );
  }

  public needsBorder(column: HeaderColumn): boolean {
    return (
      COLUMNS_WITH_BORDER.some((c) => c === column.columnDef) ||
      column.header.startsWith('Estado')
    );
  }

  public onRowClicked(row: Fila): void {
    if (this.clickedRows.has(row)) {
      this.clickedRows.delete(row);
    } else {
      this.clickedRows.add(row);
    }
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
