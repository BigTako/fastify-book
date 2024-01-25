### Run main development container command

```bash
docker-compose -f docker-compose.yml up
```

#### Execute command within development container

```bash
docker exec fastify-book-backend <command>
```

### Run container for testing application

```bash
docker-compose -f docker-compose-test.yml up -d
```

#### Run tests

```bash
docker exec fastify-book-backend-test npm run test
```

### Stop all containers

```bash
docker stop $(docker ps -q)
```

### Run Prisma migration

```bash
  npx prisma migrate dev --name init
```
