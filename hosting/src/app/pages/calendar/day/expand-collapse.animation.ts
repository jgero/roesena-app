import { trigger, state, style, transition, animate, keyframes } from "@angular/animations";

const expandedStyle = style({
  position: "fixed",
  height: "{{calendarHeight}}",
  width: "{{calendarWidth}}",
  top: "{{calendarTop}}",
  left: "{{calendarLeft}}",
  "z-index": 1,
});

const collapsedStyle = style({
  position: "fixed",
  height: "{{height}}",
  width: "{{width}}",
  top: "{{top}}",
  left: "{{left}}",
});

export const expandCollapseAnimation = trigger("expandCollapse", [
  state(
    "collapsed",
    style({
      "z-index": "unset",
    }),
    {
      params: {
        height: "100px",
        width: "100px",
        top: "10%",
        left: "10%",
        calendarLeft: "16px",
        calendarWidth: "800px",
        calendarTop: "30px",
        calendarHeight: "200px",
      },
    }
  ),
  state("expanded", expandedStyle, {
    params: {
      height: "100px",
      width: "100px",
      top: "10%",
      left: "10%",
      calendarLeft: "16px",
      calendarWidth: "800px",
      calendarTop: "30px",
      calendarHeight: "200px",
    },
  }),
  transition("expanded => collapsed", [animate("0.2s ease-out", collapsedStyle)]),
  transition("collapsed => expanded", [animate("0.2s ease-out", keyframes([collapsedStyle, expandedStyle]))]),
]);
