import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { CdkTableModule } from '@angular/cdk/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableExporterModule } from 'mat-table-exporter';
import { ControlMessagesComponent } from './custom-validators/control-messages.component';

@NgModule({
  declarations: [ControlMessagesComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatDividerModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatTableExporterModule,
    MatIconModule,
    CdkTableModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatDividerModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatTableExporterModule,
    MatIconModule,
    CdkTableModule,
    MatProgressSpinnerModule,
    ControlMessagesComponent,
  ],
})
export class SharedModule {}
