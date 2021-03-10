(function runMailScript( /* GlideRecord */ current, /* TemplatePrinter */ template,
  /* Optional EmailOutbound */
  email, /* Optional GlideRecord */ email_action, /* Optional GlideRecord */ event) {

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

  printLine('Approving: ' + current.document_id.getDisplayValue());
  printLine('Approving Short Description: ' + current.document_id.short_description.getDisplayValue());

  if (current.u_description) {
    printLine('Description: ' + current.u_description.getDisplayValue());
  }

  var instanceURL = gs.getProperty('glide.servlet.uri');
  var approvalLink = '<a href=' + instanceURL + 'nav_to.do?uri=sysapproval_approver.do%3Fsys_id=' + current.sys_id.toString() + '>Click here to view approval' + '</a>';
  print('<p>' + approvalLink + '</p>');

  if (current.source_table == 'kb_knowledge') {
    var knowledgeUrl = '<a href=' + instanceURL + 'kb_view.do?sys_kb_id=' + current.document_id.sys_id.toString() + '>Click here to preview ' + current.document_id.getDisplayValue() + '</a>';
    print('<p>' + knowledgeUrl + '</p>');
  }

})(current, template, email, email_action, event);
