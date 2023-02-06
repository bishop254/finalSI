import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { UserAlbumsService } from 'src/app/services/user-albums.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit {
  userID!: string;
  user!: any;
  userAlbums!: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userServ: UserAlbumsService
  ) {
    this.userID = this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.loadUser();

    this.userAlbums = this.userServ.getUserAlbums(this.userID).pipe(
      map((item) => {
        console.log(item['albums']);

        return item['albums'];
      })
    );
  }

  loadUser() {
    let users = JSON.parse(localStorage.getItem('users')!);
    console.log(users);
    this.user = users.filter((item: any) => item.id == this.userID)[0];
    console.log(this.user);
  }

  openAlbumPhotos(id: string) {
    this.router.navigate([`/albums/${id}`]);
  }
}
