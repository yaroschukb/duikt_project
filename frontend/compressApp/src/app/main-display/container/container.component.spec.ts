// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { ContainerComponent } from './container.component';
// import { NzMessageService } from 'ng-zorro-antd/message';
// import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
// import { NzIconModule } from 'ng-zorro-antd/icon';
// import { NzLayoutModule } from 'ng-zorro-antd/layout';
// import { NzMessageModule } from 'ng-zorro-antd/message';
// import { NzUploadModule } from 'ng-zorro-antd/upload';

// describe('ContainerComponent', () => {
//   let component: ContainerComponent;
//   let fixture: ComponentFixture<ContainerComponent>;
//   let msgService: NzMessageService;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [NzIconModule, NzLayoutModule, NzMessageModule, NzUploadModule],
//       declarations: [ContainerComponent], // Додаємо компонент до декларацій
//       providers: [NzMessageService],
//     }).compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(ContainerComponent);
//     component = fixture.componentInstance;
//     msgService = TestBed.inject(NzMessageService);
//     spyOn(msgService, 'success').and.stub(); // Створюємо шпигуна для методу success
//     spyOn(msgService, 'error').and.stub(); // Створюємо шпигуна для методу error
//     fixture.detectChanges();
//   });

//   it('should call success message when file upload is done', () => {
//     const mockParam: NzUploadChangeParam = {
//       file: { name: 'test.jpg', status: 'done' },
//       fileList: [],
//     } as any;

//     component.handleChange(mockParam);
//     expect(msgService.success).toHaveBeenCalledWith(
//       'test.jpg file uploaded successfully.'
//     );
//   });

//   it('should call error message when file upload fails', () => {
//     const mockParam: NzUploadChangeParam = {
//       file: { name: 'test.jpg', status: 'error' },
//       fileList: [],
//     } as any;

//     component.handleChange(mockParam);
//     expect(msgService.error).toHaveBeenCalledWith(
//       'test.jpg file upload failed.'
//     );
//   });
// });
