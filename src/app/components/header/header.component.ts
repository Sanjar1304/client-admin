import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {UserService} from '../../services/user.service';
import {AsyncPipe, NgIf} from '@angular/common';
import {UserInfoDto} from '../../types/user.type';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatIcon,
    MatIconButton,
    NgIf,
    AsyncPipe
  ],
  templateUrl: './header.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit{
  userFullName: string = 'Иван Иванов';
  userRole: string = 'Администратор';
  currentDate: string = new Date().toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  public _userService = inject(UserService)

 public data:any
  logout() {
    this._userService.logout()
  }

  ngOnInit(): void {
   const data:any   = localStorage.getItem('user')
    this.data = JSON.parse(data)
  }


}
