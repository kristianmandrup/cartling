'use strict';

const ActivityLogSchema = require('./schemas/activity-log');

class ActivityLog {
  constructor(args = {}) {
    this.schema = ActivityLogSchema;
    this.model = new ActivityLogSchema.model(args);
  }
}
