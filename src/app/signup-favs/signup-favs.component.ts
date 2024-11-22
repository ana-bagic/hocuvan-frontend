import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryCard } from '../models/categoryCard';
import { CategoriesService } from '../services/category-service'
import { SearchService } from 'src/app/services/search.service'
import { AuthService } from '../services/auth.service';

@Component({
  selector: '/signup/favorites',
  templateUrl: './signup-favs.component.html',
  styleUrls: ['./signup-favs.component.css']
})
export class SignupFavsComponent implements OnInit {

  selected: CategoryCard[] = [];
  categoryCards: CategoryCard[] = [];
  constructor(private route: ActivatedRoute,
    private router: Router,
    private categoriesService: CategoriesService,
    private searchService: SearchService,
    private authService: AuthService) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigateByUrl('');
    }

    if (this.authService.isAdmin()) {
      this.router.navigateByUrl('');
    }

    this.searchService.getCategories()
      .subscribe(categories => {
        categories.forEach(cat => this.categoryCards.push({ categoryId: cat.categoryId, categoryName: cat.categoryName, isClicked: false }));
      });

  }


  submit() {

    this.categoryCards.forEach(card => {
      if (card.isClicked == true)
        this.selected.push(card);
    });
    console.log("Categories selected..." + this.selected);

    if (this.selected.length > 0) {
      this.categoriesService.setFavouriteCategories(this.selected);
      this.router.navigateByUrl('/');
    }
  }

}
