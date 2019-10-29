# TODO

## Help-Page

- add how to contact someone when:
  - a page is missing or a link is broken
- what to do when you forgot your password

## Database

- change db collection names? persons may not fit very well
- remove document links when deleting the document itself (remove person from events when person gets deleted)

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
  - level 1 = guest
- then comparisons for access allowance should be done before providing data!

## GraphQL

- have a look at nested types (images in articles, persons in events -> not just id, but entire person/image)

## Articles that helped

- <https://www.sohamkamani.com/blog/2018/03/25/golang-session-authentication/>
- <https://medium.com/@jcox250/password-hash-salt-using-golang-b041dc94cb72>
