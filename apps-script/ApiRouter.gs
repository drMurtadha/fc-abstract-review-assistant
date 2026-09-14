const ApiRouter = {
  actions: {
    setupWorkspace: function() { return SetupService.setupWorkspace(); },
    createSubmission: function(payload) { return SubmissionService.create(payload); },
    getSubmission: function(payload) { return SubmissionService.get(payload.submissionId); },
    listSubmissions: function(payload) { return SubmissionService.list(payload || {}); },
    saveReviewItems: function(payload) { return ReviewService.saveItems(payload); },
    saveReviewerDecision: function(payload) { return ReviewService.saveDecision(payload); },
    updateSubmissionStatus: function(payload) { return ReviewService.updateStatus(payload); },
    runAiReview: function(payload) { return AiReviewService.run(payload); },
    generateReport: function(payload) { return ReportService.generate(payload); }
  },
  handleGet: function(e) {
    try {
      var action = e.parameter && e.parameter.action || 'healthCheck';
      if (action === 'healthCheck') return json_({ success:true, data:{ status:'ok', timestamp:now_() }, error:null });
      return this.respond_(action, e.parameter || {});
    } catch (error) { return this.error_(error); }
  },
  handlePost: function(e) {
    try {
      var request = JSON.parse(e.postData && e.postData.contents || '{}');
      return this.respond_(request.action, request.payload || {});
    } catch (error) { return this.error_(error); }
  },
  respond_: function(action, payload) {
    if (!this.actions[action]) throw new Error('Unknown action: ' + action);
    return json_({ success:true, data:this.actions[action](payload), error:null });
  },
  error_: function(error) {
    console.error(error && error.stack || error);
    return json_({ success:false, data:null, error:error && error.message || 'Unexpected server error.' });
  }
};
