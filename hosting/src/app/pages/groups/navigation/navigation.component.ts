import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-navigation",
  templateUrl: "./navigation.component.html",
  styleUrls: ["./navigation.component.scss"]
})
export class NavigationComponent implements OnInit {
  routes = [
    { label: "Sechtafeger", route: "/groups/sechtafeger" },
    { label: "Männerballett", route: "/groups/maennerballett" },
    { label: "Brandjoggala", route: "/groups/brandjoggala" },
    { label: "Wildes-Heer", route: "/groups/wildes-heer" },
    { label: "Röhling Stones", route: "/groups/roehling-stones" },
    { label: "Garden", route: "/groups/garden" }
  ];

  constructor() {}

  ngOnInit(): void {}
}
