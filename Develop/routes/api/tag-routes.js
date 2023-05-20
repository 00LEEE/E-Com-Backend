const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

router.get('/', async (req, res) => {
  try {
    const tagsData = await Tag.findAll({
      include: [{ model: Product }],
    });
    res.status(200).json(tagsData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ model: Product }],
    });
    if (!tagData) {
      res.status(404).json({ message: 'Tag not found' });
      return;
    }
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const tagData = await Tag.create(req.body);
    res.status(201).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const [updatedRows] = await Tag.update(
      { tag_name: req.body.tag_name },
      { where: { id: req.params.id } }
    );
    if (!updatedRows) {
      res.status(404).json({ message: 'No tag exists.' });
      return;
    }
    res.status(200).json({ message: 'Tag updated successfully.' });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedRowCount = await Tag.destroy({
      where: { id: req.params.id },
    });
    if (!deletedRowCount) {
      res.status(404).json({ message: 'No tag exists.' });
      return;
    }
    res.status(200).json({ message: 'Tag deleted successfully.' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
