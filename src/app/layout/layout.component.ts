import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // <-- CORREÇÃO AQUI
import { MenuComponent } from "../componets/pages/menu/menu.component";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    MenuComponent,
    RouterOutlet // <-- E aqui
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

}
