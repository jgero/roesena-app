import { Injectable, ViewContainerRef, ComponentFactoryResolver, ComponentFactory } from '@angular/core';

import { PopupModule } from './popup.module';
import { InfoPopupComponent } from './info-popup/info-popup.component';

@Injectable({
  providedIn: PopupModule
})
export class PopupService {

  private infoFactory: ComponentFactory<InfoPopupComponent>;

  constructor(resolver: ComponentFactoryResolver) {
    this.infoFactory = resolver.resolveComponentFactory(InfoPopupComponent);
  }

  public flashPopup(message: string, container: ViewContainerRef) {
    const popRef = container.createComponent(this.infoFactory);
    popRef.instance.message = message;
    setTimeout(() => {
      popRef.destroy();
    }, 2000);
  }
}
