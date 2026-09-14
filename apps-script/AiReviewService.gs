const AiReviewService={
  run:function(payload){var key=scriptProperty_('AI_API_KEY'),url=scriptProperty_('AI_API_URL');if(!key||!url)throw new Error('AI review is not configured. Rule-based review remains available.');if(!payload.prompt||!payload.abstract)throw new Error('prompt and abstract are required.');var response=UrlFetchApp.fetch(url,{method:'post',contentType:'application/json',headers:{Authorization:'Bearer '+key},payload:JSON.stringify({input:payload.prompt+'\n\n'+payload.abstract}),muteHttpExceptions:true});if(response.getResponseCode()>=300)throw new Error('AI review service is temporarily unavailable.');var result=JSON.parse(response.getContentText());AuditService.log(payload.submissionId,'run_ai_review','system',{language:payload.language});return result;
  }
};
