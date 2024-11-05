import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  ViewChild
} from '@angular/core';
import {MatCheckbox} from '@angular/material/checkbox';
import {NgIf, NgOptimizedImage} from '@angular/common';
import {NgxMaskDirective} from 'ngx-mask';
import {MatFormField, MatInput} from '@angular/material/input';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

import {AuthService} from './auth.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {encWithPubKey} from '../utils/node-forge.util';
import {UserService} from '../services/user.service';
import {MatLabel} from '@angular/material/form-field';
import {toast} from 'ngx-sonner';
import {UiSvgIconComponent} from '../components/ui/ui-svg-icon/ui-svg-icon.component';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    MatCheckbox,
    NgOptimizedImage,
    NgxMaskDirective,
    MatInput,
    ReactiveFormsModule,
    NgIf,
    MatFormField,
    MatLabel,
    UiSvgIconComponent
  ],
  templateUrl: './auth.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthComponent {
  @ViewChild('confirmCode') confirmCode!: ElementRef;
  @ViewChild('passwordInput') passwordInput!: ElementRef;
  identity: string = '';
  message: string = '';
  pubKey: string = '';
  phoneNumberForm: boolean = true;
  isConfirm: boolean = false;
  isLogin: boolean = false;

  formPhoneNumber: FormGroup = new FormGroup({
    username: new FormControl('998', [Validators.minLength(12), Validators.required]),
  });

  formSmsCode: FormGroup = new FormGroup({
    code: new FormControl('', [Validators.minLength(6), Validators.maxLength(6), Validators.required]),
  });

  loginForm: FormGroup = new FormGroup({
    password: new FormControl('', [Validators.minLength(4), Validators.required]),
  });

  isPasswordShown = false;
  private _authService = inject(AuthService);
  #destroy = inject(DestroyRef)
  private _userService = inject(UserService)
  private _cdr = inject(ChangeDetectorRef);

  userCheck(): void {
    if (this.formPhoneNumber.valid) {
      const username = this.formPhoneNumber.value.username;

      this._authService.userCheck('+' + username).pipe(takeUntilDestroyed(this.#destroy)).subscribe(
        {
          next: (res) => {
            if (res) {
              this.identity = res.identity;
              this.message = res.message;
              this.phoneNumberForm = false;
              this.isConfirm = true;
              this._cdr.detectChanges()
              setTimeout(() => {
                this.confirmCode.nativeElement.focus();
              }, 100);
            }

          },
          error: (error) => this.handleError(error)
        }
      );
    }
  }

  userVerify(): void {
    if (this.code?.valid) {
      this._authService.verifyUser({identity: this.identity, code: this.formSmsCode.value.code}).pipe(takeUntilDestroyed(this.#destroy)).subscribe(
        {
          next: (res) => {
            if (res) {
              this.pubKey = res.encryptKey;
              localStorage.setItem('pk', res.encryptKey);
              this.identity = res.identity;
              this.isConfirm = false;
              this.isLogin = true;
              this._cdr.detectChanges();
              setTimeout(() => {
                this.passwordInput.nativeElement.focus();
              }, 100);
            }

          },
          error: (error) => this.handleError(error)
        }
      );
    }
  }

  loginUser(): void {
    if (this.password?.valid) {
      const obj = {
        password: encWithPubKey(String(this.password.value), this.pubKey),
        identity: this.identity,
      };
      this._authService.signIn(obj).pipe(takeUntilDestroyed(this.#destroy)).subscribe((res)=>{
        if (!res) return
        this._userService.setUserData(res)
        this._cdr.detectChanges()
      })
    } else {
      toast.error('Введите правильные данные',);
    }
  }

  private handleError(error: any): void {
    const errorMessage = error?.error?.errorMessage || 'Ошибка!';
    toast.error(errorMessage);
  }


  get username() {
    return this.formPhoneNumber.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  get code() {
    return this.formSmsCode.get('code');
  }


}
