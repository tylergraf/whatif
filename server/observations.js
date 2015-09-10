var stateFlow = {
  question: 'answer',
  answer: 'read',
  read: 'question'
};
function randomizeQuestions(docId){
  console.log('got randomized');
  var game = Games.findOne({_id: docId});
  var unassignedUsers = game.players;
  var assignedQuestions = {};

  game.players = _.shuffle(game.players);
  _.each(game.players, function(p,i){
    var randomUser = (i===0) ? game.players[game.players.length-1] : game.players[i-1];
    assignedQuestions[p] = randomUser;
  });

  Games.update({_id: docId}, {$set: {assignedQuestions: assignedQuestions}});
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
      randomizeQuestions(docId);
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
      var questions = Questions.find({gameId: game._id, round: game.round}).fetch();

      if(questions.length === game.players.length){
        console.log('obj');
        randomizeQuestions(game._id);

        Games.update(doc.gameId, {
          $set: {state: stateFlow[game.state]}
        });
      }
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

      var unansweredQuestions = Questions.find({gameId: game._id, round: game.round, answeredUserId: {$exists: false}}).fetch();
      if(!unansweredQuestions.length){
        Games.update(game._id, {
          $set: {state: stateFlow[game.state]}
        });

        randomizeQuestions(game._id);
      }
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
