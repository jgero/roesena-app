<script>
  import { fly } from "svelte/transition";

  import { get } from "./libs/http";

  import Header from "./Header.svelte";
  import Footer from "./Footer.svelte";
  import Calendar from "./calendar/Calendar.svelte";
  import NotFound from "./errorpage/NotFound.svelte";
  import Startpage from "./startpage/Startpage.svelte";
  import EventOverview from "./events/EventOverview.svelte";
  import Login from "./login/Login.svelte";

  // get the route and add the route params back on
  let route =
    location.pathname +
    (location.href.split("?").length > 1
      ? "?" + location.href.split("?")[1]
      : "");

  // react when an entry of the browser history is accessed
  window.addEventListener("popstate", e => {
    injectables.navigate(e.state);
  });

  $: {
    history.pushState(route, "route", route);
    prepareAndSwitch();
  }

  // the callbacks are stored in an object on a property that matches the name of the
  // component so that one component can't accidentally register multiple callbacks
  let nameCallbacks = {};
  let username;

  // the injectable functions and values are defined here
  let injectables = {
    navigate: nav => {
      route = nav;
    },
    ROUTER_ANIMATION_DURATION: 250,
    setUsername: name => {
      username = name;
    },
    getUsername: () => {
      return username;
    },
    onUsernameChange: (compName, callback) => {
      nameCallbacks[compName] = callback;
    }
  };

  $: {
    // this reactive block calls all the registered callback for the username
    for (const key in nameCallbacks) {
      if (nameCallbacks.hasOwnProperty(key)) {
        const cb = nameCallbacks[key];
        cb(username);
      }
    }
  }

  get("/api/restore")
    .then(el => {
      username = JSON.parse(el).username;
    })
    .catch(el => console.log(el));

  const routes = [
    {
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

  let params = {};
  let component;

  function prepareAndSwitch() {
    params = {};
    // find the route that matches (starts with) the locations pathname
    let matchingRoute = routes.find(el => {
      if (el.route === "/") {
        // on the root location the path has to match exactly
        return location.pathname === "/";
      } else if (
        el.route.split("/").filter(el => el !== "").length ===
        location.pathname.split("/").filter(el => el !== "").length
      ) {
        // first check if the amount of sub-paths is the same, then match the strings
        return location.pathname.startsWith(el.route);
      }
      return false;
    });
    // if nothing matches take default name
    if (!matchingRoute) {
      matchingRoute = routes.filter(el => el.route === "*")[0];
    }
    // add all the configured props to the params object
    if (matchingRoute.props && matchingRoute.props.length > 0) {
      matchingRoute.props.forEach(prop => {
        if (injectables[prop]) {
          params[prop] = injectables[prop];
        }
      });
    }
    // finally set the component so the routing takes place
    component = matchingRoute.component;
  }
</script>

<style>
  div {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  header,
  footer {
    flex: 0.5;
  }
  main {
    flex: 10;
    min-height: 0;
  }
</style>

<div>
  <header>
    <Header
      navigate={injectables.navigate}
      onUsernameChange={injectables.onUsernameChange} />
  </header>
  <main id="targ">
    <svelte:component this={component} {...params} />
  </main>
  <footer>
    <Footer navigate={injectables.navigate} />
  </footer>
</div>
