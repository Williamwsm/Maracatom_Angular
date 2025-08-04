import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// Define os tipos para um alerta
type AlertPriority = 'ALTA' | 'MÉDIA' | 'BAIXA';
export type AlertStatus = 'ATIVO' | 'CRÍTICO' | 'RESOLVIDO' | 'MANUTENÇÃO'; // Novo status adicionado

export interface Alerta {
  id: number;
  equipmentName: string;
  location: string;
  description: string;
  priority: AlertPriority;
  status: AlertStatus;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlertaService {

  private readonly _alertas = new BehaviorSubject<Alerta[]>([
    { id: 1, equipmentName: 'AC Auditório', location: 'Auditório', description: 'Equipamento em falha - Temperatura crítica detectada (32.5°C)', priority: 'ALTA', status: 'CRÍTICO', timestamp: 'há 15 min' },
    { id: 2, equipmentName: 'AC Sala 201', location: 'Sala 201', description: 'Consumo energético 85% acima do normal', priority: 'MÉDIA', status: 'ATIVO', timestamp: 'há 1h' },
    { id: 3, equipmentName: 'AC Lab 101', location: 'Lab 101', description: 'Manutenção preventiva agendada para próxima semana', priority: 'BAIXA', status: 'ATIVO', timestamp: 'há 2h' },
    { id: 4, equipmentName: 'AC Biblioteca', location: 'Biblioteca', description: 'Filtro de ar precisa ser trocado', priority: 'BAIXA', status: 'RESOLVIDO', timestamp: 'há 5h' },
  ]);

  readonly alertas$: Observable<Alerta[]> = this._alertas.asObservable();

  constructor() { }

  /**
   * Marca um alerta como resolvido.
   * @param alertaId O ID do alerta a ser resolvido.
   */
  resolveAlerta(alertaId: number): void {
    const currentAlertas = this._alertas.getValue();
    const alertaIndex = currentAlertas.findIndex(a => a.id === alertaId);

    if (alertaIndex > -1) {
      const updatedAlertas = [...currentAlertas];
      updatedAlertas[alertaIndex] = { ...updatedAlertas[alertaIndex], status: 'RESOLVIDO' };
      this._alertas.next(updatedAlertas);
    }
  }

  /**
   * Envia um alerta para manutenção.
   * @param alertaId O ID do alerta a ser enviado para manutenção.
   */
  sendToMaintenance(alertaId: number): void {
    const currentAlertas = this._alertas.getValue();
    const alertaIndex = currentAlertas.findIndex(a => a.id === alertaId);

    if (alertaIndex > -1) {
      const updatedAlertas = [...currentAlertas];
      updatedAlertas[alertaIndex] = { ...updatedAlertas[alertaIndex], status: 'MANUTENÇÃO' };
      this._alertas.next(updatedAlertas);
    }
  }

  /**
   * Remove um alerta da lista.
   * @param alertaId O ID do alerta a ser removido.
   */
  deleteAlerta(alertaId: number): void {
    const currentAlertas = this._alertas.getValue();
    const updatedAlertas = currentAlertas.filter(a => a.id !== alertaId);
    this._alertas.next(updatedAlertas);
  }
}
