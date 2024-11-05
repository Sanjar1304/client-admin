import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  EventEmitter,
  inject, Input, OnChanges, OnInit,
  Output, SimpleChanges
} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {NgIf, NgOptimizedImage} from '@angular/common';

import {MatFormField, MatInput} from '@angular/material/input';
import {CommonService} from '../../services/common.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {spinnerState$$} from '../../utils/spinner.util';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [
    MatIcon,
    MatIconButton,
    NgOptimizedImage,
    NgIf,
    MatButton,
    MatInput,
    MatFormField
  ],
  templateUrl: './image-upload.component.html',
  styles: `

  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageUploadComponent implements OnChanges{
  @Input() initialImageUrl: string | null = null
  @Output() imageUploaded = new EventEmitter<string>();

  previewUrl: string | ArrayBuffer | null = null;
  private _commonService = inject(CommonService);
  private _cdr = inject(ChangeDetectorRef);
  #destroy = inject(DestroyRef);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialImageUrl'] && changes['initialImageUrl'].currentValue) {
      this.previewUrl = changes['initialImageUrl'].currentValue
      this._cdr.detectChanges()
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;

        if (typeof result === 'string' || result instanceof ArrayBuffer) {
          this.previewUrl = result;
        }
      };
      reader.readAsDataURL(file);
      this.uploadImage(file);
    }
  }

  uploadImage(file: File): void {
    const formData = new FormData();
    formData.append('file', file);
    spinnerState$$.next(true);

    this._commonService.fileUpload(formData)
      .pipe(takeUntilDestroyed(this.#destroy))
      .subscribe((res) => {
        if (!res) return;
        this.imageUploaded.emit(res.url);
        this.previewUrl = res.url
        this._cdr.detectChanges();
      });
  }

  resetImage(): void {
    this.previewUrl = null;
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (input) input.value = '';
    this._cdr.detectChanges();
  }
}
