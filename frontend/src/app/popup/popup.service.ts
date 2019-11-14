import { Injectable, ViewContainerRef, ComponentFactoryResolver, ComponentFactory } from '@angular/core';

import { PopupModule } from './popup.module';
import { InfoPopupComponent } from './info-popup/info-popup.component';
import { InputPopupComponent } from './input-popup/input-popup.component';

@Injectable({
  providedIn: PopupModule
})
export class PopupService {
  private infoFactory: ComponentFactory<InfoPopupComponent>;
  private inputFactory: ComponentFactory<InputPopupComponent>;

  constructor(resolver: ComponentFactoryResolver) {
    this.infoFactory = resolver.resolveComponentFactory(InfoPopupComponent);
    this.inputFactory = resolver.resolveComponentFactory(InputPopupComponent);
  }

  public flashPopup(message: string, container: ViewContainerRef) {
    const popRef = container.createComponent(this.infoFactory);
    popRef.instance.message = message;
    setTimeout(() => {
      popRef.destroy();
    }, 2000);
  }

  public inputPopup(message: string, container: ViewContainerRef) {
    const popRef = container.createComponent(this.inputFactory);
    popRef.instance.message = message;
    return new Promise<string>(resolve => {
      const sub = popRef.instance.userInput.subscribe({
        next: val => {
          sub.unsubscribe();
          popRef.destroy();
          resolve(val);
        }
      });
    });
  }
}
