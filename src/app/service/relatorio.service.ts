import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

// A interface permanece a mesma, pois o componente a consome
export interface ReportChartData {
  labels: string[];
  datasets: {
    data: number[];
    label: string;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class RelatorioService {

  private readonly labels = ['22/07', '23/07', '24/07', '25/07', '26/07', '27/07', '28/07'];

  constructor() { }

  getConsumoData(): Observable<ReportChartData> {
    const data: ReportChartData = {
      labels: this.labels,
      datasets: [{
        data: [850, 720, 780, 700, 760, 810, 740],
        label: 'Consumo (kWh)',
      }]
    };
    return of(data);
  }

  getTemperaturaData(): Observable<ReportChartData> {
    const data: ReportChartData = {
      labels: this.labels,
      datasets: [{
        data: [24.5, 24.2, 23.9, 25.1, 24.8, 24.6, 24.7],
        label: 'Temperatura (°C)',
      }]
    };
    return of(data);
  }

  getCustosData(): Observable<ReportChartData> {
    const data: ReportChartData = {
      labels: this.labels,
      datasets: [{
        data: [580, 450, 500, 480, 510, 550, 490],
        label: 'Custos (R$)',
      }]
    };
    return of(data);
  }
}
