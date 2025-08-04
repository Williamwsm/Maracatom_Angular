import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Interfaces para tipar nossos dados
export interface User {
  name: string;
  email: string;
  institution: string;
}

export interface Notifications {
  equipamentos: number;
  alertas: number;
  [key: string]: number; // Assinatura de índice para acesso dinâmico
}

@Injectable({
  providedIn: 'root' // Torna o serviço disponível em toda a aplicação
})
export class UserDataService {

  // BehaviorSubject guarda o valor atual e emite para novos inscritos.
  // Começamos com dados de exemplo. Em uma aplicação real, viriam de uma API.
  private readonly _user = new BehaviorSubject<User>({
    name: 'Administrador',
    email: 'admin@instituto.edu',
    institution: 'Instituto Tecnológico'
  });


  private readonly _notifications = new BehaviorSubject<Notifications>({
    equipamentos: 0,
    alertas: 1,
  });

  // Expomos os dados como Observables (apenas para leitura)
  readonly user$ = this._user.asObservable();
  readonly notifications$ = this._notifications.asObservable();

  /**
   *Atualiza a contagem de uma notificação específica.
   * @param key A chave da notificação a ser atualizada
   * @param count O novo número para o contador.
   */
  updateNotification(key: keyof Notifications, count: number): void {
    const currentNotifications = this._notifications.getValue();
    currentNotifications[key] = count;
    this._notifications.next(currentNotifications);
  }

  /**
   * Limpa o contador de um badge específico (zera a contagem).
   * @param key A chave da notificação a ser limpa
   */
  clearNotification(key: string): void {
    const currentNotifications = this._notifications.getValue();
    currentNotifications[key] = 0;
    this._notifications.next(currentNotifications);
  }
}
