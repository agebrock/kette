var async = require('async');


function _assignSelfAsync (mapperModule, fnName, input){
    return function (callback) {
        var newInput = Object.create(input),
            fn = mapperModule[fnName];
        if(!fn || typeof fn !== 'function'){
            fn = function(newInput, cb){
               callback(new Error('Method not found: ' + fnName));
            };
        }
        fn(newInput, function (error, result) {
            input[fnName] = result;
            callback(error);
        });
    }
}

function createMapperObject(mapperModule, methodNames, input) {
    var mapper = {};
    methodNames.forEach(function (fnName) {
        mapper[fnName] = _assignSelfAsync(mapperModule, fnName, input);
    });
    return mapper;
}


function createMapperArray(mapperModule, methodNames, input) {
    return methodNames.map(function (fnName) {
        return _assignSelfAsync(mapperModule, fnName, input);
    });
}

var flowMethods = {
    parallel:function(mapperModule, input, methodNames, callback) {
        async.parallel(createMapperObject(mapperModule, methodNames, input), callback);
    },
    waterfall :function (mapperModule, input, methodNames, callback) {
        async.waterfall(createMapperArray(mapperModule, methodNames, input), callback);
    }
};


function createKette(mapperModule, input) {
    var buffer = [],
        stateChain = {
        exec: function (callback) {
            async.waterfall(buffer, function (error) {
                buffer = [];
                callback(error, input);
            });
        }
    };

    Object.keys(flowMethods).forEach(function (methodName) {
        stateChain[methodName] = function (methodNames) {
            if (!Array.isArray(methodNames)) {
                methodNames = [].slice.call(arguments);
            }
            buffer.push(function (callback) {
                flowMethods[methodName](mapperModule, input, methodNames, function (error) {
                    callback(error);
                });
            });
            return stateChain;
        }
    });

    return stateChain;
}

module.exports = createKette;




