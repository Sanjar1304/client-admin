import {ChangeDetectionStrategy, Component, DestroyRef, inject} from '@angular/core';
import {DynamicProductFormComponent} from '../../../components/dynamic-product-form/dynamic-product-form.component';
import {FormGroup} from '@angular/forms';
import {ProductService} from '../../../services/product.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {spinnerState$$} from '../../../utils/spinner.util';
import {toast} from 'ngx-sonner';
import {Router} from '@angular/router';

@Component({
  selector: 'app-loan-create',
  standalone: true,
  imports: [
    DynamicProductFormComponent
  ],
  templateUrl: './loan-create.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoanCreateComponent {
  #destroy = inject(DestroyRef)
  private _productService = inject(ProductService)
  private _router = inject(Router)

  handleData(event: FormGroup) {
    spinnerState$$.next(true)
    this._productService.productCreate('loan', event.value).pipe(takeUntilDestroyed(this.#destroy)).subscribe(res => {
      if (!res) return
      toast.success('Успешно добавлено')
      this._router.navigate(['/loans'])
    })
  }
}
