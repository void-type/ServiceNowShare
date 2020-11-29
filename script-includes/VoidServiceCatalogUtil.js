// A more robust replacement for some functionality in the read-only OOB include GlobalServiceCatalogUtil.

var VoidServiceCatalogUtil = Class.create();
VoidServiceCatalogUtil.prototype = {
  initialize: function () { },

  // Get JS array of catalog variables for a task.
  // withMRVS=true will return MRVS in results.
  getVariablesForTask: function (taskGr, withMRVS) {
    var result = [];

    if (!taskGr.isValidRecord()) {
      return result;
    }

    var variables = taskGr.variables.getElements(withMRVS);

    for (var i = 0; i < variables.length; i++) {
      var variable = variables[i];

      if (!variable.canRead()) {
        continue;
      }

      if (!variable.isMultiRow()) {
        // Not MRVS
        var question = variable.getQuestion();

        if (!question.getValue() || question.getValue() == '') {
          continue;
        }

        // Push the variable
        result.push({
          name: variable.getName(),
          label: variable.getLabel(),
          visible_summary: question.isVisibleSummary(),
          multi_row: false,
          value: variable.getValue(),
          display_value: question.getDisplayValue(),
        });

      } else {
        // MRVS
        var rows = variable.getRows();

        if (rows.length == 0) {
          continue;
        }

        var columnQuestionIds = variable.jsFunction_getQuestionIds().join(',');

        // Look up the visible summary property of the cells.
        var columnQuestionGr = new GlideRecord('item_option_new');
        columnQuestionGr.addQuery('sys_id', 'IN', columnQuestionIds);
        columnQuestionGr.query();

        var columnVisibleSummary = {};

        while (columnQuestionGr.next()) {
          columnVisibleSummary[String(columnQuestionGr.name)] = !!columnQuestionGr.visible_summary;
        }

        var table_variable = [];

        for (var j = 0; j < rows.length; j++) {
          var row = rows[j];
          var cells = row.getCells();
          var columns = [];

          for (var k = 0; k < cells.length; k++) {
            var cell = cells[k];

            var cellName = cell.getName();

            // Push the cell
            columns.push({
              name: cell.getName(),
              label: cell.getLabel(),
              visible_summary: columnVisibleSummary[cellName] || false,
              value: cell.getCellValue(),
              display_value: cell.getCellDisplayValue(),
            });
          }

          // Push the row (set of columns)
          table_variable.push(columns);
        }

        // MRVS not visible if all columns are not visible.
        var mrvsNotVisible = Object.keys(columnVisibleSummary)
          .map(function (v) {
            return columnVisibleSummary[v];
          }).filter(function (v) {
            return v === true;
          }).length == 0;

        // Push the MRVS variable
        result.push({
          name: variable.getName(),
          label: variable.getLabel(),
          visible_summary: !mrvsNotVisible,
          multi_row: true,
          table_variable: table_variable,
        });
      }
    }

    return result;
  },

  // Get JS array of catalog variables for a task where visible_summary=true.
  // withMRVS=true will return MRVS in results.
  getVariablesForTaskVisibleForSummary: function (taskGr, withMRVS) {
    return this.getVariablesForTask(taskGr, withMRVS)
      .filter(function (variable) {
        return variable.visible_summary === true;
      })
      .map(function (variable) {
        if (variable.multi_row === true) {
          variable.table_variable = variable.table_variable.map(function (row) {
            return row.filter(function (cell) {
              return cell.visible_summary === true;
            });
          });
        }
        return variable;
      });
  },

  // Render the variables from above into an html list. MRVS are shown as tables.
  // Useful in mail scripts for variable summary
  transformVariablesToHtml: function (variables) {
    var listOpen = '<ul>';
    var listClose = '</ul>';
    var itemOpen = '<li>';
    var itemClose = '</li>';
    var tableOpen = '<table class="table m-1 table-bordered">';
    var tableClose = '</table>';
    var tableRowOpen = '<tr>';
    var tableRowClose = '</tr>';
    var tableHeadOpen = '<thead>';
    var tableHeadClose = '</thead>';
    var tableHeadCellOpen = '<th>';
    var tableHeadCellClose = '</th>';
    var tableBodyOpen = '<tbody>';
    var tableBodyClose = '</tbody>';
    var tableCellOpen = '<td>';
    var tableCellClose = '</td>';

    var body = variables
      // Put multi_row tables at the bottom.
      .sort(function (a, b) {
        return a.multi_row === b.multi_row ? 0 : a.multi_row ? 1 : -1;
      })
      .map(function (variable) {
        if (variable.multi_row === false) {
          return [itemOpen, variable.label, ': ', variable.display_value, itemClose]
            .join('');
        }

        // MRVS
        var tableLabels = variable.table_variable[0]
          .map(function (cell) {
            return cell.label;
          })
          .map(function (label) {
            return [tableHeadCellOpen, label, tableHeadCellClose]
              .join('');
          })
          .join('');

        var tableHeader = [tableHeadOpen, tableRowOpen, tableLabels, tableRowClose, tableHeadClose]
          .join('');

        var tableRows = variable.table_variable
          .map(function (row) {
            var cells = row
              .map(function (cell) {
                return [tableCellOpen, cell.display_value, tableCellClose]
                  .join('');
              }).join('');

            return [tableRowOpen, cells, tableRowClose]
              .join('');
          })
          .join('');

        var tableTitle = [variable.label, ': <br>']
          .join('');

        return [itemOpen, tableTitle, tableOpen, tableHeader, tableBodyOpen, tableRows, tableBodyClose, tableClose, itemClose]
          .join('');

      })
      .join('');

    return [listOpen, body, listClose]
      .join('');
  },

  type: 'VoidServiceCatalogUtil'
};
