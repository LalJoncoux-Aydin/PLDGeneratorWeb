var express = require('express');
var request = require('request-promise');
const axios = require('axios');
var issue_title = require('./issue_title.js');

function Gitlab() {

  this._api = new issue_title();
  this._mobile = new issue_title();
  this._web = new issue_title();
  this._quality = new issue_title();
  this._devops = new issue_title();
  this._bugs = new issue_title();
  this._total = [];
  this._total_nb_todo = 0;
  this._total_nb_doing = 0;
  this._total_nb_done = 0;
}

Gitlab.prototype.updateIssue = async function(id_project, id_issue, state) {
  var path = 'https://gitlab.com/api/v4/projects/';
  var delete_path = path.concat(id_project, "/issues/", id_issue, "?private_token=glpat-McHJ-xr31eSC8QxaiV3M&labels=");

  await axios.put(delete_path)
    .then((response) => {
    })
    .catch((error) => {
      console.log("AXIOS ERROR: ", error);
    });

  var update_path = delete_path.concat(state);
  await axios.put(update_path)
    .then((response) => {
    })
    .catch((error) => {
      console.log("AXIOS ERROR: ", error);
    });
}

Gitlab.prototype.getAlgoIssue = async function() {
  var auth_res = 'https://gitlab.com/api/v4/projects/34866692/issues';

  await axios.get( auth_res, { headers: { "PRIVATE-TOKEN" : "glpat-McHJ-xr31eSC8QxaiV3M"}})
    .then((response) => {
      this._algo = new issue_title();
      this._algo.setupProject(response.data, 1, "Algorithme", 34866692);
    })
    .catch((error) => {
      console.log("AXIOS ERROR: ", error);
    });
}

Gitlab.prototype.getApiIssue = async function() {
  var auth_res = 'https://gitlab.com/api/v4/projects/26121158/issues';

  await axios.get( auth_res, { headers: { "PRIVATE-TOKEN" : "glpat-McHJ-xr31eSC8QxaiV3M"}})
    .then((response) => {
      this._api = new issue_title();
      this._api.setupProject(response.data, 4, "API", 26121158);
    })
    .catch((error) => {
      console.log("AXIOS ERROR: ", error);
    });
}

Gitlab.prototype.getMobileIssue = async function() {
  var auth_res = 'https://gitlab.com/api/v4/projects/31665094/issues';

  await axios.get( auth_res, { headers: { "PRIVATE-TOKEN" : "glpat-McHJ-xr31eSC8QxaiV3M"}})
    .then((response) => {
      this._mobile = new issue_title();
      this._mobile.setupProject(response.data, 3, "Mobile", 31665094);
    })
    .catch((error) => {
      console.log("AXIOS ERROR: ", error);
    });
}

Gitlab.prototype.getWebIssue = async function() {
  var auth_res = 'https://gitlab.com/api/v4/projects/26121164/issues';

  await axios.get( auth_res, { headers: { "PRIVATE-TOKEN" : "glpat-McHJ-xr31eSC8QxaiV3M"}})
    .then((response) => {
      this._web = new issue_title();
      this._web.setupProject(response.data, 2, "Web", 26121164);
    })
    .catch((error) => {
      console.log("AXIOS ERROR: ", error);
    });
}

Gitlab.prototype.getDevOpsIssue = async function() {
  var auth_res = 'https://gitlab.com/api/v4/projects/35838116/issues';

  await axios.get( auth_res, { headers: { "PRIVATE-TOKEN" : "glpat-McHJ-xr31eSC8QxaiV3M"}})
    .then((response) => {
      this._devops = new issue_title();
      this._devops.setupProject(response.data, 5, "DevOps", 35838116);
    })
    .catch((error) => {
      console.log("AXIOS ERROR: ", error);
    });
}

Gitlab.prototype.getBugIssue = async function() {
  var auth_res = 'https://gitlab.com/api/v4/projects/39428429/issues';

  await axios.get( auth_res, { headers: { "PRIVATE-TOKEN" : "glpat-McHJ-xr31eSC8QxaiV3M"}})
    .then((response) => {
      console.log(response.data)
      this._bugs = new issue_title();
      this._bugs.setupProject(response.data, 6, "Bugs", 39428429);
    })
    .catch((error) => {
      console.log("AXIOS ERROR: ", error);
    });
}

Gitlab.prototype.getProjets = async function() {
  await this.getMobileIssue();
  await this.getWebIssue();
  await this.getApiIssue();
  await this.getAlgoIssue();
  await this.getDevOpsIssue();
  await this.getBugIssue();

  this._total = [];
  this._total.push(this._algo, this._web, this._mobile, this._api, this._devops, this._bugs);
  this._total_nb_done = this._algo._nb_done + this._web._nb_done + this._mobile._nb_done + this._api._nb_done + this._devops._nb_done + this._bugs._nb_done;
  this._total_nb_doing = this._algo._nb_doing + this._web._nb_doing + this._mobile._nb_doing + this._api._nb_doing + this._devops._nb_doing + this._bugs._nb_doing;
  this._total_nb_todo = this._algo._nb_todo + this._web._nb_todo + this._mobile._nb_todo + this._api._nb_todo + this._devops._nb_todo + this._bugs._nb_todo;
}

module.exports = Gitlab;
