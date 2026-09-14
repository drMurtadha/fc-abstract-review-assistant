const DriveService = {
  getOrCreateFolder: function(parent, name) { var matches=parent.getFoldersByName(name); return matches.hasNext() ? matches.next() : parent.createFolder(name); },
  createSubmissionFolder: function(submissionId, studentName) {
    var parentId=scriptProperty_('GENERATED_REPORTS_FOLDER_ID'); if(!parentId) throw new Error('Generated Reports folder is not configured.');
    var safeName=String(studentName || 'Student').replace(/[\\/:*?"<>|]/g,'_'); return DriveApp.getFolderById(parentId).createFolder(submissionId + '_' + safeName);
  },
  saveOriginal: function(folder, payload) { return folder.createFile('original_submission.txt', 'ENGLISH ABSTRACT\n\n'+payload.englishAbstract+'\n\nBAHASA MELAYU ABSTRACT\n\n'+payload.malayAbstract, MimeType.PLAIN_TEXT); }
};
