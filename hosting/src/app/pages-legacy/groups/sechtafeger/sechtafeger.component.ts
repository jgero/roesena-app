import { Component, OnInit } from "@angular/core";
import { appImage } from "src/app/utils/interfaces";
import { ImageDalService } from "src/app/services/DAL/image-dal.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: "app-sechtafeger",
  templateUrl: "./sechtafeger.component.html",
  styleUrls: ["./sechtafeger.component.scss"]
})
export class SechtafegerComponent implements OnInit {
  $orden: Observable<appImage>;
  themes = [
    { year: 2020, name: "Gothic", searchString: "gothic" },
    { year: 2019, name: "The Beatles: St.Pepper's Lonley Hearts Club Band", searchString: "beatles" },
    { year: 2018, name: "Jim Knopf und Lukas der Lokomotivführer", searchString: "jim knopf" },
    { year: 2017, name: "Spanien", searchString: "spanien" },
    { year: 2016, name: "Srtuwwelpeter", searchString: "struwwelpeter" },
    { year: 2015, name: "Südstaaten", searchString: "südstaaten" },
    { year: 2014, name: "Modezar Karl Lagerfeld", searchString: "karl lagerfeld" },
    { year: 2013, name: "Space", searchString: "space" },
    { year: 2012, name: "Rosale (Gumpendonnerstag)", searchString: "rosale" },
    { year: 2012, name: "Fischer", searchString: "fischer" },
    { year: 2010, name: "Hexen", searchString: "hexen" },
    { year: 2009, name: "Hippies", searchString: "hippies" },
    { year: 2008, name: "Ritter und Brugfräuleins", searchString: "ritter" },
    { year: 2007, name: "Musketiere", searchString: "Musketiere" },
    { year: 2006, name: "Inder und Inderinnen", searchString: "inder" },
    { year: 2005, name: "Indianer", searchString: "Indianer" },
    { year: 2004, name: "Ritter und Brugfräuleins", searchString: "ritter" }
  ];

  constructor(imageDAO: ImageDalService) {
    this.$orden = imageDAO.getByTags(["Sechtafeger", "Orden"]).pipe(map(images => images[0]));
  }

  ngOnInit(): void {}
}
