import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';

// Define os possíveis status de um equipamento
export type EquipmentStatus = 'ATIVO' | 'ALERTA' | 'FALHA' | 'STANDBY';

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

  private readonly _equipments = new BehaviorSubject<Equipment[]>([
    { id: 1, name: 'AC Laboratório 101', location: 'Lab 101', status: 'ATIVO', temperature: 24.5, consumption: 3.2, uptime: '8h 30min', efficiency: 85, isOn: true },
    { id: 2, name: 'AC Sala de Aula 201', location: 'Sala 201', status: 'ALERTA', temperature: 28.1, consumption: 4.1, uptime: '8h 45min', efficiency: 65, isOn: true },
    { id: 3, name: 'AC Biblioteca', location: 'Biblioteca', status: 'STANDBY', temperature: 26.0, consumption: 0.8, uptime: '2h 15min', efficiency: 92, isOn: false },
    { id: 4, name: 'AC Auditório', location: 'Auditório', status: 'FALHA', temperature: 32.5, consumption: 0, uptime: '0h 00min', efficiency: 0, isOn: false },
  ]);

  readonly equipments$: Observable<Equipment[]> = this._equipments.asObservable();

  constructor() {
    // Simula atualizações de dados em tempo real a cada 5 segundos
    interval(5000).subscribe(() => {
      const currentEquipments = this._equipments.getValue().map(eq => {
        if (eq.status === 'FALHA') return eq;

        const tempChange = Math.random() * 0.4 - 0.2;
        const consumptionChange = eq.isOn ? Math.random() * 0.2 - 0.1 : 0;

        const newTemp = parseFloat((eq.temperature + tempChange).toFixed(1));
        const newConsumption = parseFloat(Math.max(0, eq.consumption + consumptionChange).toFixed(1));

        return {
          ...eq,
          temperature: newTemp,
          consumption: newConsumption,
        };
      });
      this._equipments.next(currentEquipments);
    });
  }

  togglePower(equipmentId: number): void {
    const currentEquipments = this._equipments.getValue();
    const equipmentIndex = currentEquipments.findIndex(eq => eq.id === equipmentId);

    if (equipmentIndex > -1) {
      const updatedEquipments = [...currentEquipments];
      const equipmentToUpdate = { ...updatedEquipments[equipmentIndex] };
      equipmentToUpdate.isOn = !equipmentToUpdate.isOn;
      equipmentToUpdate.status = equipmentToUpdate.isOn ? 'ATIVO' : 'STANDBY';
      updatedEquipments[equipmentIndex] = equipmentToUpdate;
      this._equipments.next(updatedEquipments);
    }
  }

  /**
   * Adiciona um novo equipamento com dados predefinidos.
   */
  addEquipment(): void {
    const currentEquipments = this._equipments.getValue();
    const newId = Math.max(0, ...currentEquipments.map(e => e.id)) + 1;

    const newEquipment: Equipment = {
      id: newId,
      name: `Novo Equipamento #${newId}`,
      location: `Sala ${newId * 10}`,
      status: 'STANDBY',
      temperature: 25.0,
      consumption: 0.5,
      uptime: '0h 00min',
      efficiency: 95,
      isOn: false,
    };

    this._equipments.next([...currentEquipments, newEquipment]);
  }
}
