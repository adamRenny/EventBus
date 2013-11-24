module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        banner: '/**\n' +
                ' * EventBus Module\n' +
                ' * Copyright (c) 2012-2013 Adam Ranfelt\n' +
                ' *\n' +
                ' * Permission is hereby granted, free of charge, to any person\n' +
                ' * obtaining a copy of this software and associated documentation\n' +
                ' * files (the "Software"), to deal in the Software without restriction,\n' +
                ' * including without limitation the rights to use, copy, modify, merge,\n' +
                ' * publish, distribute, sublicense, and/or sell copies of the Software,\n' +
                ' * and to permit persons to whom the Software is furnished to do so,\n' +
                ' * subject to the following conditions:\n' +
                ' *\n' +
                ' * The above copyright notice and this permission notice shall be\n' +
                ' * included in all copies or substantial portions of the Software.\n' +
                ' *\n' +
                ' * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,\n' +
                ' * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES\n' +
                ' * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND\n' +
                ' * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT\n' +
                ' * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,\n' +
                ' * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING\n' +
                ' * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE\n' +
                ' * OR OTHER DEALINGS IN THE SOFTWARE.\n' +
                ' */\n\n',

        bower: {
            install: {
                
            }
        },

        // Concatenation
        concat: {
            options: {
                separator: '\n',
                banner: '<%= banner %>'
            },

            dist: {
                src: [
                    'src/wrap/preamble.js',
                    'bower_components/polyfills-pkg/src/*.js',
                    'src/Event.js',
                    'src/Namespace.js',
                    'src/EventBus.js',
                    'src/wrap/suffix.js'
                ],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },

            all: [
                'src/*.js'
            ]
        },

        // Minification
        uglify: {
            options: {
                preserveComments: false,
                mangle: {
                    sort: true
                },
                compress: {
                    hoist_vars: true
                },
                banner: '<%= banner %>',
                sourceMap: 'dist/<%= pkg.name %>.min.map',
                sourceMappingURL: '<%= pkg.name %>.min.map',
                report: 'min'
            },

            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },

        plato: {
            report: {
                options: {
                    jshint: grunt.file.readJSON('.jshintrc')
                },
                files: {
                    'plato': ['src/*.js']
                }
            }
        },

        // Unit testing
        mochacli: {
            options: {
                reporter: 'tap',
                bail: false,
                force: true
            },
            all: ['test/*.tests.js']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-mocha-cli');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-plato');
    grunt.loadNpmTasks('grunt-bower-task');

    grunt.registerTask('dev', ['bower','jshint', 'mochacli']);
    grunt.registerTask('dist', ['bower', 'jshint', 'mochacli', 'plato', 'concat', 'uglify']);

    grunt.registerTask('default', ['dist']);
};