const SheetService = {
  spreadsheet: function() {
    var id = scriptProperty_('SPREADSHEET_ID');
    if (!id) throw new Error('Workspace is not configured. Run setupWorkspace() first.');
    return SpreadsheetApp.openById(id);
  },
  sheet: function(name) { var sheet = this.spreadsheet().getSheetByName(name); if (!sheet) throw new Error('Missing sheet: ' + name); return sheet; },
  ensureSheet: function(spreadsheet, name, headers) {
    var sheet = spreadsheet.getSheetByName(name) || (name === 'Submissions' && spreadsheet.getSheets()[0].getLastRow() === 0 ? spreadsheet.getSheets()[0].setName(name) : spreadsheet.insertSheet(name));
    if (sheet.getLastRow() === 0) { sheet.appendRow(headers); sheet.getRange(1,1,1,headers.length).setFontWeight('bold').setBackground('#0b2f55').setFontColor('#ffffff'); sheet.setFrozenRows(1); }
    return sheet;
  },
  appendObject: function(sheetName, object) { var headers = CONFIG.TABS[sheetName]; this.sheet(sheetName).appendRow(headers.map(function(key) { var value=object[key]; return typeof value === 'object' ? JSON.stringify(value) : (value == null ? '' : value); })); },
  rows: function(sheetName) { var sheet=this.sheet(sheetName), values=sheet.getDataRange().getValues(), headers=values.shift() || []; return values.filter(function(row){return row[0];}).map(function(row){var value={};headers.forEach(function(key,i){value[key]=row[i];});return value;}); }
};
