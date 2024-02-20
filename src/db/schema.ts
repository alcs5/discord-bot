import { sqliteTable , text , integer } from 'drizzle-orm/sqlite-core';

export const bottable = sqliteTable('bottable' , {
    id: text('id').primaryKey(),
    amount: integer('amount').default(0)
});