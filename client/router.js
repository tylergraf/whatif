Meteor.subscribe('users');
Meteor.subscribe('games');
Meteor.subscribe('questions');

Router.configure({
  layoutTemplate: 'layout'
});

if (Meteor.isClient) {
  Router.onBeforeAction('inGame', {except: ['loading']});
  Router.onBeforeAction('inCurrentGame', {only: ['game','answer','read']});
}

Iron.Router.hooks.inGame = function () {
  Session.set("currentGameId", null);
  Session.set("currentGameRound", null);
  Session.set("currentGameState", null);

  this.wait(Meteor.subscribe('games'));

  if (this.ready()) {
    if(Meteor.userId()){
      var currentGame = Games.findOne( { 'players.userId': { $in: [Meteor.userId()]  } } );
      if(currentGame){
        Session.set("currentGameId", currentGame._id);
        Session.set("currentGameRound", currentGame.round);
        Session.set("currentGameState", currentGame.state);
      }
      this.next();
    }
  }
};
Iron.Router.hooks.inCurrentGame = function () {
  var currentGameId = Session.get('currentGameId');
  var inCurrentGame = Games.findOne( {_id: currentGameId, 'players.userId': { $in: [Meteor.userId()]  } } );
  if(inCurrentGame){
    this.next();
  } else {
    this.redirect('/');
  }
};
function checkGameState(state){
  var currentGameState = Session.get('currentGameState');
  return currentGameState === state;
}
Router.route('/', function () {
  if(Meteor.userId()){
    if(Session.get('currentGameId')){
      var currentGameState = Session.get('currentGameState');
      return this.redirect('/game/'+currentGameState);
    }
    this.render('home');
  } else {
    this.render('home');
  }
});

Router.route('/game/question', function () {
  if(!Session.get('currentGameId') || !checkGameState('question')){
    return this.redirect('/');
  }

  Session.set('askedQuestion', false);
  var game = Games.findOne({_id: Session.get('currentGameId')});

  this.render('game', {data: {game: game}});

});

Router.route('/game/answer', function () {
  if(!Session.get('currentGameId') || !checkGameState('answer')){
    return this.redirect('/');
  }

  var game = Games.findOne({_id: Session.get('currentGameId')});

  var questionId = game.assignedQuestions[Meteor.userId()].userId;
  var question = Questions.findOne({userId: questionId, round: Session.get('currentGameRound'),gameId: Session.get('currentGameId')});

  this.render('answer', {data: {game: game, question: question}});

});

Router.route('/game/read', function () {
  if(!Session.get('currentGameId') || !checkGameState('read')){
    return this.redirect('/');
  }

  var game = Games.findOne({_id: Session.get('currentGameId')});

  var questionId = game.assignedQuestions[Meteor.userId()].userId;
  var question = Questions.findOne({userId: questionId, round: Session.get('currentGameRound'),gameId: Session.get('currentGameId')});

  this.render('read', {data: {game: game, question: question}});

});
