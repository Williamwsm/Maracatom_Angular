import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Equipment, EquipmentService } from '../../../service/equipament.service';

type EquipmentStatus = 'ATIVO' | 'ALERTA' | 'FALHA' | 'STANDBY';

@Component({
  selector: 'app-equipamentos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './equipamentos.component.html',
  styleUrls: ['./equipamentos.component.css']
})
export class EquipamentosComponent implements OnInit, OnDestroy {

  // Estas propriedades agora serão preenchidas com os dados do serviço
  allEquipments: Equipment[] = [];
  filteredEquipments: Equipment[] = [];
  activeFilter: EquipmentStatus | 'TODOS' = 'TODOS';
  isLoading = true; // Adicionamos um estado de carregamento

  private equipmentSubscription: Subscription | undefined;

  // Injetamos o EquipmentService no construtor
  constructor(private equipmentService: EquipmentService) { }

  ngOnInit(): void {
    // Quando o componente inicia, ele se inscreve para receber a lista de equipamentos do serviço
    this.equipmentSubscription = this.equipmentService.equipments$.subscribe(equipments => {
      this.allEquipments = equipments;
      this.setFilter(this.activeFilter); // Aplica o filtro inicial assim que os dados chegam
      this.isLoading = false; // Avisa que o carregamento terminou
    });
  }

  ngOnDestroy(): void {
    // É uma boa prática cancelar a inscrição para evitar vazamentos de memória
    this.equipmentSubscription?.unsubscribe();
  }

  setFilter(filter: EquipmentStatus | 'TODOS'): void {
    this.activeFilter = filter;
    if (filter === 'TODOS') {
      this.filteredEquipments = this.allEquipments;
    } else {
      this.filteredEquipments = this.allEquipments.filter(eq => eq.status === filter);
    }
  }

  getCount(status: EquipmentStatus | 'TODOS'): number {
    if (status === 'TODOS') {
      return this.allEquipments.length;
    }
    return this.allEquipments.filter(eq => eq.status === status).length;
  }

  /**
   * A ação de ligar/desligar agora é delegada para o serviço.
   * @param equipment O equipamento que foi clicado.
   */
  togglePower(equipment: Equipment): void {
    // O componente agora só precisa chamar o método do serviço, passando o ID.
    this.equipmentService.togglePower(equipment.id);
  }

  /**
   * Chama o serviço para adicionar um novo equipamento com dados dinâmicos.
   */
  addNewEquipment(): void {
    this.equipmentService.addEquipment();
  }
}
