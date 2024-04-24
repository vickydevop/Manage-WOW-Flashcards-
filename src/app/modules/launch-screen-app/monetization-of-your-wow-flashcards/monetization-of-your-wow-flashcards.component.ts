import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-monetization-of-your-wow-flashcards',
  templateUrl: './monetization-of-your-wow-flashcards.component.html',
  styleUrls: ['./monetization-of-your-wow-flashcards.component.scss']
})
export class MonetizationOfYourWowFlashcardsComponent implements OnInit {

  constructor(
    private media: MediaMatcher
  ) {
    this.mobileQuery = this.media.matchMedia('(max-width: 800px)');

  }
  mobileQuery: MediaQueryList;
  ngOnInit(): void {
  }
  tabIndex: number = 0;
  tabChanged(_data: any) {
    this.tabIndex = _data.index;
  }
}
