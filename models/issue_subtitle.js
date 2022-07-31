var express = require('express');
var request = require('request-promise');
const axios = require('axios');
var issue_content = require('./issue_content.js');

function IssueSubtitle(id, title) {
  this._id = id;
  this._title = title;
  this._list_issue = [];
}

IssueSubtitle.prototype.addIssue = async function(id, item) {
  var issue = new issue_content(id, item);
  this._list_issue.push(issue);
}

module.exports = IssueSubtitle;
