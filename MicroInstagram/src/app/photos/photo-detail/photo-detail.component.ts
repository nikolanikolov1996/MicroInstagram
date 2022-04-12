import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { IPhoto } from '../photos';
import { PhotosService } from '../photos.service';

@Component({
  selector: 'app-photo-detail',
  templateUrl: './photo-detail.component.html',
  styleUrls: ['./photo-detail.component.css']
})
export class PhotoDetailComponent implements OnInit {

  pageTitle = "Photo Details";

  photo!: IPhoto;

  picWidth: number = 600;
  picHeight: number = 600;

  errorMessage = "";
  modalRef!: BsModalRef;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private photosService: PhotosService,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    const parameter = this.route.snapshot.paramMap.get('id');
    if (parameter) {
      const id = +parameter;
      this.getPhoto(id);
    }
  }
  
  getPhoto(id: number): void {
    this.photosService.getPhoto(id).subscribe({
      next: photo => this.photo = photo,
      error: err => this.errorMessage = err
    })
  }

  deletePhoto(): void {
    this.photosService.deletePhoto(this.photo.id)
      .subscribe({
        next: (photo) => console.log(`Photo with id ${this.photo.id} is deleted`),
        error: (err: string) => this.errorMessage = err
      });
    
    this.modalRef.hide();
    this.router.navigate(['/photos'])

  }

  onBack(): void {
    this.router.navigate(['/photos']);
  }

  openModal(modal: TemplateRef<IPhoto>){
    this.modalRef = this.modalService.show(modal);
  }

}
