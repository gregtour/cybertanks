/* */
module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json')
	});
	grunt.registerTask('default', function () {
		grunt.log.writeln("build tedge");
		grunt.log.writeln("build client");
		grunt.log.writeln("build server");
	});
};
