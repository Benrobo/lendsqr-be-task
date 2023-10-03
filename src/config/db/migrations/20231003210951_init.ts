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
      table.dateTime("createdAt").defaultTo(knex.fn.now());

      table.primary(["id"]);
      table.unique(["id", "email", "username"]);
    })
    .createTable("wallet", (table) => {
      table.string("id").notNullable();
      table.string("user_id");
      table.decimal("balance", 0, 10);
      table.string("currency");
      table.dateTime("createdAt").defaultTo(knex.fn.now());

      table.primary(["id"]);
      table.unique(["user_id"]);
      table
        .foreign("user_id")
        .references("users.id")
        .deferrable("deferred")
        .onDelete("CASCADE");
    })
    .createTable("transactions", (table) => {
      table.string("id").notNullable();
      table.string("sender_id");
      table.string("receiver_id");
      table.decimal("amount", 0, 10);
      table.string("status");
      table.decimal("fee", 0, 10);
      table.dateTime("createdAt").defaultTo(knex.fn.now());

      table.primary(["id"]);
      table
        .foreign("sender_id")
        .references("users.id")
        .deferrable("deferred")
        .onDelete("CASCADE");
      table
        .foreign("sender_id")
        .references("users.id")
        .deferrable("deferred")
        .onDelete("CASCADE");
    })
    .createTable("payment_events", (table) => {
      table.string("id").notNullable();
      table.string("user_id");
      table.dateTime("createdAt").defaultTo(knex.fn.now());

      table.primary(["id"]);
      table
        .foreign("user_id")
        .references("users.id")
        .deferrable("deferred")
        .onDelete("CASCADE");
    });
}

export async function down(knex: Knex): Promise<void> {}
