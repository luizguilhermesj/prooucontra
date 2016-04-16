module.exports = function (shipit) {
  require('shipit-deploy')(shipit);

  shipit.initConfig({
    default: {
      workspace: '/tmp/prooucontra',
      deployTo: '/root/prooucontra',
      repositoryUrl: 'git@github.com:luizguilhermesj/prooucontra.git',
      ignores: ['.git'],
      rsync: ['--del'],
      keepReleases: 4,
      shallowClone: true
    },
    production: {
      servers: 'root@prooucontra.com.br'
    }
  });
};