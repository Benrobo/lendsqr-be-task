import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("transactions", (table) => {
    table
      .enum("type", ["withdrawal", "funding", "transfer"])
      .defaultTo("withdrawal");
  });
}

export async function down(knex: Knex): Promise<void> {}
