# TODO

## Database

- change db collection names? persons may not fit very well

## Login

- check cookies on API requests
- add "this site uses cookies" popup
- automatically re-route the user to login page when access to something gets denied
- then after login directly navigate back to the page he came from
- think of good way to check authentication
- especially for adding elements

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
