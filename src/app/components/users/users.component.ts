import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { UserAlbumsService } from 'src/app/services/user-albums.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent {
  users!: Observable<any>;
  usersAlbCount!: Observable<any>;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private userServ: UserAlbumsService,
    private ref: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUserInfo();
  }

  loadUserInfo() {
    this.users = this.userServ.getUsers();
    // console.log(this.users);
  }

  userDetails(id: string) {
    this.router.navigate([`/users/${id}`]);
  }
}
