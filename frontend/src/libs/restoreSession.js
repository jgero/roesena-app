import {
  get
} from "./http";

export function restoreSession() {
  get("/api/restore")
    .then(el => {
      console.log(JSON.parse(el).username);
      return JSON.parse(el).username;
    })
    .catch(el => console.log(el));
}
