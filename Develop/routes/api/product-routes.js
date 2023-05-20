const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

router.get('/', async (req, res) => {
  try {
    const productsData = await Product.findAll({
      include: [{ model: Category }, { model: Tag }],
    });
    res.status(200).json(productsData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag }],
    });
    if (!productData) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    if (req.body.tagIds && req.body.tagIds.length) {
      const productTags = req.body.tagIds.map((tagId) => ({
        product_id: product.id,
        tag_id: tagId,
      }));
      await ProductTag.bulkCreate(productTags);
    }
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.update(req.body, {
      where: { id: req.params.id },
    });
    if (req.body.tagIds && req.body.tagIds.length) {
      await ProductTag.destroy({ where: { product_id: req.params.id } });
      const productTags = req.body.tagIds.map((tagId) => ({
        product_id: req.params.id,
        tag_id: tagId,
      }));
      await ProductTag.bulkCreate(productTags);
    }
    if (!updatedProduct[0]) {
      res.status(404).json({ message: 'No product exists.' });
      return;
    }
    res.status(200).json({ message: 'Product updated successfully.' });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const productData = await Product.destroy({
      where: { id: req.params.id },
    });
    if (!productData) {
      res.status(404).json({ message: 'No product exists.' });
      return;
    }
    res.status(200).json({ message: 'Product deleted successfully.' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
