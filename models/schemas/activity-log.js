var keystone = require('keystone'),
    Types = keystone.Field.Types;

var ActivityLog = new keystone.List('ActivityLog', {
    defaultSort: '+username'
});

ActivityLog.add({
    username: { type: String, required: true },
    collection: { type: String, required: true },
    target: { type: String, required: true }
});

module.exports = ActivityLog;
