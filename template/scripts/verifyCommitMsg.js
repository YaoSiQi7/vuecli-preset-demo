const chalk = require('chalk')  // eslint-disable-line
const msgPath = process.env.GIT_PARAMS;
const msg = require('fs').readFileSync(msgPath, 'utf-8').trim();

const commitRE = /^(v\d+\.\d+\.\d+(-(alpha|beta|rc.\d+))?)|((revert: )?(feat|fix|docs|style|refactor|perf|test|workflow|ci|chore|types|revert|WIP)(\(.+\))?!?: .{1,50})/;

if (!commitRE.test(msg)) {
  console.log();
  console.error(
    `  ${chalk.bgRed.white(' ERROR ')} ${chalk.red(`commit 信息格式不正确.`)}\n\n` +
    chalk.red(`  commit 信息不符合提交规范 请查看示例代码. 如下:\n\n`) +
    `    ${chalk.green(`feat(路由): 新增 '业务变量库' 模块`)}\n` +
    `    ${chalk.green(`fix(业务变量库): handle events on blur (关闭禅道 #28)`)}\n\n` +
    chalk.red(`  更多细节请查看 ${chalk.bgRed.white(`.cz-config.js`)} 文件.\n`) +
    chalk.red(`  你也可以使用 ${chalk.cyan(`npm run commit`)} 命令来生成 commit 信息.\n`)
  );
  process.exit(1);
}
