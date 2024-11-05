import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {NgClass, NgForOf} from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [
    NgClass,
    NgForOf
  ],
  templateUrl: './pagination.component.html',
  styles: `
    button {
      min-width: 40px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent {
  @Input() totalItems: number = 0;      // Total items in the backend
  @Input() itemsPerPage: number = 10;    // Items per page
  @Input() currentPage: number = 0;      // 0-based page index (for backend)

  @Output() pageChange = new EventEmitter<{ page: number; size: number }>();


  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }


  onPageChange(page: number): void {
    const backendPage = page - 1;
    if (backendPage >= 0 && backendPage < this.totalPages) {
      this.currentPage = backendPage;
      this.pageChange.emit({page: backendPage, size: this.itemsPerPage});
    }
  }

  nextPage(): void {
    this.onPageChange(this.currentPage + 1);
  }

  previousPage(): void {
    this.onPageChange(this.currentPage - 1);
  }
}
