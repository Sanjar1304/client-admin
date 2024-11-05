import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {

}
