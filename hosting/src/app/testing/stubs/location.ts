export class LocationStub {
  constructor(public navigationId = 1) {}

  back() {}

  getState() {
    return { navigationId: this.navigationId };
  }
}
