import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { NzImageModule } from 'ng-zorro-antd/image';

@Component({
  selector: 'app-sider',
  standalone: true,
  imports: [CommonModule, NzImageModule],
  templateUrl: './sider.component.html',
  styleUrl: './sider.component.scss',
})
export class SiderComponent implements OnInit {
  constructor(public httpService: ApiService) {}

  files: { filename: string; data: string }[] = [];
  updatedFiles: { filename: string; blobUrl: string }[] = [];
  ngOnInit(): any {
    this.photoObjectConvert();
    console.log(this.updatedFiles);
  }
  photoObjectConvert() {
    this.httpService.getCompressedPhoto().subscribe((files) => {
      this.updatedFiles = files.map(
        (object: { filename: string; data: string }) => {
          const { filename, data } = object;
          const byteCharacters = atob(data);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'image/jpeg' });
          const blobUrl = URL.createObjectURL(blob);

          return {
            filename,
            blobUrl: blobUrl,
          };
        }
      );
    });
  }
}
