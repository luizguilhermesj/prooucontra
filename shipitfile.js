module.exports = function (shipit) {
  require('shipit-deploy')(shipit);

  shipit.initConfig({
    default: {
      workspace: '/tmp/prooucontra',
      deployTo: '/root/prooucontra',
      repositoryUrl: 'git@github.com:luizguilhermesj/prooucontra.git',
      ignores: ['.git'],
      rsync: ['--del'],
      keepReleases: 4
    },
    production: {
      servers: 'root@prooucontra.com.br'
    },
    staging: {
      deployTo: '/root/prooucontra-staging',
      servers: 'root@prooucontra.com.br'
    }
  });

  shipit.task('npm',['deploy'], function () {
    return shipit.remote('cd '+shipit.releasePath+' && npm install');
  });

  shipit.task('restart',['npm'], function(){
    
    // shipit.remote('forever stop /root/prooucontra/current/bin/www');
    // shipit.remote('forever start /root/prooucontra/current/bin/www');

    shipit.remote('forever stop '+shipit.currentPath+'/bin/www');
    shipit.remote('PORT=3001 forever start '+shipit.currentPath+'/bin/www');

  });

  shipit.start('deploy','npm','restart');
};