import { Component, OnInit } from '@angular/core';
import { SearchService } from '../services/search.service';
import { Stats } from '../models/stats';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  stats: Stats = new Stats;

  constructor(private searchService: SearchService) { }

  ngOnInit(): void {

    this.searchService.getStats()
      .subscribe(stats => {
        this.stats = stats

      });

  }
}
