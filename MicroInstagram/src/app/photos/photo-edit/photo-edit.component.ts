import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent, merge, Observable, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { GenericValidator } from 'src/app/shared/generic-validator';
import { NumberValidators } from 'src/app/shared/number.validator';
import { IPhoto } from '../photos';
import { PhotosService } from '../photos.service';

@Component({
  selector: 'app-photo-edit',
  templateUrl: './photo-edit.component.html',
  styleUrls: ['./photo-edit.component.css']
})
export class PhotoEditComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];

  pageTitle = "Product Edit"
  errorMessage = "";
  photoForm!: FormGroup;

  private sub!: Subscription;

  photo!: IPhoto;

  mode: 'edit' | 'upload' = 'edit';

  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private photosService: PhotosService) {

    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      title: {
        required: 'Photo name is required.',
        minlength: 'Photo name must be at least three characters.',
        maxlength: 'Photo name cannot exceed 50 characters.'
      },
      albumId: {
        required: 'Album ID is required.',
        range: "Album ID must be between 1 (lowest) and 100 (highest)."
      },
      url: {
        required: "Photo's url is required.",
      },
      thumbnailUrl: {
        required: "Photo's thumbnail url is required.",
      }
    }

    // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);

  }

  ngOnInit(): void {
    this.photoForm = this.fb.group({
      title: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50)]],
      albumId: ['', [Validators.required,
      NumberValidators.range(1, 100)]],
      url: ['', [Validators.required]],
      thumbnailUrl: ['', [Validators.required]]
    });

    this.sub = this.route.paramMap.subscribe(
      params => {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (id === 0) {
          this.mode = "upload"
          this.pageTitle = 'Upload Photo';
        } else {
          this.mode = "edit"
          this.getPhoto(id);
          this.pageTitle = `Edit Photo`;
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.photoForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(800)
    ).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.photoForm);
    });
  }

  getPhoto(id: number): void {
    this.photosService.getPhoto(id)
      .subscribe({
        next: (photo: IPhoto) => this.displayPhoto(photo),
        error: err => this.errorMessage = err
      });
  }

  displayPhoto(photo: IPhoto): void {
    if (this.photoForm) {
      this.photoForm.reset();
    }

    this.photo = photo;

    // Update the data on the form
    this.photoForm.patchValue({
      title: this.photo.title,
      albumId: this.photo.albumId,
      url: this.photo.url,
      thumbnailUrl: this.photo.thumbnailUrl
    });
  }

  savePhoto(): void {
    if (this.photoForm.valid) {
      if (this.photoForm.dirty) {
        const p = { ...this.photo, ...this.photoForm.value };

        if (this.mode === "upload") {
          this.photosService.uploadPhoto(this.photoForm.value)
            .subscribe({
              next: photo => {
                console.log(photo);
                return this.onSaveComplete();
              },
              error: err => this.errorMessage = err
            });
        } else {
          this.photosService.updatePhoto(p)
            .subscribe({
              next: photo => {
                console.log(photo);
                return this.onSaveComplete();
              },
              error: err => this.errorMessage = err
            });
        }
      } else {
        this.onSaveComplete();
      }
    } else {
      this.errorMessage = 'Please correct the validation errors.';
    }
  }

  onSaveComplete(): void {

    if (this.mode === "upload") {
      this.photoForm.reset();
      this.router.navigate(['/photos']);
    } else {
      // Reset the form to clear the flags
      this.photoForm.reset();
      this.router.navigate(['/photos/detail', this.photo.id]);
    }

  }
}
