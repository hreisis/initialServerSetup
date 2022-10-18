var express = require('express');
var router = express.Router();

const middleware = (req, res, next) => {
  console.log('You hit the index');
  next();
}

router.use(middleware);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
