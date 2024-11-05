import { ChangeDetectionStrategy, Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    RouterLinkActive,
    RouterLink,
    MatButton,
    RouterOutlet
  ],
  templateUrl: './reports.component.html',
  styles: `
    .active {
      @apply bg-blue-600;
      color: white!important;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportsComponent {

}
