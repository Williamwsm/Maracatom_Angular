import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserDataService, User, Notifications } from '../../../service/user-data.service';

// Interface para os itens do menu, agora com rota e chave para o badge
export interface MenuItem {
  icon: string;
  label: string;
  route: string;
  key?: keyof Notifications; // Chave para buscar o número do badge
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,       // Para navegação declarativa
    RouterLinkActive  // Para estilizar o link ativo
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy {

  // Propriedades para armazenar os dados vindos do serviço
  currentUser: User | null = null;
  notifications: Notifications | null = null;

  // Armazena as inscrições (subscriptions) para poder cancelá-las depois
  private subscriptions = new Subscription();

  // Definição dos itens do menu com suas rotas e chaves de notificação
  monitoringItems: MenuItem[] = [
    { icon: 'home', label: 'Home', route: '/home' },
    { icon: 'thermometer', label: 'Equipamentos', route: '/equipamentos', key: 'equipamentos' },
    { icon: 'alert-triangle', label: 'Alertas', route: '/alertas', key: 'alertas' },
    { icon: 'document', label: 'Relatórios', route: '/relatorios' }
  ];

  adminItems: MenuItem[] = [
    { icon: 'settings', label: 'Configurações', route: '/configuracoes' },
    { icon: 'users', label: 'Usuários', route: '/usuarios' }
  ];

  // Injetando o serviço de dados no construtor
  constructor(private userDataService: UserDataService) {}

  // Este método é chamado uma vez quando o componente é inicializado
  ngOnInit(): void {
    // Se inscreve no observable de usuário para receber atualizações
    this.subscriptions.add(
      this.userDataService.user$.subscribe(user => {
        this.currentUser = user;
      })
    );
    // Se inscreve no observable de notificações
    this.subscriptions.add(
      this.userDataService.notifications$.subscribe(notifs => {
        this.notifications = notifs;
      })
    );
  }

  // Este método é chamado quando o componente é destruído
  ngOnDestroy(): void {
    // Cancela todas as inscrições para evitar vazamentos de memória
    this.subscriptions.unsubscribe();
  }

  /**
   * Chamado quando um item do menu é clicado.
   * Se o item tiver uma chave de notificação, ele chama o serviço para limpar o badge.
   * @param item O item do menu que foi clicado.
   */
  onItemClick(item: MenuItem): void {
    if (item.key && typeof item.key === 'string' && this.notifications && this.notifications[item.key] > 0) {
      this.userDataService.clearNotification(item.key);
    }
  }
}
