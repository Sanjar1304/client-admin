import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {ChildrenOutletContexts, RouterOutlet} from '@angular/router';
import {MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {MatOption, MatSelectModule} from '@angular/material/select';
import {NgxSonnerToaster} from 'ngx-sonner';
import {UserService} from './services/user.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {routeAnimation} from './animations/route.animation';
import {AsyncPipe, NgClass, NgIf, NgStyle} from '@angular/common';
import {HeaderComponent} from './components/header/header.component';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {spinnerState$$} from './utils/spinner.util';
import {SpinnerComponent} from './components/spinner/spinner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatFormFieldModule, MatLabel, MatSelectModule, MatOption, NgxSonnerToaster, NgClass, HeaderComponent, SidebarComponent, NgIf, NgStyle, AsyncPipe, SpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations:[routeAnimation]
})
export class AppComponent implements OnInit{
  title = 'client-admin';
  isAuth = signal<boolean>(false)
  #destroy = inject(DestroyRef)

  constructor(
    private _contexts: ChildrenOutletContexts,
    private _userService: UserService,

  ) {
    const userLocalData = this._userService.getUserLocalData();

    if (userLocalData) {
      try {
        const userData = JSON.parse(userLocalData);
        this._userService.userLoginData$$.next(userData);
      } catch (error) {

      }
    }
  }

  protected get routeAnimationData(): string {
    return this._contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }

  ngOnInit(): void {
    this.initUser();

  }

  initUser() {
    this._userService.userLoginData$
      .pipe(takeUntilDestroyed(this.#destroy))
      .subscribe((user) => {
        this.isAuth.set(!!user);
      });
  }

  protected readonly spinnerState$$ = spinnerState$$;
}
