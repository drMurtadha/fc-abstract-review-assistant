const CONFIG = {
  ROOT_FOLDER_NAME: 'FC Abstract Review System',
  SPREADSHEET_NAME: 'FC_Abstract_Review_Registry',
  TIMEZONE: 'Asia/Kuala_Lumpur',
  TABS: {
    Submissions: ['submission_id','student_name','matric_no','programme','thesis_title','supervisor_name','examiner_name','thesis_language','english_word_count','malay_word_count','status','created_at','updated_at','report_url','drive_folder_url'],
    Review_Items: ['submission_id','section','item_code','item_description','auto_result','reviewer_result','comment','evidence','source','updated_at'],
    AI_Comments: ['submission_id','language','review_type','issue_category','comment','suggestion','severity','created_at'],
    Reviewer_Decisions: ['submission_id','final_decision','main_corrections','reviewer_name','decision_date','created_at'],
    Audit_Log: ['log_id','submission_id','action','actor','payload','created_at'],
    Settings: ['key','value','description','updated_at']
  }
};

function scriptProperty_(key) { return PropertiesService.getScriptProperties().getProperty(key); }
function now_() { return Utilities.formatDate(new Date(), CONFIG.TIMEZONE, "yyyy-MM-dd'T'HH:mm:ssXXX"); }
function json_(payload) { return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON); }
