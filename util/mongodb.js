import { MongoClient } from 'mongodb'

//DB settiong
const MONGO_URL = process.env.NEXT_PUBLIC_MONGO_URL;
const MONGO_DB_NAME = process.env.NEXT_PUBLIC_MONGO_DB_NAME;
const MONGO_COLLECTION = 'shops';

let cached = global.mongo

if (!cached) {
  cached = global.mongo = { conn: null, promise: null }
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }

    cached.promise = MongoClient.connect(MONGO_URL, opts).then((client) => {
      return {
        client,
        db: client.db(MONGO_DB_NAME),
      }
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}







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

  // export {myDBget, myDBinsert, myDBset};