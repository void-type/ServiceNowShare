(function runMailScript( /* GlideRecord */ current, /* TemplatePrinter */ template,
  /* Optional EmailOutbound */
  email, /* Optional GlideRecord */ email_action,
  /* Optional GlideRecord */
  event) {

  var util = new VoidServiceCatalogUtil();
  var variables = util.getVariablesForTaskVisibleForSummary(current, true);

  if (variables.length > 0) {
    template.print('<p>');
    template.print(current.getClassDisplayValue() + ' options:' + '<br>');
    var html = util.transformVariablesToHtml(variables);
    template.print(html);
    template.print('</p>');
  }

})(current, template, email, email_action, event);
