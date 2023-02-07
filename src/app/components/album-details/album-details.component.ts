import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';
import { UserAlbumsService } from 'src/app/services/user-albums.service';

@Component({
  selector: 'app-album-details',
  templateUrl: './album-details.component.html',
  styleUrls: ['./album-details.component.scss'],
})
export class AlbumDetailsComponent implements OnInit {
  albumID!: string;
  albumDetails!: Observable<any>;

  constructor(
    private userServ: UserAlbumsService,
    private route: ActivatedRoute
  ) {
    this.albumID = this.route.snapshot.paramMap.get('albumID')!;
    console.log(this.albumID);
  }

  ngOnInit(): void {
    this.loadDetails();
  }

  loadDetails() {
    this.albumDetails = this.userServ.getAlbumPhotos(this.albumID);
  }
}
