import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-sider',
  standalone: true,
  imports: [],
  templateUrl: './sider.component.html',
  styleUrl: './sider.component.scss',
})
export class SiderComponent implements OnInit {
  constructor(public httpService: ApiService) {}
  photoList: string = '';

  ngOnInit(): void {
    this.getPhoto();
  }
  getPhoto() {
    this.photoList = this.httpService.getCompressedPhoto().toString();
  }
}
