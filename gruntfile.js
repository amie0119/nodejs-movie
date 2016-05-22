module.exports = function(grunt) {

  grunt.initConfig({
    watch: {
      jade: {
        files: ['views/**'],
        options: {
          livereload: true
        }
      },
      js: {
        files: ['public/js/**', 'models/**/*/js', '/schemas/**/*.js'],
        //tasks: ['jshint'],
        options: {
          livereload: true //当文件出现改动的时候会重新启动服务
        }
      }
    },
    nodemon: {
      dev: {
        options: {
          file: 'app.js',
          args: [],
          ingoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
          watchedExtensions: ['js'],
          watchedFolders: ['./'],
          debug: true,
          delayTime: 1,
          env: {
            PORT: 3000
          },
          cwd: __dirname
        }
      }
    },

    concurrent: {
      tasks: ['nodemon', 'watch'],
      options: {
        logConcurrentOutput: true
      }
    }
  })
  grunt.loadNpmTasks('grunt-contrib-watch');//只要有文件修改就会重新执行注册好的任务
  grunt.loadNpmTasks('grunt-nodemon');//用于实时监听app.js
  grunt.loadNpmTasks('grunt-concurrent');//优化慢任务 如less coffee
  grunt.option('force', true);//不要因为语法或警告中断整个grunt
  grunt.registerTask('default', ['concurrent']);//通过concurrent的tasks传入nodemon和watch 可以执行这两个任务
}