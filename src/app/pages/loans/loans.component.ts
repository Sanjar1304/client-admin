import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {NgForOf} from "@angular/common";
import {PaginationComponent} from "../../components/pagination/pagination.component";
import {RouterLink} from '@angular/router';
import {ProductDisplayComponent} from '../../components/product-display/product-display.component';
import {ProductService} from '../../services/product.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ProductItems} from '../../types/product.type';
import {spinnerState$$} from '../../utils/spinner.util';
import {toast} from 'ngx-sonner';
import {AgreeDialogComponent} from '../../components/agree-dialog/agree-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-loans',
  standalone: true,
  imports: [
    NgForOf,
    PaginationComponent,
    RouterLink,
    ProductDisplayComponent
  ],
  templateUrl: './loans.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoansComponent implements OnInit {
  isLoading = signal<boolean>(false)
  totalItems: number = 100;
  private _productService = inject(ProductService)
  public products = signal<ProductItems[]>([])
  private _dialog = inject(MatDialog)
  #destroy = inject(DestroyRef)
  ngOnInit(): void {
    this.getList()
  }

  getList() {
    this.isLoading.set(true)
    this._productService.productList('loan', 0, 100).pipe(takeUntilDestroyed(this.#destroy)).subscribe(res => {
      if (!res) return
      this.products.set(res.items)
      this.isLoading.set(false)
    })
  }

  deleteProduct(id: string) {
    spinnerState$$.next(true)
    this._productService.productDelete('loan', id).pipe(takeUntilDestroyed(this.#destroy)).subscribe((res) => {
      if (!res) return
      toast.success(res)
      this.getList()
    })
  }

  openProductDeleteDialog(id: string): void {
    const dialogRef = this._dialog.open(AgreeDialogComponent, {
      data: {title: 'Вы точно хотите удалит?'}
    });

    dialogRef.componentInstance.confirmed.subscribe(() => {
      this.deleteProduct(id)
      dialogRef.close()
    });
  }
}
