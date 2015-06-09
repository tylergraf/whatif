Template.actions.helpers({
  answeredQuestion: function(){
    var answeredQuestion = !!Questions.findOne({answeredUserId: Meteor.userId(), round: Session.get('currentGameRound'), gameId: Session.get('currentGameId')});
    Session.set('answeredQuestion', answeredQuestion);
    return answeredQuestion;
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
  var actions = evt.target.actions.value,
      questionId = evt.target.questionId.value;

  if(!actions){
    return alert('You need to write an actions!');
  }

  var answeredQuestion = Session.get('answeredQuestion');
  if(answeredQuestion){
    return alert("You've already answered the question.");
  }

  Questions.update({_id: questionId},{
    $set: {
      actions: actions,
      answeredUserId: Meteor.userId()
    }
  });

  evt.target.actions.value = '';

  Session.set('answeredQuestion', true);
  return false;
}

Template.actions.events({
  'click #leaveGame': leaveGame,
  'submit #answerForm': submitAnswer
});
