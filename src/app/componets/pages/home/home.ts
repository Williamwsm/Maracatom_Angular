import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { HomeService, HomePageData } from '../../../service/home.service';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DecimalPipe],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {

  isLoading = true;
  homeData: HomePageData | null = null;
  currentMonthYear = '';
  currentMonthAbbr = ''; // Propriedade para o destaque

  constructor(private homeService: HomeService) { }

  ngOnInit(): void {
    const now = new Date();
    // Formata o mês e ano atuais para o título
    this.currentMonthYear = format(now, "MMMM - yyyy", { locale: ptBR });
    this.currentMonthYear = this.currentMonthYear.charAt(0).toUpperCase() + this.currentMonthYear.slice(1);

    // Formata a abreviatura do mês atual para a comparação
    const monthAbbr = format(now, 'MMM', { locale: ptBR }).replace('.', '');
    this.currentMonthAbbr = monthAbbr.charAt(0).toUpperCase() + monthAbbr.slice(1);

    // Carrega os dados da página
    this.homeService.getHomePageData().subscribe(data => {
      this.homeData = data;
      this.isLoading = false;
    });
  }
}
