var express = require('express');
var request = require('request-promise');
const axios = require('axios');
var issue_subtitle = require('./issue_subtitle.js');

function Issue_Title() {
  this._id = 0;
  this._id_project = 0;
  this._title = undefined;
  this._issue_subtitle = [];
  this._nb_doing = 0;
  this._nb_done = 0;
  this._nb_todo = 0;
}

Issue_Title.prototype.setupSubTitleName = async function(data) {
  data.forEach(item => {
    if (item.state == "opened") {
      if (item.title.split(".").length - 1 == 1) {
        var substitle_id = Number(item.title.split('.')[1].split('-')[0]);
        var subtitle = new issue_subtitle(substitle_id, item.title);

        this._issue_subtitle.push(subtitle);
      }
    }
  });
}

Issue_Title.prototype.setupIssueContent = async function(data) {
  data.forEach(item => {
    if (item.state == "opened") {
      if (item.title.split(".").length - 1 == 2) {
        var subtitle_id = Number(item.title.split('.')[1].split('-')[0]);
        var content_id = Number(item.title.split('.')[2].split('-')[0]);

        this._issue_subtitle.forEach(subtitle_item => {
          if (subtitle_item._id == subtitle_id) {
            subtitle_item.addIssue(content_id, item);

            // Number labels
            if (item.labels[0] == "To Do") {
              this._nb_todo += 1;
            } else if (item.labels[0] == "Doing") {
              this._nb_doing += 1;
            } else if (item.labels[0] == "Done") {
              this._nb_done += 1;
            }
          }
        });
      }
    }
  });
}

Issue_Title.prototype.sortAllIssues = async function() {
    this._issue_subtitle.sort(function(a, b) {
      return a._id - b._id;
    });

    this._issue_subtitle.forEach(subtitle_item => {
      subtitle_item._list_issue.sort(function(a, b) {
        return a._id - b._id;
      });
    });
}

Issue_Title.prototype.setupProject = async function(data, id, title, project_id) {
  this._nb_todo = 0;
  this._nb_doing = 0;
  this._nb_done = 0;
  this._id = id;
  this._title = title;
  this._id_project = project_id;

  await this.setupSubTitleName(data);
  await this.setupIssueContent(data);
  await this.sortAllIssues();
}

module.exports = Issue_Title;
