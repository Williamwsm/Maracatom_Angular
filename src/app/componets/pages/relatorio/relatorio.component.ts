import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { RelatorioService } from '../../../service/relatorio.service'; // Ajuste o caminho se necessário

type ChartSelection = 'Consumo' | 'Temperatura' | 'Custos';

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './relatorio.component.html',
  styleUrls: ['./relatorio.component.css']
})
export class RelatoriosComponent implements OnInit {

  activeChart: ChartSelection = 'Consumo';
  activePeriod: '7dias' | 'Mensal' = '7dias';

  // Propriedades para os dados
  custosData: { name: string; value: number }[] = [];
  consumoData: { name: string; value: number }[] = [];
  temperaturaData: { name: string; value: number }[] = [];

  // Propriedades para os caminhos dos SVGs
  custosMaxValue = 0;
  consumoPath = { area: '', line: '' };
  temperaturaPath = '';

  constructor(private relatorioService: RelatorioService) { }

  ngOnInit(): void {
    // Carrega todos os dados de uma vez para garantir a sincronia
    forkJoin({
      custos: this.relatorioService.getCustosData(),
      consumo: this.relatorioService.getConsumoData(),
      temperatura: this.relatorioService.getTemperaturaData()
    }).subscribe(({ custos, consumo, temperatura }) => {

      // Processa os dados de Custos
      this.custosData = custos.labels.map((label, index) => ({
        name: label,
        value: custos.datasets[0].data[index]
      }));
      this.custosMaxValue = Math.max(...this.custosData.map(d => d.value), 0);

      // Processa os dados de Consumo
      this.consumoData = consumo.labels.map((label, index) => ({
        name: label,
        value: consumo.datasets[0].data[index]
      }));
      this.consumoPath = this.generateSmoothPath(this.consumoData, true);

      // Processa os dados de Temperatura
      this.temperaturaData = temperatura.labels.map((label, index) => ({
        name: label,
        value: temperatura.datasets[0].data[index]
      }));
      this.temperaturaPath = this.generateSmoothPath(this.temperaturaData, false).line;
    });
  }

  selectChart(chartType: ChartSelection): void {
    this.activeChart = chartType;
  }

  /**
   * Gera os caminhos SVG para um gráfico de linha/área suave.
   * @param data Os pontos de dados.
   * @param closePath Se verdadeiro, cria um caminho fechado para um gráfico de área.
   * @returns Um objeto com o caminho da área e da linha.
   */
  private generateSmoothPath(data: { name: string; value: number }[], isArea: boolean): { area: string; line: string } {
    if (data.length === 0) return { area: '', line: '' };

    const width = 700;
    const height = 280;
    const values = data.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    // Adiciona um "respiro" para o gráfico não tocar no topo/fundo
    const range = (max - min) > 0 ? (max - min) * 1.2 : 1;
    const effectiveMin = min - (range * 0.1);

    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((item.value - effectiveMin) / range * height);
      return [x, y];
    });

    const line = points.reduce((path, point, i) => {
      if (i === 0) return `M ${point[0]},${point[1]}`;
      const [cpsX, cpsY] = this.getControlPoint(points, i - 1, 0.25);
      const [cpeX, cpeY] = this.getControlPoint(points, i, 0.25, true);
      return `${path} C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point[0]},${point[1]}`;
    }, '');

    const area = isArea ? `${line} L ${points[points.length - 1][0]},${height + 10} L ${points[0][0]},${height + 10} Z` : '';

    return { area, line };
  }

  /**
   * Calcula os pontos de controle para uma curva de Bézier suave.
   */
  private getControlPoint(points: number[][], i: number, smoothing: number, isEnd?: boolean): [number, number] {
    const prev = points[i - 1] || points[i];
    const curr = points[i];
    const next = points[i + 1] || curr;
    const p = prev;
    const n = next;
    const dx = n[0] - p[0];
    const dy = n[1] - p[1];
    const angle = Math.atan2(dy, dx);
    const length = Math.sqrt(dx * dx + dy * dy) * smoothing;
    const x = curr[0] + Math.cos(angle + (isEnd ? Math.PI : 0)) * length;
    const y = curr[1] + Math.sin(angle + (isEnd ? Math.PI : 0)) * length;
    return [x, y];
  }
}
