import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterLink, RouterLinkActive} from '@angular/router';
import {NgClass, NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {MenuList} from '../../types/menu.type';
import {UiSvgIconComponent} from '../ui/ui-svg-icon/ui-svg-icon.component';
import {MatRipple} from '@angular/material/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {filter} from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgOptimizedImage,
    UiSvgIconComponent,
    MatRipple,
    NgForOf,
    NgIf,
    NgClass
  ],
  templateUrl: './sidebar.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slideToggle', [
      state('closed', style({height: '0px', overflow: 'hidden', opacity: 0})),
      state('open', style({height: '*', opacity: 1})),
      transition('closed <=> open', animate('300ms ease-in-out')),
    ]),
  ],
})
export class SidebarComponent implements OnInit {
  private _router = inject(Router)
  mainMenuList: MenuList[] = [
    {
      title: 'Продукты',
      icon: 'shopping-cart',
      link: 'loans',
      children: [
        {
          title: 'Кредиты',
          icon: 'wallet',
          link: 'loans',
        },
        {
          title: 'Депозиты',
          icon: 'strongbox-2',
          link: 'deposits',
        },
        {
          title: 'Карты',
          icon: 'cards',
          link: 'cards',
        },
        {
          title: 'Трансферы',
          icon: 'arrow-2',
          link: 'transfers',
        }
      ]
    },
    {
      title: 'Статьи',
      icon: 'task',
      link: 'reports',
    },
    {
      title: 'FAQ',
      icon: 'message-question',
      link: 'faq',
    },
    {
      title: 'Карусель',
      icon: 'slider-horizontal',
      link: 'carousel',
    },
    {
      title: 'Баннеры',
      icon: 'colorfilter',
      link: 'banners',
    }
  ];
  expandedMenu: string | null = null;

  ngOnInit(): void {
    this._router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.expandActiveMenu();
      });
    this.expandActiveMenu();
  }

  toggleMenu(title: string): void {
    this.expandedMenu = this.expandedMenu === title ? null : title;
  }

  expandActiveMenu(): void {
    for (const menu of this.mainMenuList) {
      if (menu.children?.some(child => this._router.isActive(child.link, false))) {
        this.expandedMenu = menu.title;
        break
      }
    }
  }

  getHref(icon: string) {
    return `./assets/icons/sidebar-icons.svg#${icon}`;
  }
}
