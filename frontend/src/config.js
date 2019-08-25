import Calendar from "./calendar/Calendar.svelte";
import NotFound from "./errorpage/NotFound.svelte";
import Startpage from "./startpage/Startpage.svelte";
import EventOverview from "./events/EventOverview.svelte";
import Login from "./login/Login.svelte";

export const routes = [{
    route: "/",
    component: Startpage,
    props: ["ROUTER_ANIMATION_DURATION", "navigate"]
  },
  {
    route: "/calendar",
    component: Calendar,
    props: ["ROUTER_ANIMATION_DURATION", "navigate"]
  },
  {
    route: "/events",
    component: EventOverview,
    props: ["ROUTER_ANIMATION_DURATION", "navigate"]
  },
  {
    route: "/login",
    component: Login,
    props: [
      "ROUTER_ANIMATION_DURATION",
      "navigate",
      "getUsername",
      "setUsername",
      "onUsernameChange"
    ]
  },
  {
    route: "*",
    component: NotFound,
    props: ["navigate"]
  }
];
