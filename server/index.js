Meteor.startup(function () {
  // code to run on server at startup
});

Accounts.onCreateUser(function(options, user) {
  if (options.profile) {
      options.profile.avatar = "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large";
      options.profile.firstName = user.services.facebook.first_name;
      user.profile = options.profile;
  }
  return user;
});
