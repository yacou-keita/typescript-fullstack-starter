import "reflect-metadata";
import express from "express";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";

import { openDBConnection } from "./utils/database";
import config from "./constants";
import { createSchema } from "./utils/createSchema";
import * as redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";


const main = async () => {
  let retries = Number(config.dbConnectionRetries);
  const retryTimeout = Number(config.timeoutBeforeRetry);

  while (retries) {
    try {
      const conn = await openDBConnection();
      await conn.synchronize();
      await conn.runMigrations();
      break;
    } catch (error) {
      retries -= 1;
      console.log(error);
      console.log(`retries left: ${retries}`);
      await new Promise((res) => setTimeout(res, retryTimeout));
    }
  }

  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

   //set up cors with express cors middleware
   app.use(
    cors({ origin: [config.frontend_url, config.studio_apollo_graphql_url] })
  );

  app.use(
    session({
      name: "qid",
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: "lax",
        secure: false, // cookie only works in https
      },
      saveUninitialized: false,
      secret: "ksjjjsjjjsgyhuwgqbhjguwe",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await createSchema(),
    context: ({ req, res }) => ({req, res }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ 
    app, 
    cors: false, 
  });

  app.listen(config.port, () => {
    console.log(`server started on port ${config.port}`);
  });
};

main().catch((err) => {
  console.log(err);
});
