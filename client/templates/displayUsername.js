Template.displayUsername.helpers({
  player: function() {
    var player = Meteor.users.findOne({_id: this.userId});
    return player && player.profile;
  }
});
