(function(){
  var coffee, fs, path, print_tasks, tasks;
  var __hasProp = Object.prototype.hasOwnProperty;
  // `cake` is a simplified version of Make (Rake, Jake) for CoffeeScript.
  fs = require('fs');
  path = require('path');
  coffee = require('coffee-script');
  tasks = {};
  // Mixin the Cake functionality.
  process.mixin({
    // Define a task with a name, a description, and the action itself.
    task: function task(name, description, action) {
      return tasks[name] = {
        name: name,
        description: description,
        action: action
      };
    },
    // Invoke another task in the Cakefile.
    invoke: function invoke(name) {
      return tasks[name].action();
    }
  });
  // Display the list of Cake tasks.
  print_tasks = function print_tasks() {
    var _a, _b, _c, _d, _e, _f, _g, i, name, spaces, task;
    _a = []; _b = tasks;
    for (name in _b) if (__hasProp.call(_b, name)) {
      task = _b[name];
      _a.push((function() {
        spaces = 20 - name.length;
        spaces = spaces > 0 ? ((function() {
          _c = []; _f = 0; _g = spaces;
          for (_e=0, i=_f; (_f <= _g ? i <= _g : i >= _g); (_f <= _g ? i += 1 : i -= 1), _e++) {
            _c.push(' ');
          }
          return _c;
        }).call(this)).join('') : '';
        return puts("cake " + name + spaces + ' # ' + task.description);
      }).call(this));
    }
    return _a;
  };
  // Running `cake` runs the tasks you pass asynchronously (node-style), or
  // prints them out, with no arguments.
  exports.run = function run() {
    return path.exists('Cakefile', function(exists) {
      var args;
      if (!(exists)) {
        throw new Error('Cakefile not found in ' + process.cwd());
      }
      args = process.ARGV.slice(2, process.ARGV.length);
      return fs.cat('Cakefile').addCallback(function(source) {
        var _a, _b, _c, arg;
        eval(coffee.compile(source));
        if (!(args.length)) {
          return print_tasks();
        }
        _a = []; _b = args;
        for (_c = 0; _c < _b.length; _c++) {
          arg = _b[_c];
          if (!(tasks[arg])) {
            throw new Error('No such task: "' + arg + '"');
          }
          tasks[arg].action();
        }
        return _a;
      });
    });
  };
})();