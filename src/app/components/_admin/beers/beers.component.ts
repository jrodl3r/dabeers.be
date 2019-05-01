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
  image = '';
  defaultTitle = 'Beer Title';
  defaultDescription = 'Beer Description';
  canCreate = false;
  canUpdate = false;

  constructor(
    public beersService: BeersService,
    private storage: AngularFireStorage
  ) { }

  createBeer() {
    const title = document.getElementById('active-beer-title').innerHTML;
    const description = document.getElementById('active-beer-description').innerHTML;
    this.beersService.setActiveBeerTitle(title.trim() !== this.defaultTitle ? title.trim() : '');
    this.beersService.setActiveBeerDescription(description.trim() !== this.defaultDescription ? description.trim() : '');
    this.beersService.setActiveBeerImage(this.image);
    this.beersService.createBeer()
      .then(() => this.hideModals());
  }

  editBeer() {
    const title = document.getElementById('active-beer-title').innerHTML;
    const description = document.getElementById('active-beer-description').innerHTML;
    this.beersService.setActiveBeerTitle(title.trim() !== this.defaultTitle ? title.trim() : '');
    this.beersService.setActiveBeerDescription(description.trim() !== this.defaultDescription ? description.trim() : '');
    this.beersService.setActiveBeerImage(this.image);
    this.beersService.editBeer()
      .then(() => this.hideModals());
  }

  validateBeerTitle(title: String) {
    const description = document.getElementById('active-beer-description').innerHTML;
    this.canCreate = title && title.trim() !== this.defaultTitle && description !== this.defaultDescription ? true : false;
    this.canUpdate = title && title.trim() !== this.beersService.activeBeer.title;
  }

  validateBeerDescription(description: String) {
    const title = document.getElementById('active-beer-title').innerHTML;
    this.canCreate = description && description.trim() !== this.defaultDescription && title !== this.defaultTitle ? true : false;
    this.canUpdate = description && description.trim() !== this.beersService.activeBeer.description;
  }

  removeBeer() {
    this.beersService.removeBeer(this.beersService.activeBeer.id)
      .then(() => this.hideModals());
  }

  restoreBeer() {
    this.beersService.restoreBeer(this.beersService.activeBeer.id);
  }

  openImageUpload(event: Event) {
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
              this.image = url;
              setTimeout(() => {
                this.isImageUploadActive = false;
                this.canUpdate = true;
              }, 2000);
            }
          });
        })
      ).subscribe();
    }
  }

  showCreateBeerModal() {
    this.beersService.resetActiveBeer();
    this.isCreateModalActive = true;
  }

  showEditBeerModal(id: String) {
    this.beersService.resetActiveBeer();
    this.beersService.setActiveBeer(id);
    this.isEditModalActive = true;
  }

  showRemoveBeerModal() {
    this.isRemoveModalActive = true;
  }

  hideModals() {
    this.beersService.resetActiveBeer();
    this.isCreateModalActive = false;
    this.isEditModalActive = false;
    this.isRemoveModalActive = false;
    this.isImageUploadActive = false;
    this.canCreate = false;
    this.canUpdate = false;
    this.image = '';
  }

  hideRemoveModal() {
    this.isRemoveModalActive = false;
  }

}
