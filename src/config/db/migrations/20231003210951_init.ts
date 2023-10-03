import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable("users", (table) => {
      table.string("id").notNullable();
      table.string("email");
      table.string("username");
      table.string("transaction_pin");
      table.string("password_hash");
      table.string("refresh_token");
      table.timestamps(true, true);

      table.primary(["id"]);
      table.unique(["id", "email", "username"]);
    })
    .createTable("wallet", (table) => {
      table.string("id").notNullable();
      table.string("user_id");
      table.decimal("balance", 10);
      table.string("currency");
      table.timestamps(true, true);

      table.primary(["id"]);
      table.unique(["user_id"]);
      table.foreign("user_id").references("users.id").onDelete("CASCADE");
    })
    .createTable("transactions", (table) => {
      table.string("id").notNullable();
      table.string("sender_id");
      table.string("receiver_id");
      table.decimal("amount", 10);
      table.string("status");
      table.decimal("fee", 10);
      table.timestamps(true, true);

      table.primary(["id"]);
      table.foreign("sender_id").references("users.id").onDelete("CASCADE");
      table.foreign("receiver_id").references("users.id").onDelete("CASCADE");
    })
    .createTable("payment_events", (table) => {
      table.string("id").notNullable();
      table.string("user_id");
      table.timestamps(true, true);

      table.primary(["id"]);
      table.foreign("user_id").references("users.id").onDelete("CASCADE");
    });
}

export async function down(knex: Knex): Promise<void> {}
