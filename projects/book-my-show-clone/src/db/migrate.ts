import { migrate } from 'drizzle-orm/postgres-js/migrator';
import db from './db';

const main = async () => {
  console.log('Running migrations...');
  await migrate(db, { migrationsFolder: 'drizzle' });
};

main()
  .then(() => {
    console.log('Migrations completed successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
