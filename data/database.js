import { MongoClient } from "mongodb";

const connectionProtocol = process.env.MONGODB_CONNECTION_PROTOCOL;
const clusterAddress = process.env.MONGODB_CLUSTER_ADDRESS;
const dbUser = process.env.MONGODB_USERNAME;
const dbPassword = process.env.MONGODB_PASSWORD;
const dbName = process.env.MONGODB_DB_NAME;

if (
  !connectionProtocol ||
  !clusterAddress ||
  !dbUser ||
  !dbPassword ||
  !dbName
) {
  console.error("Missing required MongoDB environment variables.");
  process.exit(1);
}

const encodedUser = encodeURIComponent(dbUser);
const encodedPassword = encodeURIComponent(dbPassword);

const uri = `${connectionProtocol}://${encodedUser}:${encodedPassword}@${clusterAddress}/?retryWrites=true&w=majority&appName=Cluster0`;

console.log("Trying to connect to db", clusterAddress);

const client = new MongoClient(uri);

try {
  await client.connect();
  await client.db(dbName).command({ ping: 1 });
  console.log("Connected successfully to server");
} catch (error) {
  console.log("Connection failed:", error);
  await client.close();
  console.log("Connection closed.");
  process.exit(1);
}

const database = client.db(dbName);

export default database;
