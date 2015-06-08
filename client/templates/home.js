Template.home.helpers({
  firstName: function() {
    return Meteor.user().profile.firstName;
  },
  games: function () {
    var games = Games.find({});

    return games;
  }
});

Template.home.events({
  'submit #createGameForm': function (evt) {
    evt.preventDefault();
    var gameName = evt.target.gameName.value,
        passcode = evt.target.passcode.value;

    if(!gameName){
      return alert('You need to specify a name');
    }
    var newGame = Games.insert({
      name: gameName,
      players: [{userId: Meteor.user()._id}],
      passcode: passcode,
      state: 'question',
      round: 1,
      createdAt: new Date() // current time
    }, function(err){
      console.log('got here');
      console.log(err);
    });

    evt.target.gameName.value = '';
    evt.target.passcode.value = '';

    Router.go('/game/question');
  },
  'click #games li': function(evt){
    evt.preventDefault();

    if(this.state !=='question'){
      return alert("Can't join game yet, please wait until the next round.");
    }
    Games.update({_id: this._id},{$push: {players: {userId: Meteor.userId()}}});

  }
});
