import { Component } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { BeerService } from '../../../services/beer.service';
import { NotifyService } from '../../../services/notify.service';

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
  dragActive = false;
  defaultTitle: String = 'Beer Title';
  defaultDescription: String = 'Beer Description';
  canCreate = false;
  canUpdate = false;

  constructor(
    public beerService: BeerService,
    public notifyService: NotifyService,
    private storage: AngularFireStorage
  ) { }

  createBeer() {
    const title = document.getElementById('active-beer-title').innerText;
    const description = document.getElementById('active-beer-description').innerText;
    this.beerService.setActiveBeerTitle(title.trim() !== this.defaultTitle ? title.trim() : '');
    this.beerService.setActiveBeerDescription(description.trim() !== this.defaultDescription ? description.trim() : '');
    this.beerService.setActiveBeerImage(this.image);
    this.beerService.createBeer()
      .then(() => this.hideModals());
  }

  editBeer() {
    const title = document.getElementById('active-beer-title').innerText;
    const description = document.getElementById('active-beer-description').innerText;
    this.beerService.setActiveBeerTitle(title.trim() !== this.defaultTitle ? title.trim() : '');
    this.beerService.setActiveBeerDescription(description.trim() !== this.defaultDescription ? description.trim() : '');
    this.beerService.setActiveBeerImage(this.image);
    this.beerService.editBeer()
      .then(() => this.hideModals());
  }

  validateBeerTitle(title: String) {
    const description = document.getElementById('active-beer-description').innerText;
    this.canCreate = title && title.trim() !== this.defaultTitle && description !== this.defaultDescription ? true : false;
    this.canUpdate = title && title.trim() !== this.beerService.activeBeer.title;
  }

  validateBeerDescription(description: String) {
    const title = document.getElementById('active-beer-title').innerText;
    this.canCreate = description && description.trim() !== this.defaultDescription && title !== this.defaultTitle ? true : false;
    this.canUpdate = description && description.trim() !== this.beerService.activeBeer.description;
  }

  removeBeer() {
    this.beerService.removeBeer(this.beerService.activeBeer.id)
      .then(() => this.hideRemoveModal());
  }

  restoreBeer() {
    this.beerService.restoreBeer(this.beerService.activeBeer.id);
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

  onDropImage(event: any) {
    event.preventDefault();
    if (event.dataTransfer.files.length && event.dataTransfer.files[0].type === 'image/png') {
      this.uploadImage(event.dataTransfer.files);
    } else if (event.dataTransfer.getData('text') && event.dataTransfer.getData('text').endsWith('.png')) {
      this.image = event.dataTransfer.getData('text');
      this.canUpdate = true;
    } else {
      this.notifyService.error('Content is not supported');
    }
    this.dragActive = false;
  }

  onDragImageEnter(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.dragActive = true;
  }

  onDragImageLeave(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.dragActive = false;
  }

  isInputDirty(input: String) {
    const title = document.getElementById('active-beer-title').innerText;
    const description = document.getElementById('active-beer-description').innerText;
    if (!input) {
      return description !== this.defaultDescription || title !== this.defaultTitle;
    } else if (input === this.defaultTitle) {
      return title !== this.defaultTitle;
    } else if (input === this.defaultDescription) {
      return description !== this.defaultDescription;
    }
  }

  showCreateBeerModal() {
    this.beerService.resetActiveBeer();
    this.isCreateModalActive = true;
  }

  showEditBeerModal(id: String) {
    this.beerService.resetActiveBeer();
    this.beerService.setActiveBeer(id);
    this.isEditModalActive = true;
  }

  showRemoveBeerModal() {
    this.isRemoveModalActive = true;
  }

  hideModals() {
    this.beerService.resetActiveBeer();
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
