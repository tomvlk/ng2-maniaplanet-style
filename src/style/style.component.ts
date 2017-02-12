import {Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit} from '@angular/core';

import { MPStyle } from './parser';

@Component({
  selector: 'mp-style',
  template: '<span #mpstyleSpan></span>',
  styles: []
})
export class StyleComponent implements OnInit, AfterViewInit {
  @ViewChild('mpstyleSpan') container: ElementRef;

  private _raw: string;
  @Input() stripTags: Array<string> = [];
  @Input() useClasses: boolean = false;

  @Input()
  set raw (input:string) {
    this._raw = input;
    this.render();
  }

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.render();
  }

  public render() {
    const container = this.container.nativeElement;

    let options = {
      useClasses: this.useClasses,
      stripTags: this.stripTags,
    };

    container.innerHTML = MPStyle(this._raw, options);
  }

}
