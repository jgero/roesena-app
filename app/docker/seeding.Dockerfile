FROM mongo:latest

COPY cypress/fixtures /seeds

CMD [ "mongoimport", "--host", "mongodb", "--db", "roesena", "--collection", "events", "--type", "json", "--file", "/seeds/events.json", "--jsonArray"]
