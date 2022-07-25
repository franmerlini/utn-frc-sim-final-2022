import {
  AfterContentInit,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ErrorMessages } from './custom-validators';

@Component({
  selector: 'app-control-messages',
  template: `<div
    *ngIf="control.invalid && (control.dirty || control.touched || submitted)"
    style="margin-top: -15px; color: red; font-size: 12px;"
  >
    {{ message }}
  </div> `,
})
export class ControlMessagesComponent
  implements AfterContentInit, OnDestroy, OnChanges
{
  @Input() public submitted: boolean;
  @Input() public control: AbstractControl;
  public message: string | null;
  private statusChangesSubscription: Subscription;

  get errorMessage(): string | null {
    for (const propertyName in this.control.errors) {
      if (this.control.errors.hasOwnProperty(propertyName)) {
        return ErrorMessages.messageOf(propertyName);
      }
    }
    return null;
  }

  ngAfterContentInit(): void {
    this.message = this.errorMessage;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['control'] && changes['control'].currentValue) {
      this.control = changes['control'].currentValue;
      this.statusChangesSubscription = this.control.statusChanges.subscribe(
        () => {
          this.message = this.errorMessage;
        }
      );
    }
  }

  ngOnDestroy(): void {
    this.statusChangesSubscription.unsubscribe();
  }
}
