
const express = require('express');
const { body } = require('express-validator')
const adminController = require('../controllers/admin')
const isAuth = require('../middleware/is-auth')
const router = express.Router();

router.get('/add-product', isAuth, adminController.getAddProduct);
router.post('/add-product', [body('title', 'Try a longer title').isString().isLength({ min: 3 }).trim().not().isEmpty(), body('price', 'Need to cost more then 1$').isFloat(), body('description', 'Try a longer description').isLength({ min: 5, max: 400 }).trim()], isAuth, adminController.postAddProduct)
router.get('/products', isAuth, adminController.getProducts)
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct)
router.post('/edit-product', [body('title', 'Try a longer title').isString().isLength({ min: 3 }).trim().not().isEmpty(), body('price', 'Need to cost more then 1$').isFloat(), body('description', 'Try a longer description').isLength({ min: 5, max: 400 }).trim()], isAuth, adminController.postEditProduct)
router.delete('/product/:productId', isAuth, adminController.deleteProduct)

module.exports = router;
