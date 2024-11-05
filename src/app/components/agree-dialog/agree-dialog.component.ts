import {ChangeDetectionStrategy, Component, EventEmitter, Inject, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-agree-dialog',
  standalone: true,
  imports: [],
  templateUrl: './agree-dialog.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgreeDialogComponent {
  @Output() confirmed = new EventEmitter<void>(); // Emits when "Да" is clicked

  constructor(
    public dialogRef: MatDialogRef<AgreeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string }
  ) {}

  onNoClick(): void {
    this.dialogRef.close()
  }

  onYesClick(): void {
    this.confirmed.emit()
  }
}
