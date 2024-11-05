import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButton, MatIconButton} from '@angular/material/button';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {ImageUploadComponent} from '../../../components/image-upload/image-upload.component';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {MatError} from '@angular/material/form-field';
import {MatDivider} from '@angular/material/divider';
import {BannerService} from '../../../services/banner.service';
import {MatOption, MatSelect} from '@angular/material/select';
import {UiSvgIconComponent} from '../../../components/ui/ui-svg-icon/ui-svg-icon.component';
import {MatIcon} from '@angular/material/icon';
import {Router, RouterLink} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {toast} from 'ngx-sonner';
import {spinnerState$$} from '../../../utils/spinner.util';
import {MatRipple} from '@angular/material/core';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  selector: 'app-create-banner',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInput,
    MatLabel,
    MatFormField,
    MatButton,
    NgForOf,
    ImageUploadComponent,
    MatTab,
    MatTabGroup,
    NgIf,
    MatError,
    MatDivider,
    MatSelect,
    MatOption,
    MatIconButton,
    UiSvgIconComponent,
    MatIcon,
    RouterLink,
    MatRipple,
    MatTooltip,
    NgClass
  ],
  templateUrl: './create-banner.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateBannerComponent implements OnInit {
  @ViewChild(ImageUploadComponent) imageUploadComponent!: ImageUploadComponent
  bannerCreateForm!: FormGroup;
  private fb = inject(FormBuilder);
  #destroy = inject(DestroyRef)
  private _router = inject(Router)
  private _bannerService = inject(BannerService)
  public bannerTypeList = signal<string[]>([])

  get backgroundColors() {
    return this.bannerCreateForm.get('backgroundColors') as FormArray;
  }

  get btnColors() {
    return this.bannerCreateForm.get('btnColors') as FormArray;
  }

  get indicatorBorderColors() {
    return this.bannerCreateForm.get('indicatorBorderColors') as FormArray;
  }

  ngOnInit() {
    this.bannerCreateForm = this.fb.group({
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
      imageUrl: ['', Validators.required],
      redirectUrl: ['', Validators.required],
      textColour: ['', Validators.required],
      backgroundColors: this.fb.array([this.fb.control('', Validators.required)]),
      btnColors: this.fb.array([this.fb.control('', Validators.required)]),
      indicatorBorderColors: this.fb.array([this.fb.control('', Validators.required)]),
      bannerProductType: ['', Validators.required]
    });
    this.getBannerTypeList()
  }

  getBannerTypeList() {
    this._bannerService.getBannerType().pipe().subscribe((res) => {
      if (!res) return
      this.bannerTypeList.set(res)
    })

  }

  private createLanguageGroup(lang: string): FormGroup {
    return this.fb.group({
      text: ['', Validators.required],
      lang: [lang]
    });
  }

  get btnTextArray(): FormArray {
    return this.bannerCreateForm.get('btnText') as FormArray;
  }

  get titleTextArray(): FormArray {
    return this.bannerCreateForm.get('title') as FormArray;
  }

  get descriptionTextArray(): FormArray {
    return this.bannerCreateForm.get('description') as FormArray;
  }

  addColor(arrayName: 'backgroundColors' | 'btnColors' | 'indicatorBorderColors') {
    (this.bannerCreateForm.get(arrayName) as FormArray).push(this.fb.control('#ffffff'));
  }

  removeColor(arrayName: 'backgroundColors' | 'btnColors' | 'indicatorBorderColors', index: number) {
    (this.bannerCreateForm.get(arrayName) as FormArray).removeAt(index);
  }

  onSubmit() {
    if (this.bannerCreateForm.valid) {
      spinnerState$$.next(true)
      this._bannerService.bannerCreate(this.bannerCreateForm.value).pipe(takeUntilDestroyed(this.#destroy)).subscribe((res) => {
        if (!res) return
        toast.success('Успешно создан')
        this._router.navigate(['/banners']).then(() => {
        })
      })
    }
  }


  handleImageUpload(image: string): void {
    if (image) this.bannerCreateForm.get('imageUrl')?.setValue(image)

  }

  refreshForm(){
    this.bannerCreateForm.reset();
    this.imageUploadComponent.resetImage()
  }
}
