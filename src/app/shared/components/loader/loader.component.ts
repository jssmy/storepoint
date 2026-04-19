import { Component, input } from '@angular/core';

@Component({
  selector: 'stp-loader',
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss',
})
export class LoaderComponent {
  /** Controls visibility — use *ngIf or the `visible` input. */
  readonly visible = input<boolean>(true);
}
