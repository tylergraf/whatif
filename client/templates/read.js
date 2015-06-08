// Session.setDefault('answeredQuestion', false);
//
// Template.answer.helpers({
//   answeredQuestion: function(){
//     var answeredQuestion = !!Questions.findOne({answeredUserId: Meteor.userId(), gameId: Session.get('currentGameId')});
//     Session.set('answeredQuestion', answeredQuestion);
//     return answeredQuestion;
//   },
//   waitingOn: function(){
//     var waitingOn;
//     var we = [];
//     var currentGamePlayerIds = _.pluck(Games.findOne(Session.get('currentGameId')).players, 'userId');
//     var questionsAnsweredPlayerIds = _.pluck(Questions.find({gameId: Session.get('currentGameId')}).fetch(), 'answeredUserId');
//
//     waitingOn = _.difference(currentGamePlayerIds,questionsAnsweredPlayerIds);
//     _.each(waitingOn, function(w){
//       we.push({userId: w});
//     },we);
//
//     return we;
//   },
//   games: function () {
//     var games = Games.find({});
//
//     return games;
//   }
// });
//
//
function leaveGame(evt){
  evt.preventDefault();

  var currentGameId = Session.get('currentGameId');
  var currentGamePlayers = Games.findOne({_id: currentGameId}).players;

  var newPlayerList = _.reject(currentGamePlayers, function(p){
    return p.userId === Meteor.userId();
  });

  Games.update({_id: currentGameId}, {$set: {players: newPlayerList}});

  if(!newPlayerList.length){
    Games.remove({_id: currentGameId});
  }
}

function newGame(evt){
  evt.preventDefault();

  var currentGameId = Session.get('currentGameId');
  var game = Games.findOne(currentGameId);
  Games.update({_id: currentGameId},{
    $set: {
      state: 'question',
      round: game.round+1
    }
  });

  Router.go('/');
}

Template.read.events({
  'click #leaveGame': leaveGame,
  'click #newGame': newGame
});
