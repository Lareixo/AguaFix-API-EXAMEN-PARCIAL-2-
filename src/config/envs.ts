import * as dotenv from 'dotenv';
import * as env from 'env-var';

dotenv.config();

export const envs = {
  port: env.get('PORT').default('3000').asPortNumber(),

  mailer: {
    service: env.get('MAILER_SERVICE').default('gmail').asString(),
    user: env.get('MAILER_USER').default('').asString(),
    password: env.get('MAILER_PASSWORD').default('').asString(),
    to: env.get('MAILER_TO').default('').asString(),
  },

  database: {
    type: env.get('DB_TYPE').default('postgres').asString(),
    host: env.get('DB_HOST').default('localhost').asString(),
    port: env.get('DB_PORT').default('5432').asPortNumber(),
    username: env.get('DB_USER').default('postgres').asString(),
    password: env.get('DB_PASSWORD').default('').asString(),
    database: env.get('DB_NAME').default('aguafix').asString(),
  },

  aws: {
    region: env.get('AWS_REGION').default(env.get('AWS_S3_REGION').asString() || 'us-east-1').asString(),
    accessKeyId: env.get('AWS_ACCESS_KEY_ID').default('').asString(),
    secretAccessKey: env.get('AWS_SECRET_ACCESS_KEY').default('').asString(),
    bucketName: env.get('AWS_BUCKET_NAME').default(env.get('AWS_S3_BUCKET_NAME').asString() || '').asString(),
  },

  mapboxToken: env.get('MAPBOX_TOKEN').default('').asString(),
};