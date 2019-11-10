# Database

## dumps

The following dups were created by using `mongodump` in the database in the container and then copying the dump out of the container with `docker cp <containerId>:/file/path/within/container /host/path/target` and packaging it up. It can be read back into the database with `mongorestore`.

- `empty-db-dump.zip` contains dump with only the admin user
