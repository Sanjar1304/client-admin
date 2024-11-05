import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {shareReplay} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {spinnerState$$} from '../../utils/spinner.util';
import {toast} from 'ngx-sonner';
import {AgreeDialogComponent} from '../../components/agree-dialog/agree-dialog.component';
import {FaqService} from '../../services/faq.service';
import {FaqItems} from '../../types/faq.type';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {NgForOf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {MatMenu, MatMenuTrigger} from '@angular/material/menu';
import {MatRipple} from '@angular/material/core';
import {UiSvgIconComponent} from '../../components/ui/ui-svg-icon/ui-svg-icon.component';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [
    MatCardTitle,
    MatCardHeader,
    MatCard,
    NgForOf,
    MatCardContent,
    RouterLink,
    MatIcon,
    MatIconButton,
    MatMenu,
    MatRipple,
    UiSvgIconComponent,
    MatMenuTrigger
  ],
  templateUrl: './faq.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FaqComponent implements OnInit {
  #destroy = inject(DestroyRef)
  private _faqService = inject(FaqService)
  public dialog = inject(MatDialog)
  public faqs = signal<FaqItems[]>([])
  public page = signal<number>(0)
  public totalItems = signal<number>(0)
  public loading = false


  ngOnInit(): void {
    this.getList()
  }

  getList() {
    this.loading = true
    this._faqService.faqList(this.page(), 10).pipe(
      shareReplay(1),
      takeUntilDestroyed(this.#destroy)
    ).subscribe(res => {
      if (!res?.items) return
      this.faqs.set(res.items)
      this.totalItems.set(res.paging.totalItems)
      this.loading = false
    })
  }

  onPageChange(event: any) {
    console.log(event)
  }

  deleteFaq(id: string) {
    spinnerState$$.next(true)
    this._faqService.faqDelete(id).pipe(takeUntilDestroyed(this.#destroy)).subscribe((res) => {
      if (!res) return
      toast.success(res)
      this.getList()
    })
  }

  openFaqDeleteDialog(id: string): void {
    const dialogRef = this.dialog.open(AgreeDialogComponent, {
      data: {title: 'Вы точно хотите удалит?'}
    });

    dialogRef.componentInstance.confirmed.subscribe(() => {
      this.deleteFaq(id)
      dialogRef.close()
    });
  }
}
