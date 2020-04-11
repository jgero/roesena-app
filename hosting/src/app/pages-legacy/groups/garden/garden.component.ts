import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-garden",
  templateUrl: "./garden.component.html",
  styleUrls: ["./garden.component.scss"]
})
export class GardenComponent implements OnInit {
  routes = [
    { label: "Minigarde", route: "/groups/garden/minigarde" },
    { label: "Kindergarde", route: "/groups/garden/kindergarde" },
    { label: "Jugendgarde", route: "/groups/garden/jugendgarde" },
    { label: "Prinzengarde", route: "/groups/garden/prinzengarde" },
    { label: "Erste Garde", route: "/groups/garden/erstegarde" }
  ];

  constructor() {}

  ngOnInit(): void {}
}
