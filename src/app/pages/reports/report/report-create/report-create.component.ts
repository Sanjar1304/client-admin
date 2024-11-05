import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {MatOption, MatRipple} from '@angular/material/core';
import {MatTooltip} from '@angular/material/tooltip';
import {Router, RouterLink} from '@angular/router';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {MatInput} from '@angular/material/input';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {MatCheckbox} from '@angular/material/checkbox';
import {spinnerState$$} from '../../../../utils/spinner.util';
import {ReportService} from '../../../../services/report.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {toast} from 'ngx-sonner';
import {TopicItems} from '../../../../types/report.type';
import {MatSelect} from '@angular/material/select';

@Component({
  selector: 'app-report-create',
  standalone: true,
  imports: [
    MatIcon,
    MatRipple,
    MatTooltip,
    RouterLink,
    MatLabel,
    MatError,
    MatFormField,
    ReactiveFormsModule,
    MatTab,
    MatTabGroup,
    MatInput,
    NgIf,
    MatCheckbox,
    NgClass,
    MatSelect,
    MatOption,
    NgForOf
  ],
  templateUrl: './report-create.component.html',
  styles: `
    .mat-form-field {
      width: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ReportCreateComponent implements OnInit{
  reportForm: FormGroup
  private _reportService = inject(ReportService)
  #destroy = inject(DestroyRef)
  public topics = signal<TopicItems[]>([])
  private _router = inject(Router)
  constructor(private fb: FormBuilder) {
    this.reportForm = this.fb.group({
      topicId: ['', Validators.required],
      title: this.fb.array([]),
      description: this.fb.array([]),
      publishedDate: ['', Validators.required],
      endDate: ['', Validators.required],
      publishOnDate: [false],
      hideOnEndDate: [false],
    });
  }

  ngOnInit(): void {
    this.getTopics()

    this.initializeLanguageFields();
  }

  getTopics(){
    this._reportService.topicList(0,100).pipe(takeUntilDestroyed(this.#destroy)).subscribe(res=>{
      if (!res) return
      this.topics.set(res.items)
    })
  }



  initializeLanguageFields() {
    const languages = ['UZB', 'RUS', 'ENG'];
    languages.forEach((lang) => {
      this.title.push(this.createLanguageField(lang));
      this.description.push(this.createLanguageField(lang));
    });
  }

  createLanguageField(lang: string) {
    return this.fb.group({
      text: ['', Validators.required],
      lang: [lang, Validators.required],
    });
  }

  get title(): FormArray {
    return this.reportForm.get('title') as FormArray;
  }

  get description(): FormArray {
    return this.reportForm.get('description') as FormArray;
  }
  getFormGroupAtDescription(index: number): FormGroup {
    return this.description.at(index) as FormGroup;
  }
  getFormGroupAtTitle(index: number): FormGroup {
    return this.title.at(index) as FormGroup;
  }

  onSubmit() {
    if (this.reportForm.valid) {
      spinnerState$$.next(true)
      this._reportService.reportCreate(this.reportForm.value).pipe(takeUntilDestroyed(this.#destroy)).subscribe(res => {
        if (!res) return
        toast.success('Успешно добавлено')
        this._router.navigate(['/reports/all'])
      })
    }
  }

  protected readonly top = top;
}
