var cls = require("./lib/class");

module.exports = Firewall = cls.Class.extend({
  init: function () {
    this.blacklist = {};
    this.suspiciousActivities = {};
    this.MAX_SUSPICIOUS_ACTIONS = 5;
    this.BAN_DURATION_MS = 3600000;
  },

  checkIP: function (ip) {
    if (this.blacklist[ip] && this.blacklist[ip] > Date.now()) {
      return false;
    } else if (this.blacklist[ip]) {
      delete this.blacklist[ip];
    }
    return true;
  },

  logSuspiciousActivity: function (ip, activity) {
    if (!this.suspiciousActivities[ip]) {
      this.suspiciousActivities[ip] = {
        count: 0,
        lastActivity: Date.now(),
      };
    }

    this.suspiciousActivities[ip].count++;
    this.suspiciousActivities[ip].lastActivity = Date.now();

    if (this.suspiciousActivities[ip].count >= this.MAX_SUSPICIOUS_ACTIONS) {
      this.blacklist[ip] = Date.now() + this.BAN_DURATION_MS;
      return false;
    }

    return true;
  },

  cleanupOldEntries: function () {
    const now = Date.now();

    for (let ip in this.blacklist) {
      if (this.blacklist[ip] < now) {
        delete this.blacklist[ip];
      }
    }
    for (let ip in this.suspiciousActivities) {
      if (
        now - this.suspiciousActivities[ip].lastActivity >
        24 * 60 * 60 * 1000
      ) {
        delete this.suspiciousActivities[ip];
      }
    }
  },
});
