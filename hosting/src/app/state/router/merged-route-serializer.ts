import { RouterStateSerializer } from '@ngrx/router-store';
import { ActivatedRouteSnapshot, Params, RouterStateSnapshot } from '@angular/router';
import { MergedRoute } from './merged-route';

export class MergedRouterStateSerializer implements RouterStateSerializer<MergedRoute> {
  serialize(routerState: RouterStateSnapshot): MergedRoute {
    return {
      url: routerState.url,
      params: mergeRouteParams(routerState.root, (r) => r.params),
      queryParams: mergeRouteParams(routerState.root, (r) => r.queryParams),
    };
  }
}

function mergeRouteParams(route: ActivatedRouteSnapshot, getter: (r: ActivatedRouteSnapshot) => Params): Params {
  if (!route) {
    return {};
  }
  const currentParams = getter(route);
  const primaryChild = route.children.find((c) => c.outlet === 'primary') || route.firstChild;
  return { ...currentParams, ...mergeRouteParams(primaryChild, getter) };
}
