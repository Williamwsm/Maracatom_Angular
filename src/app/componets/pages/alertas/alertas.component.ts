import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Alerta, AlertaService, AlertStatus } from '../../../service/alertas.service'; 

type AlertStatusFilter = 'ATIVOS' | 'CRÍTICOS' | 'RESOLVIDOS' | 'MANUTENÇÃO';

@Component({
  selector: 'app-alertas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alertas.component.html',
  styleUrls: ['./alertas.component.css']
})
export class AlertasComponent implements OnInit, OnDestroy {

  allAlerts: Alerta[] = [];
  filteredAlerts: Alerta[] = [];
  activeFilter: AlertStatusFilter = 'ATIVOS';

  hasCriticalAlerts = false;

  private alertsSubscription: Subscription | undefined;

  constructor(private alertaService: AlertaService) { }

  ngOnInit(): void {
    this.alertsSubscription = this.alertaService.alertas$.subscribe(alertas => {
      this.allAlerts = alertas;
      this.hasCriticalAlerts = this.allAlerts.some(a => a.status === 'CRÍTICO');
      this.setFilter(this.activeFilter); // Reaplica o filtro atual com os novos dados
    });
  }

  ngOnDestroy(): void {
    this.alertsSubscription?.unsubscribe();
  }

  setFilter(filter: AlertStatusFilter): void {
    this.activeFilter = filter;
    switch (filter) {
      case 'ATIVOS':
        this.filteredAlerts = this.allAlerts.filter(a => a.status === 'ATIVO' || a.status === 'CRÍTICO');
        break;
      case 'CRÍTICOS':
        this.filteredAlerts = this.allAlerts.filter(a => a.status === 'CRÍTICO');
        break;
      case 'RESOLVIDOS':
        this.filteredAlerts = this.allAlerts.filter(a => a.status === 'RESOLVIDO');
        break;
      case 'MANUTENÇÃO':
        this.filteredAlerts = this.allAlerts.filter(a => a.status === 'MANUTENÇÃO');
        break;
    }
  }

  getCount(filter: AlertStatusFilter): number {
    switch (filter) {
      case 'ATIVOS':
        return this.allAlerts.filter(a => a.status === 'ATIVO' || a.status === 'CRÍTICO').length;
      case 'CRÍTICOS':
        return this.allAlerts.filter(a => a.status === 'CRÍTICO').length;
      case 'RESOLVIDOS':
        return this.allAlerts.filter(a => a.status === 'RESOLVIDO').length;
      case 'MANUTENÇÃO':
        return this.allAlerts.filter(a => a.status === 'MANUTENÇÃO').length;
    }
  }

  resolve(alerta: Alerta): void {
    this.alertaService.resolveAlerta(alerta.id);
  }

  sendToMaintenance(alerta: Alerta): void {
    this.alertaService.sendToMaintenance(alerta.id);
  }

  delete(alerta: Alerta): void {
    this.alertaService.deleteAlerta(alerta.id);
  }
}
