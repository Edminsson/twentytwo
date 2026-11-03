import {afterNextRender, Component, computed, ElementRef, inject, signal, viewChild} from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { MatAutocomplete, MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
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

  openDialog(data: Partial<Movie> = { genre: 'Drama', country: '' }) {
    this.dialog.open(DialogElementsExampleDialog, { data, autoFocus: false });
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
                #genreInput
                [formField]="form.genre"
                [matAutocomplete]="auto">
          <mat-autocomplete autoActiveFirstOption #auto="matAutocomplete"
                            (opened)="markSelected(auto, form.genre().value())">
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
                #countryInput
                [formField]="form.country"
                [matAutocomplete]="auto2">
          <mat-autocomplete autoActiveFirstOption #auto2="matAutocomplete"
                            (opened)="markSelected(auto2, form.country().value())">
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
  private _options = ['Comedy', 'Drama', 'Action'] as const;
  private _countries = ['USA', 'UK', 'France'] as const;

  private data = inject<Partial<Movie> | null>(MAT_DIALOG_DATA, { optional: true });
  private initialGenre = this._findOption(this._options, this.data?.genre);
  private initialCountry = this._findOption(this._countries, this.data?.country);

  private countryInput = viewChild.required<ElementRef<HTMLInputElement>>('countryInput');
  private genreInput = viewChild.required<ElementRef<HTMLInputElement>>('genreInput');

  private movieModel = signal<Movie>({ genre: this.initialGenre, country: this.initialCountry });
  protected form = form(this.movieModel);

  constructor() {
    // The dialog's own autofocus is disabled (autoFocus: false), so focus the right field here.
    afterNextRender(() => {
      const input = this.initialGenre ? this.countryInput() : this.genreInput();
      input.nativeElement.focus();
    });
  }

  protected filteredGenreOptions = computed<string[]>(() => {
    const formValue = this.form().value().genre;
    return this._filterGenre(formValue);
  });

  protected filteredCountryOptions = computed<string[]>(() => {
    const formValue = this.form().value().country;
    return this._filterCountry(formValue);
  });

  // A value set programmatically (e.g. preselected) is not marked as selected by the autocomplete,
  // so mark the matching option when the panel opens to show its check mark.
  protected markSelected(autocomplete: MatAutocomplete, value: string): void {
    autocomplete.options.forEach(option => {
      if (option.value === value && !option.selected) {
        option.select(false);
      }
    });
  }

  // Returns the canonical option matching value (case-insensitive), or '' if there is none.
  private _findOption(options: readonly string[], value: string | undefined): string {
    const filterValue = value?.toLowerCase();
    return options.find(option => option.toLowerCase() === filterValue) ?? '';
  }

  // When the value is already a full selection, show every option so it can be changed.
  private _filter(options: readonly string[], value: string): string[] {
    if (this._findOption(options, value)) {
      return [...options];
    }
    const filterValue = value.toLowerCase();

    return options.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _filterGenre(value: string): string[] {
    return this._filter(this._options, value);
  }

  private _filterCountry(value: string): string[] {
    return this._filter(this._countries, value);
  }

}
