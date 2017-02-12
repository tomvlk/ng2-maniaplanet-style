import {Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit} from '@angular/core';

import { MPStyle } from './parser';

@Component({
  selector: 'mp-style',
  template: '<span #mpstyleSpan></span>',
  styles: []
})
export class StyleComponent implements OnInit, AfterViewInit {
  @ViewChild('mpstyleSpan') container: ElementRef;

  @Input() raw: string;
  @Input() stripTags: Array<string> = [];
  @Input() useClasses: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const container = this.container.nativeElement;

    let options = {
      useClasses: this.useClasses,
      stripTags: this.stripTags,
    };

    container.innerHTML = MPStyle(this.raw, options);
  }

}
