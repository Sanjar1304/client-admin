import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal, ViewChild} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {BannerService} from '../../../services/banner.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {BannerOneDto} from '../../../types/banner.type';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ImageUploadComponent} from '../../../components/image-upload/image-upload.component';
import {toast} from 'ngx-sonner';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {MatOption, MatRipple} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {UiSvgIconComponent} from '../../../components/ui/ui-svg-icon/ui-svg-icon.component';
import {MatButton, MatIconButton} from '@angular/material/button';

@Component({
  selector: 'app-banner-update',
  standalone: true,
  imports: [
    MatLabel,
    MatError,
    ReactiveFormsModule,
    MatInput,
    MatFormField,
    MatTab,
    MatTabGroup,
    NgIf,
    NgForOf,
    ImageUploadComponent,
    MatOption,
    MatSelect,
    MatIcon,
    MatTooltip,
    RouterLink,
    MatRipple,
    NgClass,
    UiSvgIconComponent,
    MatButton,
    MatIconButton
  ],
  templateUrl: './banner-update.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BannerUpdateComponent implements OnInit {
  @ViewChild(ImageUploadComponent) imageUploadComponent!: ImageUploadComponent;
  public bannerTypeList = signal<string[]>([])
  public imageUrl = signal<string>('')
  bannerEditForm!: FormGroup;
  #destroy = inject(DestroyRef)
  private fb = inject(FormBuilder);
  private bannerId = signal<string>('')
  private _route = inject(ActivatedRoute);
  private _bannerService = inject(BannerService)
  private _router = inject(Router)

  ngOnInit(): void {
    this._route.queryParams.subscribe(params => {
      if (params) this.bannerId.set(params['id'])
      this.getBannerOne()
      this.getBannerTypeList();
      this.initializeForm()
    })
  }


  getBannerOne() {
    this._bannerService.bannerOne(this.bannerId()).pipe(takeUntilDestroyed(this.#destroy)).subscribe(res => {
      if (!res) return

      this.patchValueForm(res)
    })
  }

  private initializeForm() {
    this.bannerEditForm = this.fb.group({
      title: this.fb.array([
        this.createLanguageGroup('UZB'),
        this.createLanguageGroup('RUS'),
        this.createLanguageGroup('ENG')
      ]),
      description: this.fb.array([
        this.createLanguageGroup('UZB'),
        this.createLanguageGroup('RUS'),
        this.createLanguageGroup('ENG')
      ]),
      btnText: this.fb.array([
        this.createLanguageGroup('UZB'),
        this.createLanguageGroup('RUS'),
        this.createLanguageGroup('ENG')
      ]),
      id: [this.bannerId(), Validators.required],
      imageUrl: ['', Validators.required],
      redirectUrl: ['', Validators.required],
      textColour: ['', Validators.required],
      backgroundColors: this.fb.array([this.fb.control('', Validators.required)]),
      btnColors: this.fb.array([this.fb.control('', Validators.required)]),
      indicatorBorderColors: this.fb.array([this.fb.control('', Validators.required)]),
      bannerProductType: ['', Validators.required]
    });
  }

  private createLanguageGroup(lang: string, text = ''): FormGroup {
    return this.fb.group({
      text: [text, Validators.required],
      lang: [lang]
    });
  }

  patchValueForm(data = {} as BannerOneDto) {
    this.imageUrl.set(data.imageUrl)
    this.bannerEditForm.patchValue({
      imageUrl: data.imageUrl,
      redirectUrl: data.redirectUrl,
      textColour: data.textColour,
      bannerProductType: data.bannerProductType
    })
    this.populateFormArray(this.titleTextArray, data.title);
    this.populateFormArray(this.descriptionTextArray, data.description);
    this.populateFormArray(this.btnTextArray, data.btnText);

    this.setColorArray(this.backgroundColors, data.backgroundColors);
    this.setColorArray(this.btnColors, data.btnColors);
    this.setColorArray(this.indicatorBorderColors, data.indicatorBorderColors);
  }

  onSubmit() {
    if (this.bannerEditForm.valid) {

      this._bannerService.bannerUpdate(this.bannerEditForm.value).pipe(takeUntilDestroyed(this.#destroy)).subscribe((res) => {
        if (!res) return;
        toast.success('Успешно обновлён');
        this._router.navigate(['/banners']);
      });
    }
  }

  private populateFormArray(formArray: FormArray, data: any[]) {
    formArray.clear()
    console.log('populateFormArray', formArray, data)
    data.forEach(item => {
      formArray.push(this.createLanguageGroup(item.lang, item.text));
    });
  }

  private setColorArray(formArray: FormArray, colors: string[]) {
    formArray.clear();
    console.log('setColorArray', formArray, colors)
    colors.forEach(color => {
      formArray.push(this.fb.control(color, Validators.required));
    });
  }

  handleImageUpload(image: string): void {
    if (image) this.bannerEditForm.get('imageUrl')?.setValue(image);
  }

  refreshForm() {
    this.bannerEditForm.reset();
    this.imageUploadComponent.resetImage();
  }

  get btnTextArray(): FormArray {
    return this.bannerEditForm.get('btnText') as FormArray;
  }

  get titleTextArray(): FormArray {
    return this.bannerEditForm.get('title') as FormArray;
  }

  get descriptionTextArray(): FormArray {
    return this.bannerEditForm.get('description') as FormArray;
  }

  get backgroundColors(): FormArray {
    return this.bannerEditForm.get('backgroundColors') as FormArray;
  }

  get btnColors(): FormArray {
    return this.bannerEditForm.get('btnColors') as FormArray;
  }

  get indicatorBorderColors(): FormArray {
    return this.bannerEditForm.get('indicatorBorderColors') as FormArray;
  }

  getBannerTypeList() {
    this._bannerService.getBannerType().pipe().subscribe((res) => {
      if (!res) return;
      this.bannerTypeList.set(res);
    });
  }

  addColor(arrayName: 'backgroundColors' | 'btnColors' | 'indicatorBorderColors') {
    (this.bannerEditForm.get(arrayName) as FormArray).push(this.fb.control('#ffffff'));
  }

  removeColor(arrayName: 'backgroundColors' | 'btnColors' | 'indicatorBorderColors', index: number) {
    (this.bannerEditForm.get(arrayName) as FormArray).removeAt(index);
  }
}
