import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, BehaviorSubject } from 'rxjs';

import { FormsService } from '../../../services/forms.service';
import { BeersService } from '../../../services/beers.service';

import { IBeer } from '../../../models/beers';

type InputFields = 'title' | 'description';
type FormErrors = { [u in InputFields]: string };

@Component({
  selector: 'app-beers',
  templateUrl: './beers.component.html',
  styleUrls: ['./beers.component.scss']
})
export class BeersComponent implements OnInit, OnDestroy {
  beersSub: Subscription;
  beers: IBeer[] | null;
  activeBeer: IBeer;
  activeBeerIndex: number;
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
  isLoading: Boolean;
  isCreateModalActive: Boolean = false;
  isEditModalActive: Boolean = false;
  isRemoveModalActive: Boolean = false;

  constructor(
    private beersService: BeersService,
    private forms: FormsService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.isLoading = true;
    this.beersSub = this.beersService.getBeers().subscribe(data => {
      this.beers = data ? data.items : [];
      this.isLoading = false;
    });
    this.beersService.getActiveBeer().subscribe(item => {
      if (!!item) {
        this.activeBeer = item;
        if (this.beersForm) {
          this.beersForm.setValue({ title: item.title, description: item.description });
        }
      }
    });
    this.buildForm();
  }

  ngOnDestroy() {
    this.beersSub.unsubscribe();
  }

  setActiveBeer(index: number) {
    this.beersService.setActiveBeer(this.beers[index]);
    this.activeBeerIndex = index;
  }

  createBeer() {
    const beer: IBeer = {
      title: this.beersForm.getRawValue().title,
      description: this.beersForm.getRawValue().description,
      image: '',
      created: new Date(),
      edited: new Date(null),
      isActive: true
    };
    this.beers.unshift(beer);
    this.beersService.updateBeers(this.beers)
      .then(() => this.hideModals());
  }

  editBeer() {
    this.beers[this.activeBeerIndex].title = this.beersForm.getRawValue().title;
    this.beers[this.activeBeerIndex].description = this.beersForm.getRawValue().description;
    this.beers[this.activeBeerIndex].edited = new Date();
    this.beersService.updateBeers(this.beers)
      .then(() => this.hideModals());
  }

  removeBeer() {
    this.beers[this.activeBeerIndex].isActive = false;
    this.beersService.updateBeers(this.beers)
      .then(() => this.isRemoveModalActive = false);
  }

  restoreBeer(index: number) {
    this.beers[index].isActive = true;
    this.beersService.updateBeers(this.beers);
  }

  showCreateBeerModal() {
    this.beersForm.setValue({ title: '', description: '' });
    this.beersForm.reset();
    this.isCreateModalActive = true;
  }

  showEditBeerModal(index: number) {
    this.setActiveBeer(index);
    this.isEditModalActive = true;
  }

  showRemoveBeerModal(index: number) {
    this.setActiveBeer(index);
    this.isRemoveModalActive = true;
  }

  hideModals() {
    this.isEditModalActive = false;
    this.isCreateModalActive = false;
    this.isRemoveModalActive = false;
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  buildForm() {
    this.beersForm = this.fb.group({
      'title': [this.activeBeer.title, [Validators.required]],
      'description': [this.activeBeer.description, [Validators.required]]
    });

    this.beersForm.valueChanges.subscribe((data) =>
      this.forms.validate(data, this.beersForm, this.formErrors, this.validationMessages, ['title', 'description']));
    this.forms.validate({}, this.beersForm, this.formErrors, this.validationMessages, ['title', 'description']);
  }

}
