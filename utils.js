
/**
 * String format utility.
 *
 * Example :
 *  String.format("Hello {0}, you are {1} years old", "John", 12)
 *  Gives : "Hello John, you are 12 years old"
 */
if (!String.format) {
  String.format = function(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number] 
        : match
      ;
    });
  };
}