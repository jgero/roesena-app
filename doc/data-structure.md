# Data Structure

## Collections

- persons
- articles
- images
- events

### persons

```json
{
  "name": "john",
  "authorityGroup": 4,
  "groups": [
    "9827d34023fa50230408",
    "23049daf8230957dt3n40"
  ]
}
```

- `name` contains the name string of the person
- `authorityGroup` is a number which defines what content this person can access
- `groups` is an array of the unique ids of the groups this person belongs to

### articles

```json
{
  "_id": "aasdfa234023asdf",
  "date": "20190804",
  "title": "article title",
  "content": "this is the text content of the article",
  "images": [
    "23562g34fa3425612",
    "982e7340235s0230f408"
  ]
}
```

- `_id` is the unique id in the database for the article
- `date` stores the date when the article was created
- `title` contains the title of the article
- `content` is the text content of the article
- `images` contains the array of image ids that belong to this article

### images

```json
{
  "_id": "2903847509278345",
  "description": "this picture shows a dog",
  "image": "data of the image",
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

### events

```json
{
  "title": "this is an event title",
  "description": "this text is an description of the event. in here detailed informations about it can be found",
  "startDate": ISODate("2019-08-31T22:00:00.000Z"),
  "endDate": ISODate("2019-09-30T22:00:00.000Z"),
  "participants": [
    "John",
    "Tiffany",
    "Mary",
    "sports council"
  ],
  "authorityGroup": "3"
},
{
  "title": "using ISO",
  "description": "this text is an description of the event. in here detailed informations about it can be found",
  "startDate": ISODate("2019-08-31T22:00:00.000Z"),
  "endDate": ISODate("2019-09-02T22:00:00.000Z"),
  "participants": [
    "John",
    "Tiffany",
    "Mary",
    "sports council"
  ],
  "authorityGroup": "0"
}
```

- `title` is the title of the event
- `description` contains the text description of the event
- `startDate` is an ISO string of the point in time when the event starts
- `endDate` is an ISO string of the point in time when the event ends
- `participants` lists persons or groups, that are specifically invited to the event
- `authorityGroup` contains the authority level you need at least to access the event
