import { Component } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { SiderComponent } from './sider/sider.component';
import { FooterComponent } from './footer/footer.component';
import { ContainerComponent } from './container/container.component';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-main-display',
  standalone: true,
  imports: [
    NzLayoutModule,
    SiderComponent,
    FooterComponent,
    ContainerComponent,
    HeaderComponent,
  ],
  templateUrl: './main-display.component.html',
  styleUrls: ['./main-display.component.scss'], // Виправлено тут
})
export class MainDisplayComponent {
  constructor() {}
}
