(function runMailScript( /* GlideRecord */ current, /* TemplatePrinter */ template,
  /* Optional EmailOutbound */
  email, /* Optional GlideRecord */ email_action,
  /* Optional GlideRecord */
  event) {

  function scrubText(text) {
    var hasText = text != undefined && text != null;
    return hasText ? String(text) : '';
  }

  function print(text) {
    template.print(scrubText(text));
  }

  function printLine(text) {
    print(scrubText(text) + '<br>');
  }

  print('<p>');

  printLine('Approval for: ' + current.document_id.getDisplayValue());
  printLine('Approving: ' + current.document_id.short_description.getDisplayValue());

  if (current.u_description) {
    printLine('Description: ' + current.u_description.getDisplayValue());
  }

  printLine('State: ' + current.state.getDisplayValue());

  var task = new GlideRecord(current.source_table);
  task.get(current.sysapproval);

  if (task.request) {
    printLine('Manager or internal contact: ' + task.requested_for.manager.name);
  }

  print('</p>');

  var util = new VoidServiceCatalogUtil();
  var variables = util.getVariablesForTaskVisibleForSummary(task, true);

  if (variables.length > 0) {
    printLine(task.getClassDisplayValue() + ' options:');
    var html = util.transformVariablesToHtml(variables);
    print(html);
  }

})(current, template, email, email_action, event);
