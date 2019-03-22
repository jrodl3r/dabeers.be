import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';

import { BeersService } from '../../../services/beers.service';
import { NotifyService } from 'src/app/services/notify.service';
import { FormsService } from '../../../services/forms.service';
import { tap, finalize } from 'rxjs/operators';

type InputFields = 'title' | 'description';
type FormErrors = { [u in InputFields]: string };

@Component({
  selector: 'app-beers',
  templateUrl: './beers.component.html',
  styleUrls: ['./beers.component.scss']
})
export class BeersComponent implements OnInit {
  beersForm: FormGroup;
  formErrors: FormErrors = {
    'title': '',
    'description': '',
  };
  validationMessages = {
    'title': {
      'required': 'Title is required.'
    },
    'description': {
      'required': 'Description is required.'
    }
  };
  isCreateModalActive: Boolean = false;
  isEditModalActive: Boolean = false;
  isRemoveModalActive: Boolean = false;
  imageUploadTask: AngularFireUploadTask;
  imageUploadPercentage: Observable<number>;
  imageUploadSnapshot: Observable<any>;
  imageURL: string;

  constructor(
    public beersService: BeersService,
    private storage: AngularFireStorage,
    private notify: NotifyService,
    private forms: FormsService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  createBeer() {
    this.beersService
      .createBeer(this.beersForm.getRawValue().title, this.beersForm.getRawValue().description, '')
      .then(() => this.hideModals());
  }

  editBeer() {
    this.beersService
      .editBeer(this.beersForm.getRawValue().title, this.beersForm.getRawValue().description, '')
      .then(() => this.hideModals());
  }

  removeBeer() {
    this.beersService.removeBeer().then(() => this.hideModals());
  }

  restoreBeer(id: String) {
    this.beersService.restoreBeer(id);
  }

  changeImage(event: Event) {
    event.preventDefault();
    document.getElementById('changeImage').click();
  }

  uploadImage(files: FileList) {
    const path = `beers/${Date.now()}_${files[0].name}`;
    const ref = this.storage.ref(path);
    this.imageUploadTask = this.storage.upload(path, files[0]);
    this.imageUploadPercentage = this.imageUploadTask.percentageChanges();
    this.imageUploadSnapshot = this.imageUploadTask.snapshotChanges().pipe(
      tap(console.log),
      finalize(async() => {
        this.imageURL = await ref.getDownloadURL().toPromise();

        // TODO: update beer data [`${beersService.activeBeer.id}]
        // .catch(error => this.notify.error('Error uploading image', error));
      })
    );
  }

  showCreateBeerModal() {
    this.beersForm.setValue({ title: '', description: '' });
    this.beersForm.reset();
    this.isCreateModalActive = true;
  }

  showEditBeerModal(id: String) {
    this.beersService.setActiveBeer(id);
    this.beersForm.setValue({
      title: this.beersService.activeBeer.title,
      description: this.beersService.activeBeer.description
    });
    this.isEditModalActive = true;
  }

  showRemoveBeerModal(id: String) {
    this.beersService.setActiveBeer(id);
    this.isRemoveModalActive = true;
  }

  hideModals() {
    this.isEditModalActive = false;
    this.isCreateModalActive = false;
    this.isRemoveModalActive = false;
  }

  buildForm() {
    this.beersForm = this.fb.group({
      'title': [this.beersService.activeBeer.title, [Validators.required]],
      'description': [this.beersService.activeBeer.description, [Validators.required]]
    });
    this.beersForm.valueChanges.subscribe((data) =>
      this.forms.validate(data, this.beersForm, this.formErrors, this.validationMessages, ['title', 'description']));
    this.forms.validate({}, this.beersForm, this.formErrors, this.validationMessages, ['title', 'description']);
  }

}
