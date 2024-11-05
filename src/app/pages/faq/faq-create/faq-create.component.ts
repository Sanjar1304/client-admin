import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {FaqService} from '../../../services/faq.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ImageUploadComponent} from '../../../components/image-upload/image-upload.component';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {MatOption, MatRipple} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {MatTooltip} from '@angular/material/tooltip';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {UiSvgIconComponent} from '../../../components/ui/ui-svg-icon/ui-svg-icon.component';
import {toast} from 'ngx-sonner';
import {spinnerState$$} from '../../../utils/spinner.util';

@Component({
  selector: 'app-faq-create',
  standalone: true,
  imports: [
    ImageUploadComponent,
    MatButton,
    MatError,
    MatFormField,
    MatIcon,
    MatIconButton,
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
    UiSvgIconComponent,
    NgClass
  ],
  templateUrl: './faq-create.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FaqCreateComponent implements OnInit {
  #destroy = inject(DestroyRef)
  private _cdr = inject(ChangeDetectorRef)
  public faqTypes = signal<string[]>([])
  private _faqService = inject(FaqService)
  private _router = inject(Router)
  public products = signal<any>([])
  faqCreateForm: FormGroup = new FormGroup({
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
    productId: new FormControl<string | null>({value: null, disabled: true})
  })


  getFaqTypes() {
    this._faqService.faqTypes().pipe(takeUntilDestroyed(this.#destroy)).subscribe(res => {
      if (!res) return
      this.faqTypes.set(res)
    })
  }

  private createLanguageGroup(lang: string): FormGroup {
    return new FormGroup({
      text: new FormControl('', Validators.required),
      lang: new FormControl(lang, Validators.required),
    });
  }

  getType(event: { value: string }) {
    const productIdControl = this.faqCreateForm.get('productId');

    if (event.value === 'PRODUCT') {
      productIdControl?.enable({emitEvent: false});
      productIdControl?.setValidators([Validators.required]);
    } else {
      productIdControl?.reset(null, {emitEvent: false})
      productIdControl?.disable({emitEvent: false})
      productIdControl?.clearValidators();
    }

    productIdControl?.updateValueAndValidity({emitEvent: false});
    this._cdr.detectChanges();
  }

  get questionArray(): FormArray {
    return this.faqCreateForm.get('question') as FormArray;
  }

  get answerArray(): FormArray {
    return this.faqCreateForm.get('answer') as FormArray;
  }

  ngOnInit(): void {
    this.getFaqTypes()
  }

  onSubmit() {
    if (this.faqCreateForm.valid) {
      spinnerState$$.next(true)
      const formData = this.faqCreateForm.getRawValue()
      this._faqService.faqCreate(formData).pipe(takeUntilDestroyed(this.#destroy)).subscribe(res => {
        if (res?.id) toast.success('Успешно добавлена') , this._router.navigate(['/faq'])
      })
    }

  }

}
