import { trigger, transition, style, query, animateChild, animate, group } from "@angular/animations";

export const routeAnimation = trigger("routeAnimation", [
  transition("* <=> *", [
    query(":enter, :leave", style({ position: "absolute", width: "100%" }), { optional: true }),
    group([
      query(
        ":enter",
        [style({ transform: "translateX(100%)" }), animate("0.2s ease-out", style({ transform: "translateX(0)" }))],
        { optional: true }
      ),
      query(
        ":leave",
        [style({ transform: "translateX(0%)" }), animate("0.2s ease-out", style({ transform: "translateX(-100%)" }))],
        { optional: true }
      )
    ])
  ])
]);

export const inOutAnimation = trigger("inOutAnimation", [
  transition(":enter", [
    style({ transform: "translateY(100%)", opacity: 0 }),
    animate("0.2s ease-out", style({ transform: "translateY(0)", opacity: 1 }))
  ]),
  transition(":leave", [
    style({ transform: "translateY(0)", opacity: 1 }),
    animate("0.2s ease-out", style({ transform: "translateY(100%)", opacity: 0 }))
  ])
]);

export const fadeInOut = trigger("inout", [
  transition(":enter", [style({ opacity: 0 }), animate("0.2s ease-out", style({ opacity: 0.8 }))]),
  transition(":leave", [style({ opacity: 0.8 }), animate("0.2s ease-out", style({ opacity: 0 }))])
]);
