var _ = require('lodash');
var events = require('../events');
var notifiers = {
	'email': require('./email'),
	'console': require('./console')
};

module.exports = {
	registerNotifier: function(name, notifier) {
		notifiers[name] = notifier;
	},
	registerAlertNotifications: function(eventName, notifications) {
		_.each(notifications, function(notification) {
			type = notification.type;
			levels = notification.levels;

			var listenForAll = _.contains(levels, 'all');

			events.on(eventName, function(eventInfo) {
				if(!listenForAll && (!eventInfo.level || !_.contains(levels, eventInfo.level))) {
					return;
				}

				notifiers[type].notify(eventInfo);
			});
		});
	}
};