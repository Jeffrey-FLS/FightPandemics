const envSchema = require("env-schema");
const path = require("path");
const S = require("fluent-schema");

const { name } = require("./package.json");

const configData = envSchema({
  data: process.env,
  schema: S.object()
    .prop("AUTH_APP_URL", S.string())
    .prop("AUTH_CLIENT_ID", S.string().required())
    .prop("AUTH_DOMAIN", S.string().required())
    .prop("AUTH_SECRET_KEY", S.string().required())
    .prop("AUTH_STATE", S.string().required())
    .prop("COMMIT_HASH", S.string())
    .prop("GEO_SERVICE_URL", S.string().required())
    .prop("MONGO_URI", S.string().required())
    .prop("NODE_ENV", S.string().required())
    .prop("PORT", S.number().default(8000).required())
    .prop("SENTRY_DSN", S.string()),
});

const config = {
  auth: {
    appUrl: configData.AUTH_APP_URL,
    clientId: configData.AUTH_CLIENT_ID,
    domain: `https://${configData.AUTH_DOMAIN}`,
    jwtMongoIdKey: path.join(configData.AUTH_APP_URL, "mongo_id"),
    secretKey: configData.AUTH_SECRET_KEY,
    state: configData.AUTH_STATE,
  },
  env: configData.NODE_ENV,
  errorNotifier: {
    environment: configData.NODE_ENV,
    release: configData.COMMIT_HASH,
    url: configData.SENTRY_DSN,
  },
  geoService: {
    host: `http://${configData.GEO_SERVICE_URL}`,
  },
  mongo: {
    params: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    uri:
      configData.MONGO_URI.startsWith("mongodb://") ||
      configData.MONGO_URI.startsWith("mongodb+srv://")
        ? configData.MONGO_URI
        : `mongodb://${configData.MONGO_URI}`,
  },
  name,
  server: {
    port: configData.PORT,
  },
};

module.exports = { config };
