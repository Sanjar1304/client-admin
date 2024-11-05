import {ChangeDetectionStrategy, Component, DestroyRef, inject} from '@angular/core';
import {ProductService} from '../../../services/product.service';
import {Router} from '@angular/router';
import {spinnerState$$} from '../../../utils/spinner.util';
import {FormGroup} from '@angular/forms';
import {toast} from 'ngx-sonner';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {DynamicProductFormComponent} from '../../../components/dynamic-product-form/dynamic-product-form.component';

@Component({
  selector: 'app-transfer-create',
  standalone: true,
  imports: [
    DynamicProductFormComponent
  ],
  templateUrl: './transfer-create.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransferCreateComponent {
  #destroy = inject(DestroyRef)
  private _productService = inject(ProductService)
  private _router = inject(Router)

  handleData(event: FormGroup) {
    spinnerState$$.next(true)
    this._productService.productCreate('transfer', event.value).pipe(takeUntilDestroyed(this.#destroy)).subscribe(res => {
      if (!res) return
      toast.success('Успешно добавлено')
      this._router.navigate(['/transfers'])
    })
  }


}
