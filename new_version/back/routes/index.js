var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/createAccount", function(req, res) {
  console.log(req.body.identity);
  console.log(req.body.password);
  res.redirect("/");
});


module.exports = router;
