function doGet(e) { return ApiRouter.handleGet(e || {}); }
function doPost(e) { return ApiRouter.handlePost(e || {}); }

function setupWorkspace() { return SetupService.setupWorkspace(); }
