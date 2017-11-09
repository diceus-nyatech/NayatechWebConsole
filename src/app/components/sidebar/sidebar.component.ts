import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"]
})
export class SidebarComponent implements OnInit {
  sidebarIsOpen = false;

  constructor(private router: Router) {
    // override the route reuse strategy
    this.refreshComponent();
  }

  ngOnInit() {
    // this.refreshComponent();
  }

  toggleSidebar() {
    this.sidebarIsOpen = !this.sidebarIsOpen;
  }

  refreshComponent() {
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };

    this.router.events.subscribe(evt => {
      if (evt instanceof NavigationEnd) {
        // trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
        // if you need to scroll back to top, here is the right place
        window.scrollTo(0, 0);
      }
    });
  }

  test() {
    this.router.navigateByUrl("/dashboard/executive-screen");
  }
}
