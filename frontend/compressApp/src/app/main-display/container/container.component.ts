import { ApiService } from './../../services/api.service';
import { Component } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzContentComponent } from 'ng-zorro-antd/layout';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  NzUploadFile,
  NzUploadModule,
  NzUploadXHRArgs,
} from 'ng-zorro-antd/upload';
import { Subscription, of } from 'rxjs';
import { NzModalComponent, NzModalModule } from 'ng-zorro-antd/modal';
import { NzImageModule } from 'ng-zorro-antd/image';
import { CommonModule } from '@angular/common';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { ImageService } from '../../services/image.service';

const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

@Component({
  selector: 'app-container',
  standalone: true,
  imports: [
    NzIconModule,
    NzContentComponent,
    NzUploadModule,
    NzImageModule,
    CommonModule,
    NzModalModule,
    NzModalComponent,
    NzButtonComponent,
  ],
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss'],
})
export class ContainerComponent {
  constructor(
    private msg: NzMessageService,
    private httpService: ApiService,
    public imageService: ImageService
  ) {}

  ngOnInit(): void {}

  fileList: NzUploadFile[] = [];
  previewImage: any | undefined = '';
  previewVisible = false;
  uploading = false;

  imageUpload = (item: NzUploadXHRArgs): Subscription => {
    const formData = new FormData();
    formData.append('image', item.file.originFileObj as unknown as Blob);

    return this.httpService.uploadImageToServer(formData).subscribe({
      next: (event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress) {
          const percentDone = Math.round(
            (100 * (event.loaded || 0)) / (event.total || 1)
          );
          if (item.onProgress) {
            item.onProgress({ percent: percentDone }, item.file);
          }
        } else if (event.type === HttpEventType.Response) {
          if (event.status === 200 || event.status === 201) {
            this.msg.success('Upload successfully.');
            if (item.onSuccess) {
              item.onSuccess(event.body, item.file, event);
            }
            this.imageService.getPhotoFromServer();
          } else {
            this.msg.error('Unexpected response from server.');
            if (item.onError) {
              item.onError(new Error('Unexpected response'), item.file);
            }
          }
        }
      },
      error: (error) => {
        console.error('Error details:', error);
        this.msg.error('Upload failed. Please try again later.');
        if (item.onError) {
          item.onError(error, item.file);
        }
      },
      complete: () => {
        this.uploading = false;
      },
    });
  };

  handlePreview = async (file: NzUploadFile): Promise<void> => {
    if (!file.url && !file['preview']) {
      file['preview'] = await getBase64(file.originFileObj!);
    }
    this.previewImage = file.url || file['preview'];
    this.previewVisible = true;
  };

  handleUpload(): void {
    if (this.fileList.length === 0) {
      this.msg.warning('No files selected for upload.');
      return;
    }

    this.uploading = true;

    this.fileList.forEach((file) => {
      this.imageUpload({
        file: file as any,
        onProgress: file['onProgress'] || (() => {}),
        onSuccess: file['onSuccess'] || (() => {}),
        onError: file['onError'] || (() => {}),
      } as NzUploadXHRArgs);
    });
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = [...this.fileList, file]; // Додаємо файл до списку
    return false; // Блокуємо автоматичне завантаження
  };

  customRequest = (item: NzUploadXHRArgs): Subscription => {
    return this.imageUpload(item); // Використовуємо кастомну функцію для завантаження
  };
}
