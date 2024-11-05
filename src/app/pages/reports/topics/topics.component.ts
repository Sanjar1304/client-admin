import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {ReportService} from '../../../services/report.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {TopicItems} from '../../../types/report.type';
import {Router, RouterLink} from '@angular/router';
import {MatChip, MatChipRemove, MatChipSet} from '@angular/material/chips';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {spinnerState$$} from '../../../utils/spinner.util';
import {toast} from 'ngx-sonner';

@Component({
  selector: 'app-topics',
  standalone: true,
  imports: [
    RouterLink,
    MatChipSet,
    MatChip,
    NgForOf,
    MatIconButton,
    MatIcon,
    MatChipRemove,
    MatButton,
    MatError,
    ReactiveFormsModule,
    MatInput,
    MatLabel,
    MatFormField,
    NgIf,
    NgClass
  ],
  templateUrl: './topics.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopicsComponent implements OnInit {
  loading = signal<boolean>(false)
  #destroy = inject(DestroyRef)
  private _cdr = inject(ChangeDetectorRef)
  private _reportService = inject(ReportService)
  public topics = signal<TopicItems[]>([])
  private _router = inject(Router)
  createTopicForm: FormGroup = new FormGroup({
    name: new FormArray([
      this.createLanguageGroup('UZB'),
      this.createLanguageGroup('RUS'),
      this.createLanguageGroup('ENG')
    ])
  })

  private createLanguageGroup(lang: string): FormGroup {
    return new FormGroup({
      text: new FormControl('', Validators.required),
      lang: new FormControl(lang, Validators.required)
    });
  }

  get nameTextArray(): FormArray {
    return this.createTopicForm.get('name') as FormArray;
  }

  onSubmit() {
    if (this.createTopicForm.valid) {
      spinnerState$$.next(true)

      this._reportService.topicCreate(this.createTopicForm.value).pipe(takeUntilDestroyed(this.#destroy)).subscribe(res => {
        if (!res) return
        toast.success('Успешно добавлено')
        this.resetTextFields()
        this.getList()
      })
    }
  }

  ngOnInit() {

    this.getList()

  }

  getList() {
    this.loading.set(true)
    this._reportService.topicList(0, 100).pipe(takeUntilDestroyed(this.#destroy)).subscribe(res => {
      if (!res) return
      this.topics.set(res.items)
      this.loading.set(false)
    })
  }

  removeTopic(id: string) {
    this._reportService.sectionTopicDelete('topic',id).pipe(takeUntilDestroyed(this.#destroy)).subscribe(res => {
      if (!res) return
      toast.success(res)
      this.getList()
    })
  }
  getFormGroupAt(index: number): FormGroup {
    return this.nameTextArray.at(index) as FormGroup;
  }
  resetTextFields(): void {
    const nameArray = this.createTopicForm.get('name') as FormArray;
    nameArray.controls.forEach((group: FormGroup | any) => {
      group.get('text')?.setValue('');
      group.get('text')?.updateValueAndValidity();
      this._cdr.detectChanges()
    });
  }
}
