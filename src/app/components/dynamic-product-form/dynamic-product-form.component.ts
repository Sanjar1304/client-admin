import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  DestroyRef,
  EventEmitter,
  inject, Input,
  OnInit,
  Output,
  signal
} from '@angular/core';
import {Form, FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {JsonPipe, NgClass, NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {MatError, MatLabel} from '@angular/material/form-field';
import {MatFormField, MatInput} from '@angular/material/input';
import {ImageUploadComponent} from '../image-upload/image-upload.component';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {RouterLink} from '@angular/router';
import {MatOption, MatRipple} from '@angular/material/core';
import {shareReplay, take} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {BannerService} from '../../services/banner.service';
import {BannerList} from '../../types/banner.type';
import {MatSelect} from '@angular/material/select';
import {ProductService} from '../../services/product.service';

@Component({
  selector: 'app-dynamic-product-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatTabGroup,
    MatTab,
    NgForOf,
    MatFormField,
    MatInput,
    MatLabel,
    ImageUploadComponent,
    MatButton,
    JsonPipe,
    NgIf,
    MatIcon,
    MatTooltip,
    RouterLink,
    MatRipple,
    NgClass,
    MatError,
    MatSelect,
    MatOption,
    NgOptimizedImage
  ],
  templateUrl: './dynamic-product-form.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicProductFormComponent implements OnInit {
  @Input({required: true}) type: string = ''
  @Output() validFormData = new EventEmitter<FormGroup>()
  #destroy = inject(DestroyRef)
  private _cdr = inject(ChangeDetectorRef)
  private _productService = inject(ProductService)
  private _bannerService = inject(BannerService)
  public productTypes = signal<string[]>([])
  public banners = signal<BannerList[]>([])
  public dynamicProductForm: FormGroup = new FormGroup({
    name: new FormArray([
      this.createLanguageGroup('UZB'),
      this.createLanguageGroup('RUS'),
      this.createLanguageGroup('ENG'),
    ]),
    advantagesTitle: new FormArray([
      this.createLanguageGroup('UZB'),
      this.createLanguageGroup('RUS'),
      this.createLanguageGroup('ENG'),
    ]),
    productInfoTitle: new FormArray([
      this.createLanguageGroup('UZB'),
      this.createLanguageGroup('RUS'),
      this.createLanguageGroup('ENG'),
    ]),
    productUserType: new FormControl('', Validators.required),
    bannerId: new FormControl('', Validators.required),
    currency: new FormControl('', Validators.required),
    productInfo: new FormArray([this.pushValues('productInfo')]),
    productAdvantages: new FormArray([this.pushValues('productAdvantages')]),
    type: new FormControl('', Validators.required)
  })

  private createLanguageGroup(lang: string): FormGroup {
    return new FormGroup({
      text: new FormControl('', Validators.required),
      lang: new FormControl(lang, Validators.required),
    });
  }

  private pushValues(type: string): FormGroup {
    return type === 'productInfo' ? new FormGroup({
        title: new FormArray([
          this.createLanguageGroup('UZB'),
          this.createLanguageGroup('RUS'),
          this.createLanguageGroup('ENG')
        ]),
        content: new FormArray([
          this.createLanguageGroup('UZB'),
          this.createLanguageGroup('RUS'),
          this.createLanguageGroup('ENG')
        ])
      })
      : new FormGroup({
        title: new FormArray([
          this.createLanguageGroup('UZB'),
          this.createLanguageGroup('RUS'),
          this.createLanguageGroup('ENG')
        ]),
        content: new FormArray([
          this.createLanguageGroup('UZB'),
          this.createLanguageGroup('RUS'),
          this.createLanguageGroup('ENG')
        ]),
        imageUrl: new FormControl('', Validators.required),
      })

  }

  getTitleControl(index: number, type: 'title' | 'content'): FormControl {
    const formArray = this.productInfo.at(0).get(type) as FormArray;
    return formArray.at(index).get('text') as FormControl;
  }


  nameTextArray(): FormArray {
    return this.dynamicProductForm.get('name') as FormArray
  }

  advantagesTitleArray(): FormArray {
    return this.dynamicProductForm.get('advantagesTitle') as FormArray;
  }

  productInfoTitleArray(): FormArray {
    return this.dynamicProductForm.get('productInfoTitle') as FormArray;
  }

  get productInfo(): FormArray {
    return this.dynamicProductForm.get('productInfo') as FormArray;
  }

  submitForm() {
    if (this.dynamicProductForm.valid) {
      this.validFormData.emit(this.dynamicProductForm);
    }
  }

  get productAdvantages(): FormArray {
    return this.dynamicProductForm.get('productAdvantages') as FormArray;
  }

  getBannerList() {
    this._bannerService.bannerList(0, 100).pipe(
      shareReplay(1),
      takeUntilDestroyed(this.#destroy)
    ).subscribe(res => {
      if (!res?.items) return
      this.banners.set(res.items)
    })
  }

  getAdvantagesControl(index: number, type: 'title' | 'content'): FormControl {
    const formArray = this.productAdvantages.at(0).get(type) as FormArray;
    return formArray.at(index).get('text') as FormControl;
  }

  getType() {
    if (['loan', 'card', 'transfer'].includes(this.type)) {
      this._productService.getProductType(this.type).pipe(takeUntilDestroyed(this.#destroy)).subscribe(res => {
        if (!res) return;
        this.productTypes.set(res)
      })
    }
  }

  handleImageUpload(image: string) {
    if (image) this.productAdvantages.at(0).get('imageUrl')?.setValue(image)
  }

  ngOnInit(): void {
    this.getBannerList()
    if (this.type === 'deposit') {
      const type = this.dynamicProductForm.get('type')
      type?.clearValidators();
      type?.disable()
      this._cdr.detectChanges()
    }
    this.getType()
  }
}
