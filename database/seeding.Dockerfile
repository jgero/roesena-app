FROM mongo:latest

COPY seeds /seeds

CMD [ "mongoimport", "--host", "mongodb", "--db", "roesena", "--collection", "events", "--type", "json", "--file", "/seeds/events.json", "--jsonArray"]