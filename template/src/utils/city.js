// export default lib;
const modulesFiles = require.context('../../node_modules/echarts/map/js/province', true, /\.js$/);
const provinecs = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1');
  const value = modulesFiles(modulePath);
  modules[moduleName] = value.default;
  return modules;
}, {});
export default provinecs;
