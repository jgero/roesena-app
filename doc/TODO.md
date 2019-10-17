# TODO

## Help-Page

- add how to contact someone when:
  - a page is missing or a link is broken
- what to do when you forgot your password

## Database

- change db collection names? persons may not fit very well

## Login

- check cookies on API requests
- add "this site uses cookies" popup
- then after login directly navigate back to the page he came from
- think of good way to check authentication
  - add query type in GraphQL named "me" and return Person object and set cookie (to replace restore)
  - login and logout should be a mutation
- especially for adding elements

### Ideas

- separate user into "authority groups"
  - level 5 = admin
  - level 4 = presidency
  - level 3 = group leaders
  - level 2 = members
  - level 1 = guest (not logged in)
- then comparisons for access allowance can be done with:

## GraphQL

- multiple connections from middleware to database are opened atm, clean that up!
  - maybe move resolvers out of classes and use decorators to inject a connection
- put the complete image type as an array in the article, not just the id, so a complete article with images and everything can be loaded in one request

## Articles that helped

- <https://www.sohamkamani.com/blog/2018/03/25/golang-session-authentication/>
- <https://medium.com/@jcox250/password-hash-salt-using-golang-b041dc94cb72>
