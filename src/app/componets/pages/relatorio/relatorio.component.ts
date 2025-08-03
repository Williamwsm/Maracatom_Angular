import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe, CurrencyPipe } from '@angular/common';
import { RelatorioService, ReportPackage } from '../../../service/relatorio.service'; // Ajuste o caminho se necessário

type ReportTab = 'Consumo' | 'Temperatura' | 'Custos';

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [CommonModule, DecimalPipe, CurrencyPipe],
  templateUrl: './relatorio.component.html',
  styleUrls: ['./relatorio.component.css']
})
export class RelatoriosComponent implements OnInit {

  activeTab: ReportTab = 'Consumo';
  activePeriod: '7dias' | 'Mensal' = '7dias';
  chartTitle = 'Últimos 7 dias';

  // Propriedades para os dados da tela
  reportPackage: ReportPackage | null = null;
  isLoading = true;

  constructor(private relatorioService: RelatorioService) { }

  ngOnInit(): void {
    this.loadReportData(this.activePeriod);
  }

  loadReportData(period: '7dias' | 'Mensal'): void {
    this.isLoading = true;
    this.activePeriod = period;
    this.chartTitle = period === '7dias' ? 'Últimos 7 dias' : 'Últimos 30 dias';

    this.relatorioService.getReportData(period).subscribe(report => {
      this.reportPackage = report;
      this.isLoading = false;
    });
  }

  selectTab(tab: ReportTab): void {
    this.activeTab = tab;
  }
}
