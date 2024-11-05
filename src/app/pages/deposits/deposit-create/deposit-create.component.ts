import {ChangeDetectionStrategy, Component, DestroyRef, inject} from '@angular/core';
import {ProductService} from '../../../services/product.service';
import {Router} from '@angular/router';
import {FormGroup} from '@angular/forms';
import {spinnerState$$} from '../../../utils/spinner.util';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {toast} from 'ngx-sonner';
import {DynamicProductFormComponent} from '../../../components/dynamic-product-form/dynamic-product-form.component';

@Component({
  selector: 'app-deposit-create',
  standalone: true,
  imports: [
    DynamicProductFormComponent
  ],
  templateUrl: './deposit-create.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepositCreateComponent {

  #destroy = inject(DestroyRef)
  private _productService = inject(ProductService)
  private _router = inject(Router)

  handleData(event: FormGroup) {
    spinnerState$$.next(true)
    this._productService.productCreate('deposit', event.value).pipe(takeUntilDestroyed(this.#destroy)).subscribe(res => {
      if (!res) return
      toast.success('Успешно добавлено')
      this._router.navigate(['/deposits'])
    })
  }

}
