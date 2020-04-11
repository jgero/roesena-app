import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-maennerballett",
  templateUrl: "./maennerballett.component.html",
  styleUrls: ["./maennerballett.component.scss"]
})
export class MaennerballettComponent implements OnInit {
  performances = [
    {
      year: 2019,
      theme: "Zurück in die Zukunft",
      trainer: "Sandra Bühler",
      dancers:
        "Michael Heinisch, Markus Wiedenhöfer, Nikolai Rief, Manuel Schlotter, Christian Bühler, Heiko Rup, Daniel Hoff mann, Daniel Wünsch, Hans Feil, Daniel Rathgeb, Johannes Rup, Fabian Seidl, Martin Holzinger, Christian Schlotter, Lukas Uhl, Alexander Schlotter und Jannik Rup"
    },
    {
      year: 2018,
      theme: "Heffi's sixteen sexy sixties sweeties",
      trainer: "Sandra Bühler",
      dancers:
        "Michael Heinisch, Markus Wiedenhöfer, Nikolai Rief, Manuel Schlotter, Christian Bühler, Heiko Rup, Daniel Hoffmann, Daniel Wünsch, Hans Feil, Daniel Rathgeb, Johannes Rup, Fabian Seidl, Martin Holzinger, Christian Schlotter, Lukas Uhl und Alexander Schlotter"
    },
    {
      year: 2017,
      theme: "Di Bémbarè a´no",
      trainer: "Sandra Rathgeb",
      dancers:
        "Michael Heinisch, Markus Wiedenhöfer, Nikolai Rief, Manuel Schlotter, Christian Bühler, Heiko Rup, Daniel Hoffmann, Daniel Wünsch, Hans Feil, Daniel Rathgeb, Johannes Rup, Fabian Seidl, Martin Holzinger, Christian Schlotter, Lukas Uhl und Alexander Schlotter"
    },
    {
      year: 2016,
      theme: "PengPuffPeng",
      trainer: "Sandra Rathgeb",
      dancers:
        "Michael Heinisch, Nikolai Rief, Hans Feil, Daniel Rathgeb, Manuel Schlotter, Daniel Hoffmann, Heiko Rup, Johannes Rup, Fabian Seidl, Martin Holzinger, Christian Schlotter, Markus Wiedenhöfer, Lukas Uhl, Christian Bühler und Alexander Schlotter"
    },
    {
      year: 2015,
      theme: "Bam, Bam, Bam, Bambam, Bam, Bam, Bam",
      trainer: "Nicole Bühler & Sandra Rathgeb",
      dancers:
        "Michael Heinisch, Tobias Landkammer, Nikolai Rief, Hans Feil, Daniel Rathgeb, Manuel Schlotter, Michael Weiß, Daniel Hoffmann, Daniel Wünsch, Heiko Rup, Johannes Rup, Fabian Seidl, Martin Holzinger, Christian Schlotter, Markus Wiedenhöfer, Lukas Uhl, Christian Bühler"
    },
    {
      year: 2014,
      theme: "No Angels",
      trainer: "Corina Riethmüller & Nicole Bühler",
      dancers:
        "Michael Heinisch, Tobias Landkammer, Nikolai Rief, Hans Feil, Daniel Rathgeb, Manuel Schlotter, Michael Weiß, Daniel Hoffmann, Daniel Wünsch, Heiko Rup, Johannes Rup,vFabian Seidl, Martin Holzinger, Christian Schlotter, Markus Wiedenhöfer, Lukas Uhl, Christian Bühler"
    },
    {
      year: 2013,
      theme: "Unga Katunga",
      trainer: "Corina Riethmüller & Nicole Bühler",
      dancers:
        "Michael Heinisch, Tobias Landkammer, Nikolai Rief, Hans Feil, Daniel Rathgeb, Manuel Schlotter, Michael Weiß, Daniel Hoffmann, Daniel Wünsch, Florian Steiner, Heiko Rup, Johannes Rup, Fabian Seidl, Martin Holzinger, Christian Schlotter, Markus Wiedenhöfer"
    },
    {
      year: 2012,
      theme: "Sweet Dreams - die süßeste Versuchung",
      trainer: "Corina Riethmüller & Nicole Bühler",
      dancers:
        "Christian Bühler, Michael Heinisch, Tobias Landkammer, Nikolai Rief, Hans Feil, Daniel Rathgeb, Manuel Schlotter, Michael Weiß, Daniel Hoffmann, Daniel Wünsch, Florian Steiner, Heiko Rup, Christian Schmid, Johannes Rup, Fabian Seidl, Martin Holzinger Markus Wiedenhöfer"
    },
    {
      year: 2011,
      theme: "Vi är alla bra humored och vi dansa runt om i träd",
      trainer: "Corina Riethmüller & Nicole Bühler",
      dancers:
        "Roland Brenner, Christian Bühler, Michael Heinisch, Tobias Landkammer, Nikolai Rief, Hans Feil, Daniel Rathgeb, Manuel Schlotter, Michael Weiß, Daniel Hoffmann, Daniel Wünsch, Florian Steiner, Heiko Rup, Christian Schmid, Markus Wiedenhöfer"
    },
    {
      year: 2010,
      theme: "Party at Bubu‘s Coffeefarm",
      trainer: "Tina Schlotter",
      dancers:
        "Roland Brenner, Christian Bühler, Michael Heinisch, Tobias Landkammer, Nikolai Rief, Hans Feil, Daniel Rathgeb, Manuel Schlotter, Michael Weiß, Daniel Hoffmann, Daniel Wünsch, Florian Steiner, Heiko Rup, Christian Schmid, Markus Wiedehhöfer"
    },
    {
      year: 2009,
      theme: "Buddhas Traumwelt",
      trainer: "Tina Schlotter und Tina Pfeifer",
      dancers:
        "Roland Brenner, Christian Bühler, Michael Heinisch, Daniel Hoffmann, Tobias Landkammer, Josef Lutz, Nikolai Rief, Rainer Rieger, Walter Schlotter, Manuel Schlotter, Christian Schmid, Florian Steiner, Michael Weiß, Markus Wiedenhöfer, Daniel Wünsch"
    },
    {
      year: 2008,
      theme: "In Machu Pichu",
      trainer: "Tina Schlotter",
      dancers:
        "Roland Brenner, Christian Bühler, Michael Heinisch, Tobias Landkammer, Nikolai Rief, Rainer Rieger, Reinhard Scheibli, Walter Schlotter, Josef Seibold, Manuel Schlotter, Wolfgang Rieger, Michael Weiß, Werner Wenhuda, Markus Wiedenhöfer, Franz Schlotter, Florian Steiner, Daniel Hoffmann, Heiko Rup"
    },
    {
      year: 2007,
      theme: "Heiter bis Wolkig",
      trainer: "Tina Schlotter",
      dancers:
        "Roland Brenner, Peter Gentner, Franz Grundler, Michael Heinisch, Tobias Landkammer, Josef Lutz, Thomas Pautz, Rainer Rieger, Nikolai Rief, Reinhard Scheibli, Walter Schlotter, Manuel Schlotter, Michael Weiß, Werner Wenhuda und Markus Wiedenhöfer"
    },
    {
      year: 2006,
      theme: "Unter Palmen - 17 supersüsse Südseefruits",
      trainer: "Tina Schlotter",
      dancers:
        "Roland Brenner, Peter Gentner, Franz Grundler, Michael Heinisch, Tobias Landkammer, Josef Lutz, Thomas Pautz, Rainer Rieger, Reinhard Scheibli, Franz Schlotter, Walter Schlotter, Manuel Schlotter, Bernd Schmid, Michael Weiß, Werner Wenhuda und Markus Wiedenhöfer"
    }
  ];

  constructor() {}

  ngOnInit(): void {}
}
