import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { format } from 'date-fns';

// Interfaces para a nova estrutura de dados
export interface DailyReportData {
  date: string;
  consumo: number;
  eficiencia: number;
  statusConsumo: 'Excelente' | 'Bom' | 'Atenção';
  temperatura: number;
  statusTemperatura: 'Ideal' | 'Alto';
  custoDiario: number;
  custoKwh: number;
  comparacaoCustos: 'Alto' | 'Normal';
}

export interface ReportSummary {
  maiorConsumo: { value: number; date: string };
  menorConsumo: { value: number; date: string };
  temperaturaMaisAlta: { value: number; date: string };
  melhorEficiencia: { value: number; date: string };
}

export interface ReportPackage {
  header: {
    consumoTotal: number;
    economiaTotal: number;
    temperaturaMedia: number;
    eficienciaMedia: number;
  };
  dailyData: DailyReportData[];
  summary: ReportSummary;
}

@Injectable({
  providedIn: 'root'
})
export class RelatorioService {

  constructor() { }

  getReportData(period: '7dias' | 'Mensal'): Observable<ReportPackage> {
    const days = period === '7dias' ? 7 : 30;
    const dailyData: DailyReportData[] = [];

    // Gera dados diários aleatórios
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const consumo = Math.floor(Math.random() * (410 - 320 + 1)) + 320;
      const temperatura = parseFloat((Math.random() * (25.8 - 23.5) + 23.5).toFixed(1));
      const eficiencia = Math.floor(Math.random() * (95 - 70 + 1)) + 70;
      const custoKwh = 0.25;
      const custoDiario = consumo * custoKwh;

      dailyData.push({
        date: format(date, 'dd/MM'),
        consumo,
        eficiencia,
        statusConsumo: eficiencia > 88 ? 'Excelente' : (eficiencia > 78 ? 'Bom' : 'Atenção'),
        temperatura,
        statusTemperatura: temperatura < 25 ? 'Ideal' : 'Alto',
        custoDiario,
        custoKwh,
        comparacaoCustos: custoDiario > 95 ? 'Alto' : 'Normal',
      });
    }

    // Calcula os totais e as médias para o cabeçalho
    const consumoTotal = dailyData.reduce((sum, day) => sum + day.consumo, 0);
    const economiaTotal = dailyData.reduce((sum, day) => sum + day.custoDiario, 0) * 0.11; // Simula 11% de economia
    const temperaturaMedia = dailyData.reduce((sum, day) => sum + day.temperatura, 0) / days;
    const eficienciaMedia = dailyData.reduce((sum, day) => sum + day.eficiencia, 0) / days;

    // Calcula o resumo do período
    const sortedByConsumo = [...dailyData].sort((a, b) => a.consumo - b.consumo);
    const sortedByTemp = [...dailyData].sort((a, b) => a.temperatura - b.temperatura);
    const sortedByEficiencia = [...dailyData].sort((a, b) => a.eficiencia - b.eficiencia);

    const summary: ReportSummary = {
      maiorConsumo: { value: sortedByConsumo[sortedByConsumo.length - 1].consumo, date: sortedByConsumo[sortedByConsumo.length - 1].date },
      menorConsumo: { value: sortedByConsumo[0].consumo, date: sortedByConsumo[0].date },
      temperaturaMaisAlta: { value: sortedByTemp[sortedByTemp.length - 1].temperatura, date: sortedByTemp[sortedByTemp.length - 1].date },
      melhorEficiencia: { value: sortedByEficiencia[sortedByEficiencia.length - 1].eficiencia, date: sortedByEficiencia[sortedByEficiencia.length - 1].date },
    };

    const reportPackage: ReportPackage = {
      header: {
        consumoTotal,
        economiaTotal,
        temperaturaMedia,
        eficienciaMedia,
      },
      dailyData,
      summary,
    };

    return of(reportPackage);
  }
}
