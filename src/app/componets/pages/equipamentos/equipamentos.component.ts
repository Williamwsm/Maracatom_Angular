import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Equipment, EquipmentService, EquipmentStatus } from '../../../service/equipament.service'; // Ajuste o caminho se necessário

@Component({
  selector: 'app-equipamentos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './equipamentos.component.html',
  styleUrls: ['./equipamentos.component.css']
})
export class EquipamentosComponent implements OnInit, OnDestroy {

  allEquipments: Equipment[] = [];
  filteredEquipments: Equipment[] = [];
  activeFilter: EquipmentStatus | 'TODOS' = 'TODOS';
  isLoading = true;

  private equipmentSubscription: Subscription | undefined;

  constructor(private equipmentService: EquipmentService) { }

  ngOnInit(): void {
    this.equipmentSubscription = this.equipmentService.equipments$.subscribe(equipments => {
      this.allEquipments = equipments;
      this.setFilter(this.activeFilter);
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    this.equipmentSubscription?.unsubscribe();
  }

  setFilter(filter: EquipmentStatus | 'TODOS'): void {
    this.activeFilter = filter;
    this.filteredEquipments = (filter === 'TODOS')
      ? this.allEquipments
      : this.allEquipments.filter(eq => eq.status === filter);
  }

  getCount(status: EquipmentStatus | 'TODOS'): number {
    return (status === 'TODOS')
      ? this.allEquipments.length
      : this.allEquipments.filter(eq => eq.status === status).length;
  }

  togglePower(equipment: Equipment): void {
    this.equipmentService.togglePower(equipment.id);
  }

  /**
   * Chama o serviço para adicionar um novo equipamento com dados predefinidos.
   */
  addNewEquipment(): void {
    this.equipmentService.addEquipment();
  }
}
