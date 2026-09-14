const SetupService = {
  setupWorkspace: function() {
    var properties = PropertiesService.getScriptProperties();
    var root = scriptProperty_('ROOT_FOLDER_ID') ? DriveApp.getFolderById(scriptProperty_('ROOT_FOLDER_ID')) : DriveApp.createFolder(CONFIG.ROOT_FOLDER_NAME);
    var folders = ['2026-2027','Uploaded Abstracts','Generated Reports','Generated Corrections','Templates','System Logs'];
    var ids = {};
    folders.forEach(function(name) { ids[name] = DriveService.getOrCreateFolder(root, name).getId(); });
    var academic = DriveApp.getFolderById(ids['2026-2027']);
    ['Master','PhD','Mixed Mode'].forEach(function(name) { DriveService.getOrCreateFolder(academic, name); });
    var spreadsheet = scriptProperty_('SPREADSHEET_ID') ? SpreadsheetApp.openById(scriptProperty_('SPREADSHEET_ID')) : SpreadsheetApp.create(CONFIG.SPREADSHEET_NAME);
    Object.keys(CONFIG.TABS).forEach(function(name) { SheetService.ensureSheet(spreadsheet, name, CONFIG.TABS[name]); });
    properties.setProperties({ ROOT_FOLDER_ID:root.getId(), SPREADSHEET_ID:spreadsheet.getId(), GENERATED_REPORTS_FOLDER_ID:ids['Generated Reports'] });
    return { rootFolderUrl:root.getUrl(), spreadsheetUrl:spreadsheet.getUrl() };
  }
};
