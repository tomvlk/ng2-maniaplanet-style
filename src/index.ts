import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StyleComponent } from "./style/style.component";

@NgModule({
  imports: [CommonModule],
  declarations: [StyleComponent],
  exports: [StyleComponent],
  entryComponents: [StyleComponent]
})
export class ManiaplanetStyleModule {
  public static forRoot(): ModuleWithProviders {
    return {ngModule: ManiaplanetStyleModule, providers: []}
  }
}
