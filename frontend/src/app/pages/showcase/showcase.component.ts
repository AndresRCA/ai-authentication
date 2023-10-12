import { Component, OnInit } from '@angular/core';
import { showcaseRoutes } from './showcase-routing.module';
import { Router, ChildrenOutletContexts, ActivatedRoute } from '@angular/router';
import { slider } from 'src/app/animations';

@Component({
  selector: 'app-showcase',
  templateUrl: './showcase.component.html',
  styleUrls: ['./showcase.component.scss'],
  animations: [
    slider
  ]
})
export class ShowcaseComponent implements OnInit {
  // properties used to navigate between apps in showcase
  public currentAppIndex = 0;
  public showcaseRoutes!: string[];
  
  constructor(
    private router: Router,
    private contexts: ChildrenOutletContexts,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // set showcaseRoutes to define the right order when navigating while using the site
    showcaseRoutes.sort((a, b) => a.data!['animation'] - b.data!['animation']); // make sure the order is right
    this.showcaseRoutes = showcaseRoutes.map((route) => route.path as string);

    // get data from children routes to update component properties
    this.route.children[0].data.subscribe(data => {
      this.currentAppIndex = data['animation'];
    });
  }

  /**
   * Vital for [@routeAnimations]
   * @returns number that represents the index(position) of the current route
   */
  getRouteAnimationData(): number {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }

  /**
   * Navigate back (to the left side of the screen) to the view that is positioned to the left.
   * this.activatedRoute.routeConfig?.path should return the root path, while this.showcaseRoutes[this.currentAppIndex] returns the 
   */
  goToPreviousApp(): void {
    this.currentAppIndex--;
    this.router.navigateByUrl(`${this.route.routeConfig?.path}/${this.showcaseRoutes[this.currentAppIndex]}`);
  }

  /**
   * Navigate forward (to the right side of the screen) to the view that is positioned to the right.
   * this.activatedRoute.routeConfig?.path should return the root path, while this.showcaseRoutes[this.currentAppIndex] returns the 
   */
  goToNextApp(): void {
    this.currentAppIndex++;
    this.router.navigateByUrl(`${this.route.routeConfig?.path}/${this.showcaseRoutes[this.currentAppIndex]}`);
  }
}
