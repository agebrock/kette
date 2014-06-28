
// Test Drive !
// set up a mapping module
// every function will assign its result to its methodName
exports.simple = {
    form: function (input, callback) {
        //depends in input.formId (inital value)
        setTimeout(callback.bind(null, null, {_id: input.formId}), 1);
    },
    keyB: function (input, callback) {
        //depends on nothing
        //topLayer keys are protected
        input.foo = 'will not show up';
        setTimeout(callback.bind(null, null, 'valueB'), 1);
    },
    clientNotation: function (input, callback) {
        //depends on formKey
        setTimeout(callback.bind(null, null, {_id: input.form._id, questions: {value: 1}}), 1);
    },
    clientNotation2: function (input, callback) {
        setTimeout(callback.bind(null, null, input.clientNotation.questions.value), 1);
    }
};

exports.waterfall = {
    drop1:function(input, callback){
        setTimeout(function(){
            input.sequence.push(1);
            callback(null, 1);
        },30);
    },
    drop2:function(input, callback){
        setTimeout(function(){
            input.sequence.push(2);
            callback(null, 2);
        },20);
    },
    drop3:function(input, callback){
        setTimeout(function(){
            input.sequence.push(3);
            callback(null, 3);
        },10);
    }
}
