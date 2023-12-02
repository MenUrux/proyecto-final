import { Router } from 'express';
import { buildResponsePaginated } from '../../utils.js';
import ProductModel from '../../models/product.model.js';

const baseUrl = 'http://localhost:8080';
const router = Router();
router.get('/products', async (req, res) => {
  const { limit = 8, page = 1, sort, search } = req.query;

  const criteria = {};
  const options = { limit, page };

  if (sort) {
    options.sort = { price: sort };
  }

  if (search) {
    criteria.category = search;
  }

  try {
    const result = await ProductModel.paginate(criteria, options);
    const data = buildResponsePaginated({ ...result, search, sort }, baseUrl, search);
    res.render('products', { title: 'Productos | Ecommerce', ...data });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});


router.get('/', (req, res) => {
  res.render('index', { title: 'Inicio | Practica integradora' });
});

router.get('/chat', async (req, res) => {
  res.render('chat', { title: 'Chat | Practica integradora' })
});


router.get('/add-product', (req, res) => {
  res.render('addProduct', { title: 'Agregar Producto' });
});



export default router;