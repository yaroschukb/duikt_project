import { Component, OnInit } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { SiderComponent } from './sider/sider.component';
import { FooterComponent } from './footer/footer.component';
import { ContainerComponent } from './container/container.component';
import { HeaderComponent } from './header/header.component';
import { ApiService } from '../services/api.service';

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
  styleUrls: ['./main-display.component.scss'],
})
export class MainDisplayComponent {
  constructor(public httpService: ApiService) {}
  listOfCompressPhotosEmpty: boolean = true;
  ngOnInit(): any {
    this.getPhotoList();
  }
  getPhotoList() {
    this.httpService.getCompressedPhoto().subscribe((files) => {
      console.log(this.listOfCompressPhotosEmpty);

      this.listOfCompressPhotosEmpty = files.length <= 0 ? true : false;
    });
  }
}
