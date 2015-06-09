Games = new Mongo.Collection('games');
Questions = new Mongo.Collection('questions');
Actions = new Mongo.Collection('actions');

if(Meteor.isServer){
  Meteor.publish("games", function () {
   return Games.find();
  });
  Meteor.publish("questions", function () {
   return Questions.find();
  });
  Meteor.publish("users", function () {
   return Meteor.users.find();
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

}

function randomizeQuestions(docId){
  var game = Games.findOne({_id: docId});
  var unassignedUsers = game.players;
  var assignedQuestions = {};

  game.players = _.shuffle(game.players);
  _.each(game.players, function(p,i){

    var randomUser = (i===0) ? game.players[game.players.length-1] : game.players[i-1];
    assignedQuestions[p.userId] = randomUser;
  });

  Games.update({_id: docId}, {$set: {assignedQuestions: assignedQuestions}});
}

if(Meteor.isClient){
  var joinGameQuery = Games.find();
  var handle = joinGameQuery.observeChanges({
    changed: function(docId, doc) {
      if((doc && doc.players) || (doc && doc.round)){
        randomizeQuestions(docId);
      }
    }
  });
  var answerQuestionQuery = Questions.find();
  var handle = answerQuestionQuery.observeChanges({
    changed: function(docId, doc,a,b) {
      if((doc && doc.answeredUserId)){
        var gameId = Session.get('currentGameId');
        var gameRound = Session.get('currentGameRound');

        var questions = Questions.find({gameId: gameId, round: gameRound}).fetch();
        var unansweredQuestions = _.reject(questions,function(q){
          return q.answeredUserId;
        });
        if(!unansweredQuestions.length){
          randomizeQuestions(gameId);
        }
      }
    }
  });
}
