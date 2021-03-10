// Client-side catalog helpers.

var VoidServiceCatalogAjax = Class.create();
VoidServiceCatalogAjax.prototype = Object.extendsObject(AbstractAjaxProcessor, {

  // Converts MRVS property names from sys_ids to variable names and returns a more usable object.
  // Useful on Requested Items where MRVS are keyed by sys_id instead of variable name.
  convertMrvsAjax: function () {
    var mrvs = JSON.parse(this.getParameter('sysparm_mrvs'));

    var getVariableName = function (variableSysId) {
      var variableGr = new GlideRecord('item_option_new');
      variableGr.get(variableSysId);
      return String(variableGr.name);
    };

    var variableNamesCache = {};

    // For each row
    var newMrvs = mrvs.map(function (row) {
      // Create a new row with different keys.
      return Object.keys(row).reduce(function (newRow, key) {
        var varName = variableNamesCache[key] || getVariableName(key) || key;
        newRow[varName] = row[key];
        return newRow;
      }, {});
    });

    return JSON.stringify(newMrvs);
  },

  type: 'VoidServiceCatalogAjax'
});
