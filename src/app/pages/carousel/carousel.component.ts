import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {NgClass, NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {PaginationComponent} from '../../components/pagination/pagination.component';
import {CarouselService} from '../../services/carousel.service';
import {CarouselItems} from '../../types/carousel.type';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {share, shareReplay} from 'rxjs';
import {MatMenu, MatMenuTrigger} from '@angular/material/menu';
import {MatRipple} from '@angular/material/core';
import {RouterLink} from '@angular/router';
import {UiSvgIconComponent} from '../../components/ui/ui-svg-icon/ui-svg-icon.component';
import {spinnerState$$} from '../../utils/spinner.util';
import {toast} from 'ngx-sonner';
import {AgreeDialogComponent} from '../../components/agree-dialog/agree-dialog.component';
import {MatDialog} from '@angular/material/dialog';

interface User {
  id: number;
  name: string;
  email: string;
  status: string;
}

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [
    NgClass,
    NgForOf,
    PaginationComponent,
    MatMenu,
    MatRipple,
    NgIf,
    NgOptimizedImage,
    RouterLink,
    UiSvgIconComponent,
    MatMenuTrigger
  ],
  templateUrl: './carousel.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarouselComponent implements OnInit {
  private _carouselService = inject(CarouselService)
  #destroy = inject(DestroyRef)
  public page = signal<number>(0)
  public totalItems = signal<number>(0)
  public loading = false
  public carousels = signal<CarouselItems[]>([])
  private _dialog = inject(MatDialog)


  ngOnInit(): void {
    this.getList()
  }
  getList() {
    this.loading = true
    this._carouselService.carouselList(this.page(), 10).pipe(takeUntilDestroyed(this.#destroy), shareReplay(1)).subscribe(res => {
      if (!res) return
      this.carousels.set(res.items)
      this.totalItems.set(res.paging.totalItems)
      this.loading = false
    })
  }

  onPageChange(event: any) {
    console.log(event)
  }

  deleteCarousel(id:string) {
    spinnerState$$.next(true)
    this._carouselService.carouselDelete(id).pipe(takeUntilDestroyed(this.#destroy)).subscribe((res)=>{
      if (!res) return
      toast.success(res)
      this.getList()
    })
  }

  openCarouselDeleteDialog(id:string): void {
    const dialogRef = this._dialog.open(AgreeDialogComponent, {
      data: {title: 'Вы точно хотите удалит?'}
    });

    dialogRef.componentInstance.confirmed.subscribe(() => {
      this.deleteCarousel(id)
      dialogRef.close()
    });
  }
}
