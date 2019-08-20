# TODO

## Database

- don't use only one connection
- create multiple connections
- create easy way to open and close connections
  - interface which implements the connect and disconnect stuff
  - types which access the database implement this interface

## Login

- check cookies on API requests
- add "this site uses cookies" popup
- automatically re-route the user to login page when access to something gets denied
- then after login directly navigate back to the page he came from
- change the login icon to something else when a user is logged in, so you can actually see if you are logged in or not
- improve on the "inject-able" way of sharing the name of the user (make it reactive)
- think of good way to check authentication
- especially for adding elements
- change db collection names? persons may not fit very well

## Date display

- fix up the ISODate stuff
  - date is wrong in browser URL for month selection (off by one month)
  - check number of days in month again, probably wrong when dates are broken
  - matching and displaying dates is not working properly

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

## Articles that helped

- <https://www.sohamkamani.com/blog/2018/03/25/golang-session-authentication/>
- <https://medium.com/@jcox250/password-hash-salt-using-golang-b041dc94cb72>
