import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MenubarModule, ToastModule, ConfirmDialogModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Plateforme Datasets & Modeles ML';

  menuItems: MenuItem[] = [
    { label: 'Datasets', icon: 'pi pi-database', routerLink: '/datasets' },
    { label: 'Modeles ML', icon: 'pi pi-cog', routerLink: '/modeles' },
    { label: 'Experimentations', icon: 'pi pi-chart-line', routerLink: '/experimentations' }
  ];
}
