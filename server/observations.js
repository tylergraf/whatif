var stateFlow = {
  question: 'answer',
  answer: 'read',
  read: 'question'
};
function randomizeQuestions(docId, playerAdded){
  console.log('got randomized');
  var game = Games.findOne({_id: docId});
  var gamePlayers = game.players;
  var unassignedPlayers;
  var assignedQuestions = {};

  if(!playerAdded && game.assignedQuestions){
    unassignedPlayers = _.map(game.assignedQuestions, function(player, key){ return player; });
  } else {
    unassignedPlayers = game.players;
  }

  unassignedPlayers = _.shuffle(unassignedPlayers);
  _.each(gamePlayers, function(p,i){
    var randomUser = (i===0) ? unassignedPlayers[unassignedPlayers.length-1] : unassignedPlayers[i-1];
    assignedQuestions[p] = randomUser;
  });

  Games.update({_id: docId}, {$set: {assignedQuestions: assignedQuestions}});
}
function checkIfAllQuestionsAreAsked(game){
  var questions = Questions.find({gameId: game._id, round: game.round}).fetch();

  if(questions.length === game.players.length){
    console.log('got in here');
    randomizeQuestions(game._id);

    Games.update(game._id, {
      $set: {state: stateFlow[game.state]}
    });
  }
}
function checkIfUnansweredQuestions(game){
  var unansweredQuestions = Questions.find({gameId: game._id, round: game.round, answeredUserId: {$exists: false}}).fetch();
  if(!unansweredQuestions.length){
    Games.update(game._id, {
      $set: {state: stateFlow[game.state]}
    });

    randomizeQuestions(game._id);
  }
}
var joinGameQuery = Games.find();
var handle = joinGameQuery.observeChanges({
  changed: function(docId, doc) {
    // if player length is 0, delete the game
    if(doc && doc.players && !doc.players.length){
      console.log('Game deleted because no more players');
      Games.remove({_id: docId});
    }
    // if player is added or removed or if round changes
    if((doc && doc.players) || (doc && doc.round)){
      randomizeQuestions(docId, true);
    }
    // if player is added or removed
    if((doc && doc.players)){
      var game = Games.findOne({_id: docId});
      if(game.state === 'question'){
        checkIfAllQuestionsAreAsked(game);
      } else if(game.state === 'answer'){
        checkIfUnansweredQuestions(game);
      }
    }
  }
});
var answerQuestionQuery = Questions.find({});
var handle = answerQuestionQuery.observeChanges({
  added: function(docId, doc){
    if(doc && doc.gameId){

      var game = Games.findOne(doc.gameId);
      if(!game){
        return false;
      }
      checkIfAllQuestionsAreAsked(game);
    }
  },
  changed: function(docId, doc,a,b) {
    if((doc && doc.answeredUserId)){

      var question = Questions.findOne(docId);
      if(!question){
        return false;
      }

      var game = Games.findOne(question.gameId);
      if(!game){
        return false;
      }

      checkIfUnansweredQuestions(game);

    }
  },
  removed: function(docId){

    // var questions = Questions.find({gameId: game._id, round: game.round}).fetch();
    //
    // if(questions.length !== game.players.length){
    //   Games.update({_id: game._id}, {$set: {state: 'question'}});
    // }
  }
});
