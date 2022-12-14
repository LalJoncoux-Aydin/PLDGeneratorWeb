var express = require('express');
const fs = require('fs');

function GenerateElement() {
}

GenerateElement.prototype.generateImage = function(uri) {
  var content = {};

  content['insertInlineImage'] = {
    uri: uri,
    objectSize: {
      height: {
        magnitude: 650,
        unit: "PT"
      },
      width: {
        magnitude: 500,
        unit: "PT"
      }
    },
    location: {
      index: 1
    }
  }

  return content;
}

GenerateElement.prototype.generateBlockOfText = function(content, bold, size, print_text, paragh, underline) {
  content.push(this.generateTextStyle(bold, size, 1, print_text.length + 1, underline));
  content.push(this.generateParagraphStyle(paragh, 1, print_text.length + 1));
  content.push(this.generateText(print_text, 1));
  return content;
}

GenerateElement.prototype.generateRevisionLog = function(description, date, version) {
  var content = {};

  content = {
    date: date,
    version: version,
    auteurs: "Generated",
    sections: "V - Tâches individuelles\nVI - Carte des livrables\nVII - Tableaux stories\nVIII - Rapport d’avancement",
    comment: description
  }

  return content;
}

GenerateElement.prototype.generateText = function(item, index) {
  var content = {};

  content['insertText'] = {
    text: item,
    location: {
      index: index
    }
  }

  return content;
}

GenerateElement.prototype.generateTextStyle = function(bold, font, start, end, underline) {
  var content = {};

  content['updateTextStyle'] = {
    textStyle: {
      bold: bold,
      fontSize: {
        magnitude: font,
        unit: "PT"
      },
      foregroundColor: {
        color: {
          rgbColor: {
            blue: 0.0,
            green: 0.0,
            red: 0.0
          }
        }
      },
      weightedFontFamily: {
        fontFamily: "Neuton",
        weight: 400
      },
      underline: underline
    },
    fields: "fontSize,foregroundColor,weightedFontFamily,bold,underline",
    range: {
      startIndex: start,
      endIndex: end
    }
  }

  return content;
}

GenerateElement.prototype.generateCellStyle = function(rowIndex, columnSpan) {
  var content = {};

  content['updateTableCellStyle'] = {
    tableCellStyle: {
      backgroundColor: {
        color: {
          rgbColor: {
            blue: 0.88,
            red: 0.88,
            green: 0.7
          }
        }
      }
    },
    fields: "backgroundColor",
    tableRange: {
      tableCellLocation: {
        tableStartLocation: {
          index: 2
        },
        columnIndex: 0,
        rowIndex: rowIndex
      },
      columnSpan: columnSpan,
      rowSpan: 1
    }
  }

  return content;
}

GenerateElement.prototype.generateParagraphStyle = function(alignment, start, end) {
  var content = {};

  content['updateParagraphStyle'] = {
    paragraphStyle: {
      alignment: alignment,
    },
    fields: "alignment",
    range: {
      startIndex: start,
      endIndex: end
    }
  }

  return content;
}

GenerateElement.prototype.generateBreak = function(sectionType) {
  var content = {};

  content['insertSectionBreak'] = {
    location: {
      index: 1,
    },
    sectionType: sectionType
  }

  return content;
}

GenerateElement.prototype.generateTable = function(rowsnb, columnsnb) {
  var content = {};

  content['insertTable'] = {
    rows: rowsnb,
    columns: columnsnb,
    location: {
      index: 1
    }
  }

  return content;
}

GenerateElement.prototype.generateMergeTableCells = function(start) {
  var content = {};

  content['mergeTableCells'] = {
    tableRange: {
      tableCellLocation: {
        tableStartLocation: {
          index: 2
        },
        columnIndex: 0,
        rowIndex: start,
      },
      columnSpan: 2,
      rowSpan: 1
    }
  }

  return content;
}

GenerateElement.prototype.generateAllTableStyle = function(length_total, nb_def_done) {
  var style_content = [];

  style_content.push(this.generateMergeTableCells(2));
  style_content.push(this.generateMergeTableCells(3));
  style_content.push(this.generateMergeTableCells(4));
  for (var j = 0; j < nb_def_done; j++) {
    style_content.push(this.generateMergeTableCells(5 + j));
  }
  style_content.push(this.generateTextStyle(false, 11, 5, length_total, false));
  style_content.push(this.generateCellStyle(0, 2));
  style_content.push(this.generateCellStyle(2, 2));
  style_content.push(this.generateCellStyle(4, 2));
  style_content.push(this.generateCellStyle(4 + nb_def_done + 1, 1));
  style_content.push(this.generateCellStyle(4 + nb_def_done + 2, 1));
  style_content.push(this.generateCellStyle(4 + nb_def_done + 3, 1));

  return style_content;
}

GenerateElement.prototype.getTotalLength = function(description) {
  var length_total = 0;

  description.forEach(function(elem, i) {
    var length = 0;

    if (i == 5) {
      length = elem.replace(/<br\/>/g, '-').length;
    } else {
      length = elem.replace(/<br\/>/g, '').length;
    }
    length_total += length;
  });
  return length_total;
}

GenerateElement.prototype.generateIssueTable = function(description, assignee, status) {
  var content = [];
  var index = 5;
  var i = 7;
  var nb_def_done = 0;
  var length_total = 0;

  // TOTAL LENGTH
  length_total = this.getTotalLength(description);

  // CONTENT FILL
  content.push(this.generateText(description[0], index));
  index += 2;
  content.push(this.generateText(description[2], index));
  index += 3;
  content.push(this.generateText(description[1], index));
  index += 2;
  content.push(this.generateText(description[3], index));
  index += 3;
  content.push(this.generateText(description[4], index));
  index += 5;
  content.push(this.generateText(description[5].replace(/<br\/>/g, '\n'), index));
  index += 5;
  content.push(this.generateText(description[6], index));
  index += 5;
  for (; description[i] != "Charge estimée:"; i++, nb_def_done++) {
    content.push(this.generateText(description[i].replace(/<br\/>/g, ''), index));
    index += 5;
  }
  content.push(this.generateText(description[i], index));
  index += 2;
  content.push(this.generateText(description[i + 1], index));
  index += 3;
  content.push(this.generateText("Personne assigné:", index));
  index += 2;
  content.push(this.generateText(assignee, index));
  index += 3;
  content.push(this.generateText("Status:", index));
  index += 2;
  content.push(this.generateText(status, index));

  // STYLE CONTENT
  content = this.generateAllTableStyle(length_total + assignee.length + status.length + 24 + index, nb_def_done).concat(content);

  // TABLE INIT
  content.push(this.generateTable(nb_def_done + 8, 2));

  return content;
}

module.exports = GenerateElement;
