import { Component } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzContentComponent } from 'ng-zorro-antd/layout';
import { NzMessageComponent, NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadComponent } from 'ng-zorro-antd/upload';

@Component({
  selector: 'app-container',
  standalone: true,
  imports: [
    NzMessageComponent,
    NzUploadComponent,
    NzIconModule,
    NzContentComponent,
  ],
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss'], // Виправлено тут
})
export class ContainerComponent {
  constructor(private msg: NzMessageService) {}

  handleChange({ file }: NzUploadChangeParam): void {
    const status = file.status;
    if (status === 'done') {
      this.msg.success(`${file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      this.msg.error(`${file.name} file upload failed.`);
    }
  }
}
