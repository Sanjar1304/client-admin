import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {ReportService} from '../../../services/report.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ReportItems} from '../../../types/report.type';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {MatChip, MatChipSet} from '@angular/material/chips';
import {MatIcon} from '@angular/material/icon';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {RouterLink} from '@angular/router';
import {MatMenu, MatMenuTrigger} from "@angular/material/menu";
import {MatRipple} from "@angular/material/core";
import {UiSvgIconComponent} from "../../../components/ui/ui-svg-icon/ui-svg-icon.component";
import {spinnerState$$} from '../../../utils/spinner.util';
import {toast} from 'ngx-sonner';
import {AgreeDialogComponent} from '../../../components/agree-dialog/agree-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    MatChip,
    MatChipSet,
    MatIcon,
    RouterLink,
    MatMenu,
    MatRipple,
    UiSvgIconComponent,
    MatMenuTrigger,
    NgClass,
    MatExpansionPanelTitle,
    MatExpansionPanelHeader,
    MatExpansionPanel,
    MatAccordion,
    MatButton
  ],
  templateUrl: './report.component.html',
  styles: ``,
  animations: [
    trigger('accordionToggle', [
      state('collapsed', style({height: '0', opacity: 0})),
      state('expanded', style({height: '*', opacity: 1})),
      transition('collapsed <=> expanded', [animate('200ms ease-in-out')])
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportComponent implements OnInit {
  #destroy = inject(DestroyRef);
  private _cdr = inject(ChangeDetectorRef);
  private _reportService = inject(ReportService);
  public reports = signal<ReportItems[]>([]);
  public loading = signal<boolean>(false);
  expandedSectionIndex = signal<number | null>(null); // Har bir sektsiya uchun indeksni kuzatish

  private _dialog = inject(MatDialog);

  ngOnInit() {
    this.getList();
  }

  deleteReport(id: string) {
    spinnerState$$.next(true);
    this._reportService.reportDelete(id)
      .pipe(takeUntilDestroyed(this.#destroy))
      .subscribe((res) => {

        if (!res) return;
        toast.success(res);
        this.getList();
      });
  }

  deleteSection(id: string) {
    spinnerState$$.next(true);
    this._reportService.sectionTopicDelete('section', id)
      .pipe(takeUntilDestroyed(this.#destroy))
      .subscribe((res) => {
        if (!res) return;
        toast.success(res);
        this.getList();
      });
  }

  openReportDeleteDialog(id: string, type: 'section' | 'report'): void {
    const dialogRef = this._dialog.open(AgreeDialogComponent, {
      data: {title: 'Вы точно хотите удалит?'}
    });

    dialogRef.componentInstance.confirmed.subscribe(() => {
      type === 'report' ? this.deleteReport(id) : this.deleteSection(id)
      dialogRef.close();
    });
  }

  getList() {
    this.loading.set(true);
    this._reportService.reportList(0, 100)
      .pipe(takeUntilDestroyed(this.#destroy))
      .subscribe((res) => {
        console.log(typeof res)
        if (!res) return;
        this.reports.set(res.items);
        this.loading.set(false);
      });
  }

  toggleSection(index: number | null) {
    this.expandedSectionIndex.set(index);
  }
}
