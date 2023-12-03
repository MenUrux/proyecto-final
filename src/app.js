import express from 'express';
import handlebars from 'express-handlebars';
import path from 'path';

import { __dirname } from './utils.js';
import indexViewRouter from './routers/views/index.router.js';
import productViewRouter from './routers/views/products.router.js';
import cartsApiRouter from './routers/api/carts.router.js';
import productsApiRouter from './routers/api/products.router.js';

const app = express();

// Crear una instancia de Handlebars con helpers personalizados
const hbs = handlebars.create({
  helpers: {
    lessorequal: function (lvalue, rvalue, options) {
      if (lvalue <= rvalue) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    },
    truncate: function (str, len) {
      if (str.length > len) {
        return str.substring(0, len) + '...';
      }
      return str;
    }
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Usar la instancia de Handlebars con los helpers para configurar el motor
app.engine('handlebars', hbs.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use('/', indexViewRouter, productViewRouter);
app.use('/api', productsApiRouter, cartsApiRouter);

app.use((error, req, res, next) => {
  const message = `Ha ocurrido un error desconocido: ${error.message}`;
  console.error(message);
  res.status(500).json({ message });
});

export default app;
