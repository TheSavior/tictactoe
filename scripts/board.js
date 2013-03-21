define(function() {
    return function(firstName) {
        var _firstName = firstName;
         
        this.getFirstName = function() {
            return _firstName;
        };
    }
});