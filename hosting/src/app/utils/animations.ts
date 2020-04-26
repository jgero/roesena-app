import { trigger, transition, style, query, animateChild, animate, group, stagger } from "@angular/animations";

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
      ),
    ]),
  ]),
]);

export const cardFlyIn = trigger("cardFlyIn", [
  transition("void => *", [
    query(
      ":enter",
      [
        style({ transform: "translateY(-100%)", opacity: 0 }),
        stagger(70, [animate("0.2s ease-out", style({ transform: "translateY(0)", opacity: 1 }))]),
      ],
      { optional: true }
    ),
  ]),
]);

export const fadeInOut = trigger("inout", [
  transition(":enter", [style({ opacity: 0 }), animate("0.2s ease-out", style({ opacity: 0.8 }))]),
  transition(":leave", [style({ opacity: 0.8 }), animate("0.2s ease-out", style({ opacity: 0 }))]),
]);
