import { HttpEventType } from '@angular/common/http';
import { ApiService } from './../../services/api.service';
import { Component } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzContentComponent } from 'ng-zorro-antd/layout';
import { NzMessageComponent, NzMessageService } from 'ng-zorro-antd/message';
import {
  NzUploadChangeParam,
  NzUploadComponent,
  NzUploadFile,
  NzUploadModule,
  NzUploadXHRArgs,
} from 'ng-zorro-antd/upload';
import { Subscription, pipe } from 'rxjs';
import { NzModalComponent, NzModalModule } from 'ng-zorro-antd/modal';
import { NzImageModule } from 'ng-zorro-antd/image';
import { CommonModule } from '@angular/common';
import { NzButtonComponent } from 'ng-zorro-antd/button';
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
    NzMessageComponent,
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
  styleUrls: ['./container.component.scss'], // Виправлено тут
})
export class ContainerComponent {
  constructor(private msg: NzMessageService, private httpService: ApiService) {}

  fileList: NzUploadFile[] = [];
  previewImage: any | undefined = '';
  previewVisible = false;
  uploading = false;

  imageUpload = (item: any): Subscription => {
    console.log('ITEM', item);
    const result = this.httpService.uploadImageToServer(item).subscribe({
      next: (event: any) => {
        this.uploading = true;
        if (event.type === HttpEventType.UploadProgress) {
          const percentDone = Math.round((100 * event.loaded) / event.total);
          console.log(`File is ${percentDone}% uploaded.`);
          item.onProgress({ percent: percentDone });
        } else if (event.type === HttpEventType.Response) {
          console.log('File successfully uploaded!', event.body);
          item.onSuccess(event.body, item.file, event);
        }
      },
      error: (error) => {
        this.uploading = false;
        console.error('File upload failed:', error);
        item.onError(error, item.file);
      },
      complete: () => {
        this.uploading = false;
        console.log('File upload complete.');
      },
    });
    return result;
  };

  // handleChange(event: any): void {
  //   const files = event.fileList;
  //   this.fileList = files.map((file: NzUploadFile) => {
  //     if (!file['preview'] && file.originFileObj) {
  //       // Create a FileReader to read the file and generate a preview
  //       const reader = new FileReader();
  //       reader.onload = () => {
  //         file['preview'] = reader.result as string;
  //       };
  //       reader.readAsDataURL(file.originFileObj);
  //       this.previewImage = file['preview'];
  //     }
  //     return file;
  //   });
  // }

  handlePreview = async (file: NzUploadFile): Promise<void> => {
    if (!file.url && !file['preview']) {
      file['preview'] = await getBase64(file.originFileObj!);
    }
    this.previewImage = file.url || file['preview'];
    this.previewVisible = true;
  };

  handleUpload(): void {
    this.uploading = true;
    console.log('handleUpload', this.fileList);
    // this.imageUpload(this.fileList);
  }

  beforeUpload = (file: NzUploadXHRArgs): any => {
    console.log('File to upload', file);
  };
}
