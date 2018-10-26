import { Component } from '@angular/core';
import { MatSpinner } from '@angular/material';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
    <ng-http-loader [entryComponent]="matSpinner"></ng-http-loader>
  `,
  styles: [``]
})
export class AppComponent {
  public matSpinner = MatSpinner;
}
