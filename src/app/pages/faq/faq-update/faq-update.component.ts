import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {FaqService} from '../../../services/faq.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FaqOneDto} from '../../../types/faq.type';
import {FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {toast} from 'ngx-sonner';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {MatOption, MatRipple} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import { NgClass, NgForOf, NgIf} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  selector: 'app-faq-update',
  standalone: true,
  imports: [
    MatError,
    ReactiveFormsModule,
    MatInput,
    MatLabel,
    MatFormField,
    MatTab,
    MatTabGroup,
    MatOption,
    MatSelect,
    NgClass,
    MatIcon,
    MatTooltip,
    RouterLink,
    MatRipple,
    NgForOf,
    NgIf
  ],
  templateUrl: './faq-update.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FaqUpdateComponent implements OnInit {
  #destroy = inject(DestroyRef)
  public faqTypes = signal<string[]>([])
  public products = signal<any>([])
  private faqId = signal<string>('')
  private _route = inject(ActivatedRoute)
  private _cdr = inject(ChangeDetectorRef)
  private _faqService = inject(FaqService)
  private _router = inject(Router)

  faqEditForm: FormGroup = new FormGroup({
    question: new FormArray([
      this.createLanguageGroup('UZB'),
      this.createLanguageGroup('RUS'),
      this.createLanguageGroup('ENG')
    ]),
    answer: new FormArray([
      this.createLanguageGroup('UZB'),
      this.createLanguageGroup('RUS'),
      this.createLanguageGroup('ENG')
    ]),
    tags: new FormArray([]),
    faqProductType: new FormControl<string | null>(null, Validators.required),
    productId: new FormControl<string | null>({value: null, disabled: true}),
    id: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    this._route.queryParams.subscribe(params => params['id'] && this.faqId.set(params['id']))
    this.getFaqOne()
    this.getFaqTypes();
  }


  getFaqOne() {
    this._faqService.faqOne(this.faqId()).pipe(takeUntilDestroyed(this.#destroy)).subscribe(res => {
      if (!res) return
      this.patchValueForm(res)
    })
  }

  getFaqTypes() {
    this._faqService.faqTypes().pipe(takeUntilDestroyed(this.#destroy)).subscribe(res => {
      if (!res) return;
      this.faqTypes.set(res);
    });
  }

  patchValueForm(res: FaqOneDto) {
    this.faqEditForm.patchValue({
      question: res.question,
      answer: res.answer,
      faqProductType: res.faqProductType,
      productId: res.productId,
      id:res.id
    })

    this.getType({value: res.faqProductType})
  }

  private createLanguageGroup(lang: string): FormGroup {
    return new FormGroup({
      text: new FormControl('', Validators.required),
      lang: new FormControl(lang, Validators.required),
    });
  }

  getType(event: { value: string }) {
    const productIdControl = this.faqEditForm.get('productId');

    if (['LOAN', 'DEPOSIT', 'TRANSFER', 'CARD'].includes(event.value)) {
      productIdControl?.enable({emitEvent: false});
      productIdControl?.setValidators([Validators.required]);
    } else {
      productIdControl?.reset(null, {emitEvent: false});
      productIdControl?.disable({emitEvent: false});
      productIdControl?.clearValidators();
    }

    productIdControl?.updateValueAndValidity({emitEvent: false});
    this._cdr.detectChanges();
  }

  onSubmit() {
    if (this.faqEditForm.valid) {
      const formData = this.faqEditForm.getRawValue();
      this._faqService.faqUpdate(formData).pipe(takeUntilDestroyed(this.#destroy)).subscribe(res => {
        res?.id && toast.success('Успешно обновлён');
        this._router.navigate(['/faq']);
      });
    }
  }

  get questionArray(): FormArray {
    return this.faqEditForm.get('question') as FormArray;
  }

  get answerArray(): FormArray {
    return this.faqEditForm.get('answer') as FormArray;
  }
}
