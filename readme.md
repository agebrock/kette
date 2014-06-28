# Kette - The Chain

Kette is a simple flowcontrol lib on top of "async".

## HowTo
To create a chain you need a little mapping module like:

    var mappingModule = {
        keyA:function(input, callback){
            //do some async code in here
        },
        keyB:function(input, callback){
            //do some async code in here 
        },
        keyC1:function(input, callback){
            //do some async code in here that requires
            //function "keyA" to be loaded
            asyncCodeThatRequiresKeyA(input.keyA, callback);
        },
        keyC2:function(input, callback){
            //do some async code in here that requires
            //function "keyA, keyB, keyC" to be loaded
            asyncCodeThatRequiresKeyA(input.keyA,input.keyB, input.keyB callback);
        }
    }


    //load kette and create an object vanilla js object to handle the state.
    
    var kette = require('kette'),
        state = {skyIsBlueVarIs:true};
        
    // bind state and module to create a chainable object.
    
    kette(mappingModule, state).    
    parallel('keyA','keyB). 
    waterfall(
    'keyC1',
    'keyC2'
    ).exec(function(error, result){
        // result === state
        holding an object like 
        {
        keyA:resultFromMethod,
        keyB:resultFromMethod
        keyC1:resultFromMethod
        keyC2:resultFromMethod
        }
    }
    
    
For more informationen and working examples check the tests.
        
    
    
