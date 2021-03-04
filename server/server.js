import "@babel/polyfill";
import dotenv from "dotenv";
import "isomorphic-fetch";
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import Shopify, { ApiVersion } from "@shopify/shopify-api";
import Koa from "koa";
import next from "next";
import Router from "koa-router";
// import { MongoClient } from "mongodb";
import  {myDBget, myDBinsert, myDBset} from './mongodb';

dotenv.config();
const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
});
const handle = app.getRequestHandler();

// //DB settiong
// const MONGO_URL = process.env.NEXT_PUBLIC_MONGO_URL;
// const MONGO_DB_NAME = process.env.NEXT_PUBLIC_MONGO_DB_NAME;
// const MONGO_COLLECTION = 'shops';

// //DB接続設定
// const connectOption = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(","),
  HOST_NAME: process.env.HOST.replace(/https:\/\//, ""),
  API_VERSION: ApiVersion.October20,
  IS_EMBEDDED_APP: true,
  // This should be replaced with your preferred storage strategy
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});

// Storing the currently active shops in memory will force them to re-login when your server restarts. You should
// persist this object in your app.
const ACTIVE_SHOPIFY_SHOPS = {};

app.prepare().then(async () => {
  const server = new Koa();
  const router = new Router();
  server.keys = [Shopify.Context.API_SECRET_KEY];
  server.use(
    createShopifyAuth({
      async afterAuth(ctx) {
        // Access token and shop available in ctx.state.shopify
        const { shop, accessToken, scope } = ctx.state.shopify;
        ACTIVE_SHOPIFY_SHOPS[shop] = scope;

        const response = await Shopify.Webhooks.Registry.register({
          shop,
          accessToken,
          path: "/webhooks",
          topic: "APP_UNINSTALLED",
          webhookHandler: async (topic, shop, body) =>
            delete ACTIVE_SHOPIFY_SHOPS[shop],
        });

        if (!response.success) {
          console.log(
            `Failed to register APP_UNINSTALLED webhook: ${response.result}`
          );
        }

        // Redirect to app with shop parameter upon auth
        ctx.redirect(`/?shop=${shop}`);
      },
    })
  );

  const handleRequest = async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  };


  // // ------------- DB操作 ------------- //

  // //Promissを使った非同期処理 受け取ったkeyとdataをinsert
  // const myDBinsert = function(key,data){
  //   return new Promise( function (resolve, reject){
  //     MongoClient.connect(MONGO_URL, connectOption)
  //     .then(function(db){
  //       var dbObj = db.db(MONGO_DB_NAME);

  //       // key、dataで受け取ったものをコレクションに追加する
  //       dbObj.collection(MONGO_COLLECTION).insertOne({"_id" : key, "data" : data})
  //       .then(function(res){
  //         db.close();
  //         //処理が成功した時のメッセージ
  //         console.log(`DB inserted ; _id: ${key}, data: ${data} `);
  //         return resolve('成功');
  //       }).catch(function(e){
  //         console.log('DB insert error: ', e);
  //       });
  //     }).catch(function(e){
  //       console.log('DB insert error: ', e);
  //     });
  //   });
  // }

  // const myDBget = function (key){
  //   return new Promise(function(resolve, reject){
  //     MongoClient.connect(MONGO_URL, connectOption)
  //     .then(function(db){
  //       var dbObj =db.db(MONGO_DB_NAME);

  //       // key、dataで受け取ったものを検索
  //       dbObj.collection(MONGO_COLLECTION).findOne({"_id" : `${key}`})
  //       .then(function(res){
  //         db.close();
  //         console.log(`DB get ; _id: ${key} `);
  //         if(res == null){
  //           return resolve(null);
  //         }else{
  //           console.log(res.data);
  //           return resolve(res.data);
  //         }
  //       }).catch(function(e){
  //         console.log('DB get error: ', e);
  //       });
  //     }).catch(function(e){
  //       console.log('DB get error: ', e);
  //     });
  //   });
  // };

  // const myDBset = function(key,data){
  //   return new Promise( function (resolve, reject){
  //     MongoClient.connect(MONGO_URL, connectOption)
  //     .then(function(db){
  //       var dbObj = db.db(MONGO_DB_NAME);

  //       // keyを検索してdataを変更する
  //       dbObj.collection(MONGO_COLLECTION).findOneAndUpdate({"_id" : `${key}`}, {$set: {"data": data}}, {new: true})
  //       .then(function(res){
  //         db.close();
  //         //処理が成功した時のメッセージ
  //         console.log(`DB seted ; _id: ${key}, data: ${data} `);
  //         return resolve('成功');
  //       }).catch(function(e){
  //         console.log('DB set error: ', e);
  //       });
  //     }).catch(function(e){
  //       console.log('DB set error: ', e);
  //     });
  //   });
  // }
  // // -------------------------- //




  router.get("/", async (ctx) => {
    const shop = ctx.query.shop;

    // This shop hasn't been seen yet, go through OAuth to create a session
    if (ACTIVE_SHOPIFY_SHOPS[shop] === undefined) {
      ctx.redirect(`/auth?shop=${shop}`);
    } else {
      await handleRequest(ctx);
    }
  });


  router.post("/webhooks", async (ctx) => {
    try {
      await Shopify.Webhooks.Registry.process(ctx.req, ctx.res);
      console.log(`Webhook processed, returned status code 200`);
    } catch (error) {
      console.log(`Failed to process webhook: ${error}`);
    }
  });

  router.get("(/_next/static/.*)", handleRequest); // Static content is clear
  router.get("/_next/webpack-hmr", handleRequest); // Webpack content is clear
  router.get("(.*)", verifyRequest(), handleRequest); // Everything else must have sessions

  server.use(router.allowedMethods());
  server.use(router.routes());
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
    myDBget("test");
  });
});
