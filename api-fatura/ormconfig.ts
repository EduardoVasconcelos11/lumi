// ormconfig.ts
import { DataSource } from 'typeorm';
import { Invoice } from './src/invoices/entities/invoice.entity'; // ✅ cuidado com o caminho relativo

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '159753',
  database: 'energia_lumi',
  entities: [Invoice],
  // entities: ["dist/**/*.entity.js"], 
  migrations: ["dist/migrations/*.js"], // mesmo esquema
  synchronize: false,
});

export default AppDataSource; // 👈 obrigatório para funcionar com CLI
