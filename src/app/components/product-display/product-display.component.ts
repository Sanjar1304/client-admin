import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {NgForOf, NgIf, NgStyle} from '@angular/common';
import {MatAccordion, MatExpansionPanel, MatExpansionPanelHeader} from '@angular/material/expansion';
import {ProductItems} from '../../types/product.type';
import {MatCard} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatMenu, MatMenuTrigger} from '@angular/material/menu';
import {MatRipple} from '@angular/material/core';
import {RouterLink} from '@angular/router';
import {UiSvgIconComponent} from '../ui/ui-svg-icon/ui-svg-icon.component';

@Component({
  selector: 'app-product-display',
  standalone: true,
  imports: [
    NgForOf,
    MatExpansionPanelHeader,
    MatExpansionPanel,
    MatAccordion,
    NgStyle,
    MatCard,
    NgIf,
    MatButton,
    MatIcon,
    MatMenu,
    MatRipple,
    RouterLink,
    UiSvgIconComponent,
    MatMenuTrigger
  ],
  templateUrl: './product-display.component.html',
  styles: `
    .hover:scale-105 {
      transition: transform 0.3s ease-in-out;
      transform: scale(1.05);
    }

    .mat-expansion-panel {
      border-radius: 8px;
      margin-top: 8px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDisplayComponent {
  @Input() items: ProductItems[] = [];
  @Input() type: string = ''
  @Input() loading: boolean = false
  @Output() productId = new EventEmitter<string>();
}
