Session.setDefault('answeredQuestion', false);

Template.answer.helpers({
  answeredQuestion: function(){
    var answeredQuestion = !!Questions.findOne({answeredUserId: Meteor.userId(), round: Session.get('currentGameRound'), gameId: Session.get('currentGameId')});
    Session.set('answeredQuestion', answeredQuestion);
    return answeredQuestion;
  },
  waitingOn: function(){
    var waitingOn;
    var we = [];
    var currentGamePlayerIds = _.pluck(Games.findOne(Session.get('currentGameId')).players, 'userId');
    var questionsAnsweredPlayerIds = _.pluck(Questions.find({gameId: Session.get('currentGameId'),round: Session.get('currentGameRound')}).fetch(), 'answeredUserId');

    waitingOn = _.difference(currentGamePlayerIds,questionsAnsweredPlayerIds);
    _.each(waitingOn, function(w){
      we.push({userId: w});
    },we);
    if(!we.length){
      Games.update({_id: Session.get('currentGameId')},{$set: {state: 'read'}});
      Router.go('/game/read');
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

function submitAnswer(evt){
  evt.preventDefault();
  var answer = evt.target.answer.value,
      questionId = evt.target.questionId.value;

  if(!answer){
    return alert('You need to write an answer!');
  }

  var answeredQuestion = Session.get('answeredQuestion');
  if(answeredQuestion){
    return alert("You've already answered the question.");
  }

  Questions.update({_id: questionId},{
    $set: {
      answer: answer,
      answeredUserId: Meteor.userId()
    }
  });

  evt.target.answer.value = '';

  Session.set('answeredQuestion', true);
  return false;
}

Template.answer.events({
  'click #leaveGame': leaveGame,
  'submit #answerForm': submitAnswer
});
