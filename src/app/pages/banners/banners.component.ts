import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {BannerService} from '../../services/banner.service';
import {shareReplay} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {BannerList} from '../../types/banner.type';
import {RouterLink} from '@angular/router';
import {PaginationComponent} from '../../components/pagination/pagination.component';
import {NgClass, NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {UiSvgIconComponent} from '../../components/ui/ui-svg-icon/ui-svg-icon.component';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatRipple} from '@angular/material/core';
import {AgreeDialogComponent} from '../../components/agree-dialog/agree-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {spinnerState$$} from '../../utils/spinner.util';
import {toast} from 'ngx-sonner';


@Component({
  selector: 'app-banners',
  standalone: true,
  imports: [
    RouterLink,
    PaginationComponent,
    NgForOf,
    NgClass,
    NgIf,
    UiSvgIconComponent,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    MatRipple,
    NgOptimizedImage
  ],
  templateUrl: './banners.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BannersComponent implements OnInit {
  #destroy = inject(DestroyRef)
  private _bannerService = inject(BannerService)
  public dialog = inject(MatDialog)
  public banners = signal<BannerList[]>([])
  public page = signal<number>(0)
  public totalItems = signal<number>(0)
  public loading = false


  ngOnInit(): void {
    this.getList()
  }

  getList() {
    this.loading = true
    this._bannerService.bannerList(this.page(), 10).pipe(
      shareReplay(1),
      takeUntilDestroyed(this.#destroy)
    ).subscribe(res => {
      if (!res?.items) return
      this.banners.set(res.items)
      this.totalItems.set(res.paging.totalItems)
      this.loading = false
    })
  }

  onPageChange(event: any) {
    console.log(event)
  }

  deleteBanner(id:string) {
    spinnerState$$.next(true)
    this._bannerService.bannerDelete(id).pipe(takeUntilDestroyed(this.#destroy)).subscribe((res)=>{
      if (!res) return
      toast.success(res)
      this.getList()
    })
  }

  openBannerDeleteDialog(id:string): void {
    const dialogRef = this.dialog.open(AgreeDialogComponent, {
      data: {title: 'Вы точно хотите удалит?'}
    });

    dialogRef.componentInstance.confirmed.subscribe(() => {
      this.deleteBanner(id)
      dialogRef.close()
    });
  }
}
