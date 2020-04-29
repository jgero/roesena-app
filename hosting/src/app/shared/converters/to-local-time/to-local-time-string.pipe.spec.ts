import { ToLocalTimeStringPipe } from "./to-local-time-string.pipe";

xdescribe("ToLocalTimeStringPipe", () => {
  it("create an instance", () => {
    const pipe = new ToLocalTimeStringPipe();
    expect(pipe).toBeTruthy();
  });
});
