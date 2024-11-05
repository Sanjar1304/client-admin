import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {RouterLink} from "@angular/router";
import {ProductDisplayComponent} from '../../components/product-display/product-display.component';
import {ProductItems} from '../../types/product.type';
import {ProductService} from '../../services/product.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {spinnerState$$} from '../../utils/spinner.util';
import {toast} from 'ngx-sonner';
import {AgreeDialogComponent} from '../../components/agree-dialog/agree-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-deposits',
  standalone: true,
  imports: [
    RouterLink,
    ProductDisplayComponent
  ],
  templateUrl: './deposits.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepositsComponent implements OnInit{
  totalItems: number = 100;
  private _productService = inject(ProductService)
  public products = signal<ProductItems[]>([])
  #destroy = inject(DestroyRef)
  private _dialog = inject(MatDialog)
  isLoading = signal<boolean>(false)

  ngOnInit(): void {
    this.getList()
  }

  getList() {
    this.isLoading.set(true)
    this._productService.productList('deposit', 0, 100).pipe(takeUntilDestroyed(this.#destroy)).subscribe(res => {
      if (!res) return
      this.products.set(res.items)
      this.isLoading.set(false)
    })

  }

  deleteProduct(id:string) {
    spinnerState$$.next(true)
    this._productService.productDelete('deposit',id).pipe(takeUntilDestroyed(this.#destroy)).subscribe((res)=>{
      if (!res) return
      toast.success(res)
      this.getList()
    })
  }

  openProductDeleteDialog(id:string): void {
    const dialogRef = this._dialog.open(AgreeDialogComponent, {
      data: {title: 'Вы точно хотите удалит?'}
    });

    dialogRef.componentInstance.confirmed.subscribe(() => {
      this.deleteProduct(id)
      dialogRef.close()
    });
  }

}
