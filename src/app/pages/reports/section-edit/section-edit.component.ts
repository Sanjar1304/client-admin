import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatOption, MatRipple } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { MatTooltip } from '@angular/material/tooltip';
import { JsonPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ImageUploadComponent } from '../../../components/image-upload/image-upload.component';
import { ReportService } from '../../../services/report.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { spinnerState$$ } from '../../../utils/spinner.util';
import { toast } from 'ngx-sonner';
import {ImageUrls} from '../../../types/report.type';

@Component({
  selector: 'app-section-edit',
  standalone: true,
  imports: [
    FormsModule,
    MatCheckbox,
    MatError,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatOption,
    MatRipple,
    MatSelect,
    MatTab,
    MatTabGroup,
    MatTooltip,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    NgClass,
    ImageUploadComponent,
    JsonPipe
  ],
  templateUrl: './section-edit.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionEditComponent implements OnInit {
  sectionForm!: FormGroup;
  languages = ['UZB', 'RUS', 'ENG'];
  private _cdr = inject(ChangeDetectorRef)
  #destroy = inject(DestroyRef)
  private _reportService = inject(ReportService)
  private fb = inject(FormBuilder)
  private _router = inject(Router)
  private _route = inject(ActivatedRoute)

  ngOnInit() {
    this.sectionForm = this.fb.group({
      id:[null, Validators.required],
      reportId: [null, Validators.required],
      order: ['', Validators.required],
      title: this.fb.array(this.createLangGroups()),
      description: this.fb.array(this.createLangGroups()),
      imageUrls: this.fb.array(this.createLangImageGroups()),
    });

    this._route.queryParams.subscribe(param => {
      if (param['id'] && param['reportId']) {
        this.sectionForm.get('reportId')?.setValue(param['reportId']);
        this.loadSectionData(param['id']);
      }
    });
  }

  loadSectionData(id: string) {
    this._reportService.getSectionById(id).pipe(takeUntilDestroyed(this.#destroy)).subscribe(data => {
      this.sectionForm.patchValue({
        order: data?.order,
        id:data?.id
      });

      data?.title.forEach((item: any, index: number) => {
        const titleGroup = this.getLangControl('title', index);
        titleGroup.patchValue(item);
      });

      data?.description.forEach((item: any, index: number) => {
        const descriptionGroup = this.getLangControl('description', index);
        descriptionGroup.patchValue(item);
      });

      this.setImageUrls(data?.imageUrls)
    });
  }
  setImageUrls(data: ImageUrls[] | undefined): void {
    const imageUrlsArray = this.sectionForm.get('imageUrls') as FormArray;
    imageUrlsArray.clear();

    data?.forEach(item => {
      const filteredValues = item.values.filter((url: any) => url !== null)
      const formGroup = this.fb.group({
        values: this.fb.array(filteredValues.map(url => this.fb.control(url))),
        lang: [item.lang]
      });
      imageUrlsArray.push(formGroup);
    });
  }

  createLangGroups(): FormGroup[] {
    return this.languages.map(lang =>
      this.fb.group({
        text: ['', Validators.required],
        lang: [lang],
      })
    );
  }

  createLangImageGroups(): FormGroup[] {
    return this.languages.map(lang =>
      this.fb.nonNullable.group({
        values: this.fb.array([this.fb.control(''), Validators.required]),
        lang: [lang],
      })
    );
  }

  getLangControl(arrayName: string, index: number) {
    const formArray = this.sectionForm.get(arrayName) as FormArray;
    return formArray.at(index) as FormGroup;
  }

  submitForm() {
    if (this.sectionForm.valid) {
      spinnerState$$.next(true);
      this._reportService.sectionUpdate(this.sectionForm.value).pipe(takeUntilDestroyed(this.#destroy)).subscribe(res => {
        if (!res) return;
        toast.success('Успешно обновлено');
        this._router.navigate(['/reports/all']);
      });
    }
  }

  handleImage(image: string, index: number) {
    const imageUrlsArray = this.sectionForm.get('imageUrls') as FormArray;
    const valuesArray = imageUrlsArray.at(index).get('values') as FormArray;
    console.log(image)
    if (valuesArray.length > 0) {
      valuesArray.setControl(0, this.fb.control(image));
    } else {
      valuesArray.push(this.fb.control(image));
    }
  }
}
