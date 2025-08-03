import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { EquipmentService } from './equipament.service'; // Importamos o serviço de equipamentos

// Interfaces para a estrutura de dados complexa da página Home
export interface HeaderCardData {
  consumoTotal: { value: number };
  custoTotal: { value: number };
  temperaturaMedia: { value: number; idealRange: string };
  equipamentos: { online: number; total: number; inFault: number };
}

export interface ResumoMensal {
  consumoTotal: number;
  custoTotal: number;
  temperaturaMedia: number;
  eficienciaMedia: number;
  diasAltaEficiencia: number;
  diasConsumoElevado: number;
  economiaMesAnterior: number;
}

export interface AnaliseSemanal {
  periodo: string;
  consumoTotal: number;
  custo: number;
  tempMedia: number;
  picoConsumo: { value: number; date: string };
  performance: 'Excelente' | 'Bom' | 'Atenção';
}

export interface MelhoresDias {
  menorConsumo: { value: number; date: string };
  melhorEficiencia: { value: number; date: string };
  menorCusto: { value: number; date: string };
}

export interface AlertasMes {
  picosConsumo: number;
  tempForaIdeal: number;
  eficienciaBaixa: number;
}

export interface ProjecaoProximoMes {
  consumoEstimado: number;
  custoEstimado: number;
  economiaPrevista: number;
}

export interface HomePageData {
  headerCards: HeaderCardData;
  resumoMensal: ResumoMensal;
  comparacaoAnual: { month: string; consumo: number; custo: number }[];
  analiseSemanal: AnaliseSemanal[];
  melhoresDias: MelhoresDias;
  alertasMes: AlertasMes;
  projecaoProximoMes: ProjecaoProximoMes;
}

// Interface para dados diários, usada para os cálculos
interface DailyData {
  date: string;
  consumo: number;
  eficiencia: number;
  custo: number;
  temperatura: number;
}

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private equipmentService: EquipmentService) { }

  getHomePageData(): Observable<HomePageData> {
    // --- GERAÇÃO DE DADOS DIÁRIOS ---
    const dailyData: DailyData[] = [];
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(today.getFullYear(), today.getMonth(), i);
      const consumo = Math.floor(Math.random() * (410 - 320 + 1)) + 320;
      dailyData.push({
        date: format(date, 'dd/MM'),
        consumo: consumo,
        eficiencia: Math.floor(Math.random() * (95 - 70 + 1)) + 70,
        custo: consumo * 0.25,
        temperatura: parseFloat((Math.random() * (25.8 - 23.5) + 23.5).toFixed(1)),
      });
    }

    // --- CÁLCULOS A PARTIR DOS DADOS DIÁRIOS ---

    // Resumo Mensal
    const resumoMensal: ResumoMensal = {
      consumoTotal: dailyData.reduce((sum, day) => sum + day.consumo, 0),
      custoTotal: dailyData.reduce((sum, day) => sum + day.custo, 0),
      temperaturaMedia: parseFloat((dailyData.reduce((sum, day) => sum + day.temperatura, 0) / daysInMonth).toFixed(1)),
      eficienciaMedia: Math.round(dailyData.reduce((sum, day) => sum + day.eficiencia, 0) / daysInMonth),
      diasAltaEficiencia: dailyData.filter(d => d.eficiencia > 85).length,
      diasConsumoElevado: dailyData.filter(d => d.consumo > 400).length,
      economiaMesAnterior: Math.floor(Math.random() * (200 - 150 + 1)) + 150,
    };

    // Análise Semanal
    const analiseSemanal: AnaliseSemanal[] = [];
    for (let i = 0; i < 4; i++) {
      const weekData = dailyData.slice(i * 7, (i + 1) * 7);
      if (weekData.length === 0) continue;

      const consumoTotal = weekData.reduce((sum, day) => sum + day.consumo, 0);
      const pico = [...weekData].sort((a, b) => b.consumo - a.consumo)[0];
      let performance: 'Excelente' | 'Bom' | 'Atenção';
      const avgEficiencia = weekData.reduce((sum, day) => sum + day.eficiencia, 0) / weekData.length;
      if (avgEficiencia > 88) performance = 'Excelente';
      else if (avgEficiencia > 78) performance = 'Bom';
      else performance = 'Atenção';

      analiseSemanal.push({
        periodo: `Semana ${i + 1}`,
        consumoTotal,
        custo: weekData.reduce((sum, day) => sum + day.custo, 0),
        tempMedia: parseFloat((weekData.reduce((sum, day) => sum + day.temperatura, 0) / weekData.length).toFixed(1)),
        picoConsumo: { value: pico.consumo, date: pico.date },
        performance,
      });
    }

    // Melhores Dias (agora dinâmico)
    const sortedByConsumo = [...dailyData].sort((a, b) => a.consumo - b.consumo);
    const sortedByEficiencia = [...dailyData].sort((a, b) => b.eficiencia - a.eficiencia);
    const sortedByCusto = [...dailyData].sort((a, b) => a.custo - b.custo);
    const melhoresDias: MelhoresDias = {
      menorConsumo: { value: sortedByConsumo[0].consumo, date: sortedByConsumo[0].date },
      melhorEficiencia: { value: sortedByEficiencia[0].eficiencia, date: sortedByEficiencia[0].date },
      menorCusto: { value: sortedByCusto[0].custo, date: sortedByCusto[0].date },
    };

    // Equipamentos
    let equipamentosAtivos = 0, equipamentosEmFalha = 0, totalEquipamentos = 0;
    this.equipmentService.equipments$.subscribe(equipments => {
      totalEquipamentos = equipments.length;
      equipamentosAtivos = equipments.filter(eq => eq.status === 'ATIVO').length;
      equipamentosEmFalha = equipments.filter(eq => eq.status === 'FALHA').length;
    }).unsubscribe();

    const headerCards: HeaderCardData = {
      consumoTotal: { value: resumoMensal.consumoTotal },
      custoTotal: { value: resumoMensal.custoTotal },
      temperaturaMedia: { value: resumoMensal.temperaturaMedia, idealRange: '22-25°C' },
      equipamentos: { online: equipamentosAtivos, total: totalEquipamentos, inFault: equipamentosEmFalha },
    };

    const now = new Date();
    const comparacaoAnual = [];
    for (let i = 3; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = format(date, 'MMM', { locale: ptBR }).replace('.', '');
        const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
        const isCurrentMonth = i === 0;
        const consumo = isCurrentMonth ? resumoMensal.consumoTotal : Math.floor(Math.random() * (9500 - 7500 + 1)) + 7500;
        comparacaoAnual.push({
            month: capitalizedMonth,
            consumo: consumo,
            custo: consumo * 0.25,
        });
    }

    const data: HomePageData = {
      headerCards,
      resumoMensal,
      comparacaoAnual,
      analiseSemanal,
      melhoresDias,
      alertasMes: {
        picosConsumo: dailyData.filter(d => d.consumo > 400).length,
        tempForaIdeal: dailyData.filter(d => d.temperatura > 25).length,
        eficienciaBaixa: dailyData.filter(d => d.eficiencia < 75).length,
      },
      projecaoProximoMes: {
        consumoEstimado: resumoMensal.consumoTotal * 0.95,
        custoEstimado: resumoMensal.custoTotal * 0.95,
        economiaPrevista: resumoMensal.custoTotal * 0.05,
      },
    };

    return of(data);
  }
}
