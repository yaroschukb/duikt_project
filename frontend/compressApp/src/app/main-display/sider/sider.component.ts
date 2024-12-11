import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { NzImageModule } from 'ng-zorro-antd/image';
import { ImageService } from '../../services/image.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalComponent } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-sider',
  standalone: true,
  imports: [CommonModule, NzImageModule, NzIconModule, NzModalComponent],
  templateUrl: './sider.component.html',
  styleUrl: './sider.component.scss',
})
export class SiderComponent implements OnInit {
  constructor(
    public httpService: ApiService,
    public imageService: ImageService
  ) {}

  files: { id: string; filename: string; data: string }[] = [];
  updatedFiles: { id: string; filename: string; url: string }[] = [];
  ngOnInit(): void {
    this.imageService.images$.subscribe((files) => {
      this.updatedFiles = files;
    });
    this.imageService.getPhotoFromServer();
  }

  hoveredFile: any = null;
  previewImage: string | undefined = '';
  previewVisible = false;
  previewTitle: string = '';

  viewImage(file: { url: string; filename: string }): void {
    this.previewImage = file.url;
    this.previewTitle = file.filename;
    this.previewVisible = true;
  }

  downloadImage(file: { url: string; filename: string }): void {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.filename;
    link.click();
  }

  deleteImage(file: { id: string; filename: string }): void {
    this.httpService.deleteImage(file.id);
    this.imageService.getPhotoFromServer();
  }
}
