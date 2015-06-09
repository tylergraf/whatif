Template.createActions.helpers({
  actions: function(){
    var actions = Actions.find().fetch();

    _.each(actions, function(a){
      a[a.actionType] = true;
    });
    return actions;
  }
});

function saveAction(evt){
  evt.preventDefault();
  var actionType = evt.target.actionType.value,
      presentValue = evt.target.presentValue.value,
      pastValue = evt.target.pastValue.value;

  if(actionType === 'verb' && (!presentValue || !pastValue)){
    return alert('You need to enter a value!');
  } else if(!presentValue){
    return alert('You need to enter a value!');
  }

  if(!actionType){
    return alert('You need to select a type!');
  }

  Actions.insert({
    actionType: actionType,
    actionValue: {present: presentValue, past: pastValue}
  });

  evt.target.presentValue.value = '';
  evt.target.pastValue.value = '';

  return false;
}

function deleteAction(evt){
  evt.preventDefault();

  var actionId = this._id;
  Actions.remove({
    _id: actionId
  });

}

function hideField(evt){
  if(evt.target.value === 'noun'){
    document.querySelector('.pastTense').style.display = 'none';
  } else {
    document.querySelector('.pastTense').style.display = 'block';
  }
}

Template.createActions.events({
  'submit #actionForm': saveAction,
  'click .action': deleteAction,
  'change #actionForm > select': hideField
});
