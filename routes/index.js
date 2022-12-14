var express = require('express');
var router = express.Router();
var gitlab_source = require('../models/gitlab.js');
const passport = require('passport');
var googledoc_source = require('../models/googledoc.js');
const fs = require('fs');

var _gitlab = new gitlab_source();
var _googledoc = new googledoc_source();

/* GET home page. */
router.get('/', async function(req, res, next) {
  await _gitlab.getProjets();
  res.render('index', {nav: 'all', issue_title: _gitlab._total, total_nb_done: _gitlab._total_nb_done, total_nb_doing: _gitlab._total_nb_doing, total_nb_todo: _gitlab._total_nb_todo});
});

router.get('/web', function(req, res, next) {
  res.render('web', {nav: 'web', issue_title: _gitlab._web});
});

router.get('/mobile', function(req, res, next) {
  res.render('mobile', {nav: 'mobile', issue_title: _gitlab._mobile});
});

router.get('/api', function(req, res, next) {
  res.render('api', {nav: 'api', issue_title: _gitlab._api});
});

router.get('/algo', function(req, res, next) {
  res.render('algo', {nav: 'algo', issue_title: _gitlab._algo});
});

router.get('/devops', function(req, res, next) {
  res.render('devops', {nav: 'devops', issue_title: _gitlab._devops});
});

router.get('/bugs', function(req, res, next) {
  res.render('bug', {nav: 'bugs', issue_title: _gitlab._bugs});
});

router.get('/testalgo', function(req, res, next) {
  let rawdata = fs.readFileSync('demofile2.json');
  let list_name = JSON.parse(rawdata);
  res.render('testalgo', {nav: 'testalgo', list_name: list_name.results});
});

router.get('/displayalgo', function(req, res, next) {
  res.render('displayalgo', {nav: 'displayalgo'});
});


router.post('/update_issue', async function(req, res, next) {
  id_project = req.query.id_project;
  id_issue = req.query.issue_iid;
  label = req.query.label;
  await _gitlab.updateIssue(id_project, id_issue, label);
  res.redirect('/');
});

router.post('/generate', async function(req, res, next) {
  var description_version = req.body.descriptionVersion;
  var rapport = req.body.rapportAvancement;
  var rapport_titre = req.body.rapportAvancementTitre;
  var newSprint = req.body.newSprint;

  await _googledoc.authorize();
  // Setup the token if its not setup alrdy
  if (req.query.code) {
    var code = req.query.code;
    _googledoc.setupToken(code);
  }
  // Write into document
  _googledoc.updatePLD(_gitlab._total, description_version, rapport, rapport_titre, newSprint);
  res.redirect('/');
});

// router.post('/algoexecute', function(req, res, next) {
//   var ground = req.body.ground;
//   var plant = req.body.plants;
//   var request = req.body.requests;
//
//   console.log(plant);
//   console.log(ground);
//   console.log(request);
//   let rawdata = fs.readFileSync(ground);
//   //let list_ground = JSON.parse(rawdata);
//   //console.log(list_ground)
//   let rawdata2 = fs.readFileSync(request);
//   //let list_request = JSON.parse(rawdata2);
//   //console.log(list_request)
//
//
//
//   res.redirect('/displayalgo');
// });

module.exports = router;
