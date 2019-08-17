# Data Structure

## Collections

- person
- article
- images

### person

```json
{
  "name": "john",
  "authLevel": 4,
  "groups": [
    "9827d34023fa50230408",
    "23049daf8230957dt3n40"
  ]
}
```

- `name` contains the name string of the person
- `authLevel` is a number which defines what content this person can access
- `groups` is an array of the unique ids of the groups this person belongs to

### article

```json
{
  "title": "article title",
  "content": "this is the text content of the article",
  "images": [
    "23562g34fa3425612",
    "982e7340235s0230f408"
  ]
}
```

- `title` contains the title of the article
- `content` is the text content of the article
- `images` contains the array of image ids that belong to this article

### images

```json
{
  "description": "this picture shows a dog",
  "URL": "https://link.to.a.webpage.com/dog",
  "tags": [
    "dog",
    "having fun",
    "animal"
  ]
}
```

- `description` is a short description of the picture that will be displayed below the picture
- `URL` contains the link to the picture (to a separate file storage)
- `tags` are items for grouping images to certain search strings, for example to show a picture when looking at the page of a group an the page of an event
