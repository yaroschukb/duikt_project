import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root', // Сервіс доступний у всьому додатку
})
export class ImageService {
  private imagesSubject = new BehaviorSubject<
    { id: string; filename: string; url: string }[]
  >([]);
  images$ = this.imagesSubject.asObservable();

  constructor(public httpService: ApiService) {}

  // Отримати список зображень
  getPhotoFromServer() {
    this.httpService
      .getCompressedPhoto()
      .pipe(
        map((files) =>
          files.map((file) => ({
            id: file.id,
            filename: file.filename,
            url: `data:image/jpeg;base64,${file.data}`,
          }))
        )
      )
      .subscribe((formattedFiles) => {
        console.log(formattedFiles);

        this.imagesSubject.next(formattedFiles);
      });
  }

  getImages(): Observable<{ id: string; filename: string; url: string }[]> {
    return this.images$;
  }
  // Додати нове зображення
  addImage(image: string): void {
    const currentImages = this.imagesSubject.value;
    // this.imagesSubject.next([...currentImages, image]);
  }

  // Оновити список зображень
  updateImages(newImages: string[]): void {
    // this.imagesSubject.next(newImages);
  }
}
