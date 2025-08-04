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

      // Inverte o estado de 'ligado'
      equipmentToUpdate.isOn = !equipmentToUpdate.isOn;

      // Se o status era ATIVO e foi desligado, muda para STANDBY
      if (!equipmentToUpdate.isOn && equipmentToUpdate.status === 'ATIVO') {
        equipmentToUpdate.status = 'STANDBY';
      }
      // Se o status era STANDBY e foi ligado, muda para ATIVO
      else if (equipmentToUpdate.isOn && equipmentToUpdate.status === 'STANDBY') {
        equipmentToUpdate.status = 'ATIVO';
      }

      // Atualiza o equipamento no array
      updatedEquipments[equipmentIndex] = equipmentToUpdate;

      // Emite a nova lista atualizada para todos os componentes que estão ouvindo.
      this._equipments.next(updatedEquipments);
    }
  }

  /**
   * Adiciona um novo equipamento com dados dinâmicos à lista.
   */
  addEquipment(): void {
    const currentEquipments = this._equipments.getValue();
    // Gera um novo ID único
    const newId = currentEquipments.length > 0 ? Math.max(...currentEquipments.map(e => e.id)) + 1 : 1;

    const statuses: EquipmentStatus[] = ['ATIVO', 'ALERTA', 'STANDBY']; // Removido 'FALHA' para novos equipamentos
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    // Define se está ligado com base no status
    const isOn = randomStatus === 'ATIVO' || randomStatus === 'ALERTA';

    const newEquipment: Equipment = {
      id: newId,
      name: `AC Novo ${newId}`,
      location: `Bloco ${String.fromCharCode(65 + Math.floor(Math.random() * 5))} - Sala ${100 + newId}`,
      status: randomStatus,
      temperature: parseFloat((Math.random() * (35 - 20) + 20).toFixed(1)),
      consumption: parseFloat((Math.random() * (5 - 1) + 1).toFixed(1)),
      uptime: `${Math.floor(Math.random() * 10)}h ${Math.floor(Math.random() * 60)}min`,
      efficiency: Math.floor(Math.random() * (100 - 50) + 50),
      isOn: isOn,
    };

    const updatedEquipments = [...currentEquipments, newEquipment];
    this._equipments.next(updatedEquipments);
  }
}
