import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.POSTGRES_URL;

const client = connectionString
  ? postgres(connectionString, { max: 1, prepare: false })
  : (null as unknown as ReturnType<typeof postgres>);

export const db = connectionString
  ? drizzle(client, { schema })
  : new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
      get() {
        throw new Error("POSTGRES_URL environment variable is not set");
      },
    });
