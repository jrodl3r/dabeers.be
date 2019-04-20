import { Component } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { BeersService } from '../../../services/beers.service';

@Component({
  selector: 'app-beers',
  templateUrl: './beers.component.html',
  styleUrls: ['./beers.component.scss']
})
export class BeersComponent {
  isCreateModalActive: Boolean = false;
  isEditModalActive: Boolean = false;
  isRemoveModalActive: Boolean = false;
  isImageUploadActive: Boolean = false;
  imageUploadTask: AngularFireUploadTask;
  imageUploadPercentage: Observable<number>;
  imageUploadSnapshot: Observable<any>;
  imageMetadata: any;

  constructor(
    public beersService: BeersService,
    private storage: AngularFireStorage
  ) { }

  createBeer() {
    this.beersService.createBeer()
      .then(() => this.hideModals());
  }

  editBeer() {
    // this.beersService
    //   .editBeer(this.beersForm.getRawValue().title, this.beersForm.getRawValue().description)
    //   .then(() => this.hideModals());
  }

  setBeerTitle(title: String) {
    this.beersService.setActiveBeerTitle(title);
  }

  setBeerDescription(description: String) {
    this.beersService.setActiveBeerDescription(description);
  }

  removeBeer() {
    this.beersService.removeBeer(this.beersService.activeBeer.id)
      .then(() => this.hideModals());
  }

  restoreBeer(id: String) {
    this.beersService.restoreBeer(id);
  }

  changeImage(event: Event) {
    event.preventDefault();
    document.getElementById('changeImage').click();
  }

  uploadImage(files: FileList) {
    if (files[0] && files[0].name) {
      const file = files[0];
      const ext = file.name.match(/\.[0-9a-z]+$/i)[0];
      const path = `${Date.now()}${ext}`;
      const ref = this.storage.ref(path);
      this.imageMetadata = {
        cacheControl: 'public,max-age=100000',
        contentType: 'image/png'
      };
      this.imageUploadTask = this.storage.upload(path, file, { customMetadata: this.imageMetadata });
      this.imageUploadPercentage = this.imageUploadTask.percentageChanges();
      this.isImageUploadActive = true;
      this.imageUploadTask.snapshotChanges().pipe(
        finalize(() => {
          ref.getDownloadURL().subscribe(url => {
            if (url) {
              this.beersService.setActiveBeerImage(url);
              setTimeout(() => this.isImageUploadActive = false, 2500);
            }
          });
        })
      ).subscribe();
    }
  }

  showCreateBeerModal() {
    this.beersService.resetActiveBeer();
    // this.beersForm.setValue({ title: '', description: '' });
    // this.beersForm.reset();
    this.isCreateModalActive = true;
  }

  showEditBeerModal(id: String) {
    this.beersService.setActiveBeer(id);
    // this.beersForm.setValue({
    //   title: this.beersService.beers[`${id}`].title,
    //   description: this.beersService.beers[`${id}`].description
    // });
    this.isEditModalActive = true;
  }

  showRemoveBeerModal(id: String) {
    this.beersService.setActiveBeer(id);
    this.isRemoveModalActive = true;
  }

  hideModals() {
    this.beersService.resetActiveBeer();
    this.isCreateModalActive = false;
    this.isEditModalActive = false;
    this.isRemoveModalActive = false;
    this.isImageUploadActive = false;
  }

  // buildForm() {
  //   this.beersForm = this.fb.group({
  //     'title': [this.beersService.activeBeer.title, [Validators.required]],
  //     'description': [this.beersService.activeBeer.description, [Validators.required]]
  //   });
  //   this.beersForm.valueChanges.subscribe((data) =>
  //     this.forms.validate(data, this.beersForm, this.formErrors, this.validationMessages, ['title', 'description']));
  //   this.forms.validate({}, this.beersForm, this.formErrors, this.validationMessages, ['title', 'description']);
  // }

}
