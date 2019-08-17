# TODO

## Login

- implement login page in web-app
- add data structure to database
- for now it's enough if only login is possible, accounts will need to be created manually in database
- add API endpoint for login
- this endpoint then adds the authentication token
- session based <https://www.sohamkamani.com/blog/2018/03/25/golang-session-authentication/>
- user makes request to `/login`
- server generates random `session_id` and saves it together with an expiration time and the username
  - save it encrypted with `bcrypt` <https://medium.com/@jcox250/password-hash-salt-using-golang-b041dc94cb72>
  - create salted hash of the pw with `GenerateFromPassword()`
  - convert resulting byte[] to string and save that to the database
  - passwords can then be compared by `CompareHashAndPassword(byteHash, plainPwd)`
    - convert hash string from database to byte[] and compare it with a password string
    - returns boolean whether it matched
- server sets cookie of response to this `session_id` and sends it back
- now on request to other routes the server needs to check if cookie is set and if user is allowed to access the requested content
- if user is not authorized or not authenticated just deny the access
- on logout just remove the `session_id` from the database and the cookie from the request
- check cookies on API requests
- add "this site uses cookies" popup

- automatically re-route the user to login page when access to something gets denied
- then after login directly navigate back to the page he came from
- change the login icon to something else when a user is logged in, so you can actually see if you are logged in or not
- improve on the "inject-able" way of sharing the name of the user (make it reactive)

### Ideas

- separate user into "authority groups"
  - level 5 = admin
  - level 4 = presidency
  - level 3 = group leaders
  - level 2 = members
  - level 1 = guest
- then comparisons for access allowance can be done with:
  
```go
if resource.needed_authority_level > my.authority_level {
    deny_access()
} else {
    grant_access()
}
```
