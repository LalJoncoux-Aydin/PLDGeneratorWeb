var express = require('express');
const fs = require('fs');

function LogManagement() {
  this.modify_list = [];
}

function generateIssueLog(content) {
  var all_content = {
    "issues": content
  }
  return all_content;
}

function generateIssueLogContent(title, label) {
  var content = {
    title: title,
    label: label
  }
  return content;
}

LogManagement.prototype.versionIssuesLogging = async function(list_issue) {
  var content = [];

  list_issue.forEach(function(title) {
    title._issue_subtitle.forEach(function(subtitle) {
      subtitle._list_issue.forEach(function(issue) {
        content.push(generateIssueLogContent(issue._title, issue._item.labels[0]));
      });
    });
  });
  var to_print = generateIssueLog(content);
  fs.writeFileSync("./logs/issue_log.json", JSON.stringify(to_print));
}

LogManagement.prototype.modifiedLoggingGetDiff = async function(list_issue) {
  var content = [];
  var old_diff = JSON.parse(fs.readFileSync("./logs/issue_log.json"));

  list_issue.forEach(function(title) {
    title._issue_subtitle.forEach(function(subtitle) {
      subtitle._list_issue.forEach(function(issue) {
        old_diff.issues.forEach(function(old_diff) {
          if (issue._title == old_diff.title && issue._item.labels[0] != old_diff.label) {
            content.push(old_diff.title.concat(" from ", old_diff.label, " to ", issue._item.labels[0]));
          }
        })
      });
    });
  });
  return content;
}

module.exports = LogManagement;
