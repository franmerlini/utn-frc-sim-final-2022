import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Cola } from 'src/app/models/cola';
import { Evento } from 'src/app/models/evento';
import { Objeto } from 'src/app/models/objeto';
import { AnalisisService } from 'src/app/services/analisis.service';

@Component({
  selector: 'app-enunciado',
  templateUrl: './enunciado.component.html',
  styleUrls: ['./enunciado.component.scss'],
})
export class EnunciadoComponent implements OnInit {
  public displayedColumnsEvents: string[] = [
    'evento',
    'distribucion',
    'formula',
  ];
  public dataSourceEvents: MatTableDataSource<Evento>;
  public displayedColumnsObjects: string[] = ['objeto', 'tipo', 'estado'];
  public dataSourceObjects: MatTableDataSource<Objeto>;
  public displayedColumnsQueues: string[] = ['cola'];
  public dataSourceQueues: MatTableDataSource<Cola>;

  constructor(private analisisService: AnalisisService) {}

  ngOnInit(): void {
    this.analisisService.getEvents().subscribe((res) => {
      this.dataSourceEvents = new MatTableDataSource(res);
    });
    this.analisisService.getObjects().subscribe((res) => {
      this.dataSourceObjects = new MatTableDataSource(res);
    });
    this.analisisService.getQueues().subscribe((res) => {
      this.dataSourceQueues = new MatTableDataSource(res);
    });
  }
}
