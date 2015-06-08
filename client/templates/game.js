

Template.game.helpers({
  askedQuestion: function(){
    var askedQuestion = !!Questions.findOne({userId: Meteor.userId(), round: Session.get('currentGameRound'), gameId: Session.get('currentGameId')});
    Session.set('askedQuestion', askedQuestion);
    return askedQuestion;
  },
  waitingOn: function(){
    var waitingOn;
    var we = [];
    var currentGamePlayerIds = _.pluck(Games.findOne(Session.get('currentGameId')).players, 'userId');
    var questionsAskedPlayerIds = _.pluck(Questions.find({gameId: Session.get('currentGameId'), round: Session.get('currentGameRound')}).fetch(), 'userId');

    waitingOn = _.difference(currentGamePlayerIds,questionsAskedPlayerIds);
    _.each(waitingOn, function(w){
      we.push({userId: w});
    },we);
    if(!we.length){
      Games.update({_id: Session.get('currentGameId')},{$set: {state: 'answer'}});
      Router.go('/game/answer');
    }
    return we;
  },
  games: function () {
    var games = Games.find({});

    return games;
  }
});


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

function submitQuestion(evt){

  evt.preventDefault();
  var question = evt.target.question.value,
      round = Session.get('currentGameRound');

  if(!question){
    return alert('You need to write a question!');
  }

  var askedQuestion = Session.get('askedQuestion');
  if(askedQuestion){
    return alert("You've already asked a question in this game.");
  }

  var newQuestion = Questions.insert({
    gameId: Session.get('currentGameId'),
    question: question,
    userId: Meteor.userId(),
    round: round,
    answer: null,
    createdAt: new Date() // current time
  });

  evt.target.question.value = '';

  Session.set('askedQuestion', true);
  return false;
}

Template.game.events({
  'click #leaveGame': leaveGame,
  'submit #questionForm': submitQuestion
});
