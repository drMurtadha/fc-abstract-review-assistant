const SubmissionService = {
  required: ['studentName','matricNo','programme','thesisTitle','thesisLanguage','englishAbstract','malayAbstract'],
  create: function(payload) {
    this.required.forEach(function(key){if(!String(payload[key]||'').trim())throw new Error('Missing required field: '+key);});
    var id='SUB-'+Utilities.formatDate(new Date(),CONFIG.TIMEZONE,'yyyy')+'-'+Utilities.getUuid().slice(0,8).toUpperCase();
    var timestamp=now_(), folder=DriveService.createSubmissionFolder(id,payload.studentName); DriveService.saveOriginal(folder,payload);
    SheetService.appendObject('Submissions',{submission_id:id,student_name:payload.studentName,matric_no:payload.matricNo,programme:payload.programme,thesis_title:payload.thesisTitle,supervisor_name:payload.supervisorName,examiner_name:payload.examinerName,thesis_language:payload.thesisLanguage,english_word_count:this.count_(payload.englishAbstract),malay_word_count:this.count_(payload.malayAbstract),status:'Pre-checked',created_at:timestamp,updated_at:timestamp,drive_folder_url:folder.getUrl()});
    if(payload.reviewItems) ReviewService.saveItems({submissionId:id,items:payload.reviewItems});
    AuditService.log(id,'create_submission',payload.studentName,{status:'Pre-checked'}); return {submissionId:id,status:'Pre-checked',driveFolderUrl:folder.getUrl()};
  },
  count_: function(text){return String(text||'').trim().split(/\s+/).filter(Boolean).length;},
  get: function(id){var found=SheetService.rows('Submissions').filter(function(row){return row.submission_id===id;})[0];if(!found)throw new Error('Submission not found.');found.review_items=SheetService.rows('Review_Items').filter(function(row){return row.submission_id===id;});return found;},
  list: function(filters){var rows=SheetService.rows('Submissions');if(filters.status)rows=rows.filter(function(row){return row.status===filters.status;});if(filters.programme)rows=rows.filter(function(row){return row.programme===filters.programme;});return rows.slice(0,Number(filters.limit||100));}
};
