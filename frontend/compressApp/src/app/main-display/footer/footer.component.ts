import { Component } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import {
  FacebookOutline,
  TwitterOutline,
  InstagramOutline,
} from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [NzIconModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  providers: [
    { provide: 'icon-facebook-o', useValue: FacebookOutline },
    { provide: 'icon-twitter-o', useValue: TwitterOutline },
    { provide: 'icon-instagram-o', useValue: InstagramOutline },
  ],
})
export class FooterComponent {}
