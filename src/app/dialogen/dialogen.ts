import {Component, computed, inject, signal} from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

interface Movie {
  genre: string;
  country: string;
}

@Component({
  imports: [MatButtonModule],
  selector: 'app-dialogen',
  styleUrl: './dialogen.scss',
  templateUrl: './dialogen.html',
})
export class Dialogen {
  readonly dialog = inject(MatDialog);

  openDialog() {
    this.dialog.open(DialogElementsExampleDialog);
  }
}

@Component({
  selector: 'dialog-elements-example-dialog',
  template: `
    <h2 mat-dialog-title>Dialog with elements</h2>
    <mat-dialog-content>
      
      <form class="example-form">
        <mat-form-field class="example-full-width">
          <mat-label>Genre</mat-label>
          <input type="text" 
                placeholder="Pick one" 
                aria-label="Genre" 
                matInput 
                [formField]="form.genre"
                [matAutocomplete]="auto">
          <mat-autocomplete autoActiveFirstOption #auto="matAutocomplete">
            @for (option of filteredGenreOptions(); track option) {
              <mat-option [value]="option">{{option}}</mat-option>
            }
          </mat-autocomplete>
        </mat-form-field>

        <mat-form-field class="example-full-width">
          <mat-label>Country</mat-label>
          <input type="text" 
                placeholder="Pick one" 
                aria-label="Country" 
                matInput 
                [formField]="form.country"
                [matAutocomplete]="auto2">
          <mat-autocomplete autoActiveFirstOption #auto2="matAutocomplete">
            @for (option of filteredCountryOptions(); track option) {
              <mat-option [value]="option">{{option}}</mat-option>
            }
          </mat-autocomplete>
        </mat-form-field>
      </form>    
    <mat-dialog-actions>
      <button matButton mat-dialog-close>Close</button>
    </mat-dialog-actions>  
  `,
  styles: ['.example-form { display: flex; gap: 1rem; }'],
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule, 
    FormField
  ],
})
export class DialogElementsExampleDialog {
  private movieModel = signal<Movie>({ genre: '', country: '' });
  protected form = form(this.movieModel);

  protected filteredGenreOptions = computed<string[]>(() => {
    const formValue = this.form().value().genre;
    return this._filterGenre(formValue);
  });

  protected filteredCountryOptions = computed<string[]>(() => {
    const formValue = this.form().value().country;
    return this._filterCountry(formValue);
  });

  private _options = ['Comedy', 'Drama', 'Action'] as const;
  private _countries = ['USA', 'UK', 'France'] as const;

  private _filterGenre(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this._options.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _filterCountry(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this._countries.filter(option => option.toLowerCase().includes(filterValue));
  }

}
