
Meteor.publish("games", function(options) {
 return Games.find();
});


// Meteor.publish("questionsInGameAndRound", function(game) {
//   check(game._id, String);
//   check(game.round, Number);
//   return Questions.find({gameId: game._id, round: game.round});
// });

Meteor.publish("questions", function () {
 return Questions.find();
});
Meteor.publish("users", function () {
 return Meteor.users.find({}, { fields: { profile: true} });
});
Meteor.publish("actions", function () {
 return Actions.find();
});

Games.allow({
  insert: function (userId, doc) {
    return (doc.name && doc.players.length);
  },
  update: function(userId, doc, fieldNames, modifier){
    // only alow update if user is in game
    // return !!_.find(doc.players, function(p){return userId === p.userId});
    return true;
  },
  remove: function(userId, doc){
    return true;
  }
});
Questions.allow({
  insert: function (userId, doc) {
    return (doc.userId && doc.gameId);
  },
  update: function(userId, doc, fieldNames, modifier){
    // only alow update if user is in game
    // return !!_.find(doc.players, function(p){return userId === p.userId});
    return true;
  },
  remove: function(userId, doc){
    return true;
  }
});
