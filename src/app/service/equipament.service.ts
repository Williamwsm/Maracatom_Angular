import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// Define os possíveis status de um equipamento
type EquipmentStatus = 'ATIVO' | 'ALERTA' | 'FALHA' | 'STANDBY';

// Interface para definir a estrutura de um equipamento
export interface Equipment {
  id: number;
  name: string;
  location: string;
  status: EquipmentStatus;
  temperature: number;
  consumption: number;
  uptime: string;
  efficiency: number;
  isOn: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  // A lista de equipamentos agora é gerenciada aqui, dentro do serviço.
  // Usamos um BehaviorSubject para que os componentes possam "ouvir" as mudanças.
  private readonly _equipments = new BehaviorSubject<Equipment[]>([
    { id: 1, name: 'AC Laboratório 101', location: 'Lab 101', status: 'ATIVO', temperature: 24.5, consumption: 3.2, uptime: '8h 30min', efficiency: 85, isOn: true },
    { id: 2, name: 'AC Sala de Aula 201', location: 'Sala 201', status: 'ALERTA', temperature: 28.1, consumption: 4.1, uptime: '8h 45min', efficiency: 65, isOn: true },
    { id: 3, name: 'AC Biblioteca', location: 'Biblioteca', status: 'STANDBY', temperature: 26.0, consumption: 0.8, uptime: '2h 15min', efficiency: 92, isOn: false },
    { id: 4, name: 'AC Auditório', location: 'Auditório', status: 'FALHA', temperature: 32.5, consumption: 0, uptime: '0h 00min', efficiency: 0, isOn: false },
  ]);

  // Stream público que os componentes usarão para obter a lista de equipamentos.
  readonly equipments$: Observable<Equipment[]> = this._equipments.asObservable();

  constructor() { }

  /**
   * Modifica o estado de um equipamento (ligado/desligado) dentro do serviço.
   * @param equipmentId O ID do equipamento a ser alterado.
   */
  togglePower(equipmentId: number): void {
    const currentEquipments = this._equipments.getValue();
    const equipmentIndex = currentEquipments.findIndex(eq => eq.id === equipmentId);

    if (equipmentIndex > -1) {
      // Criamos uma cópia para não modificar o estado original diretamente (imutabilidade)
      const updatedEquipments = [...currentEquipments];
      const equipmentToUpdate = { ...updatedEquipments[equipmentIndex] };

      equipmentToUpdate.isOn = !equipmentToUpdate.isOn;

      // Atualiza o equipamento no array
      updatedEquipments[equipmentIndex] = equipmentToUpdate;

      // Emite a nova lista atualizada para todos os componentes que estão ouvindo.
      this._equipments.next(updatedEquipments);
    }
  }
}
