import { Component, OnInit, TemplateRef } from '@angular/core';
import { IPhoto } from './photos';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PhotosService } from './photos.service';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css']
})
export class PhotosComponent implements OnInit {

  pageTitle = "Photos";

  errorMessage!: string;
  picWidth: number = 600;
  picHeight: number = 600;

  photos!: IPhoto[];
  filteredPhotos!: IPhoto[];
  paginator!: IPhoto[];

  modalRef!: BsModalRef;

  _listFilter = "";
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredPhotos = this.listFilter ? this.performFilter(this.listFilter) : this.photos;
  }


  constructor(private photosService: PhotosService,
    private modalService: BsModalService) { }

  ngOnInit(): void {
    this.photosService.getPhotos().subscribe({
      next: photos => {
        this.photos = photos;
        this.filteredPhotos = this.photos;
      },
      error: err => this.errorMessage = err
    });
  }

  performFilter(filterBy: string): IPhoto[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.photos.filter((photo: IPhoto) =>
      photo.title.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  openModal(modal: TemplateRef<IPhoto>) {
    this.modalRef = this.modalService.show(modal);
  }

  onChangePage(photos: IPhoto[]) {
    this.paginator = photos;
  }

}
