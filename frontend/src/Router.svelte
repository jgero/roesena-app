<script>
  import Header from "./Header.svelte";
  import Footer from "./Footer.svelte";
  import Calendar from "./calendar/Calendar.svelte";
  import NotFound from "./errorpage/NotFound.svelte";
  import Startpage from "./startpage/Startpage.svelte";

  // get the route
  let route = location.pathname;

  // if you would want to access the url params you would have to do it like that
  // let param = new URL(location.pathname).searchParams.get("test");

  // react when an entry of the browser history is accessed
  window.addEventListener("popstate", e => {
    injectables.navigate(e.state);
  });

  $: {
    history.pushState(route, "route", route);
    prepareAndSwitch();
  }

  // the injectable functions and values are defined here
  let injectables = {
    navigate: nav => {
      route = nav;
    },
    ROUTER_ANIMATION_DURATION: 250
  };

  const routes = [
    {
      route: "/",
      component: Startpage,
      props: ["ROUTER_ANIMATION_DURATION"]
    },
    {
      route: "/calendar",
      component: Calendar,
      props: ["ROUTER_ANIMATION_DURATION"]
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
        } else {
          throw new Error("broken prop: " + prop);
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
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  header,
  footer {
    flex: 1;
  }
  main {
    flex: 10;
  }
</style>

<div>
  <header>
    <Header navigate={injectables.navigate} />
  </header>
  <main>
    <svelte:component this={component} {...params} />
  </main>
  <footer>
    <Footer navigate={injectables.navigate} />
  </footer>
</div>
