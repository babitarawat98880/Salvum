import { Component, Input, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
})
export class TooltipComponent  implements OnInit {

  @Input() tooltipText: string = '';
  show: boolean = false;

  @HostListener('mouseenter') onMouseEnter() {
    this.show = true;
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.show = false;
  }

  constructor() { }

  ngOnInit() {}

}
