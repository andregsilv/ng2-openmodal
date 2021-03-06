﻿import { Injectable, ViewContainerRef, ComponentFactoryResolver } from "@angular/core";
import { ModalComponent } from './modal.component';
import { ModalParams } from './modal-params'
import { ModalConfirmationComponent } from './modal-confirmation.component'
import { ModalAlertComponent } from './modal-alert.component'
import { ThenElse } from './then-else'

@Injectable()
export class ModalService {

    private container: ViewContainerRef;
    private modals: ModalComponent[] = new Array<ModalComponent>();
    private modalComponentType: any = ModalComponent;
    private alertComponentType: any = ModalAlertComponent;
    private confirmationComponentType: any = ModalConfirmationComponent;

    constructor(private resolver: ComponentFactoryResolver) {
    }
    setModalLayout(type: any) {
      this.modalComponentType = type;
    }
    setAlertComponent(type: any) {
      this.alertComponentType = type;
    }
    setConfirmComponent(type: any) {
      this.confirmationComponentType = type;
    }
    setPlacement(container: ViewContainerRef) {
        this.container = container;
    }
    openModal(componentType: any, title: string, contentParams: any = {}): ThenElse<any> {
      let params = new ModalParams();
      params.componentType = componentType;
      params.title = title;
      params.contentParams = contentParams;
      return this.openModalAdvanced(params);
    }
    openModalAdvanced(modalParams: ModalParams): ThenElse<any> {
      let modalFactory = this.resolver.resolveComponentFactory(this.modalComponentType)
      let modalRef = this.container.createComponent(modalFactory);
      let modal = <ModalComponent>modalRef.instance;
      let r = new ThenElse((resolve, reject) => {
          modal.closed.subscribe((result: any) => {
          if (result.success) resolve(result.value);
          else reject(result.value);
          setTimeout(()=> modalRef.destroy(), result.timeBeforeDestroy);
        });
        this.modals.push(modal);
        modal.open(modalParams);
      });
      return r;
    }
    openAlert(message: string, title: string) {
      return this.openModal(this.alertComponentType, title, {message: message});
    }
    openConfirmation(message: string, title: string) {
      return this.openModal(this.confirmationComponentType, title, {message: message});
    }
    dismissAll() {
      let temp = this.modals;
      for (let modal of temp) {
        modal.dismiss();
      }
    }
}
