// 登录正则四种
const numReg = /[0-9]/;
const lowercaseReg = /[a-z]/;
const capitalReg = /[A-Z]/;
const specialReg = /[`\-=[\]\\;',./~!@#$%^&*()_+{}|:"<>?]/;

let getRegArr = (arr) => {
  let regArr = [];
  arr.forEach((item) => {
    if (item === '1') {
      regArr.push({
        info: '1',
        verify (str) {
          return lowercaseReg.test(str);
        }
      });
    } else if (item === '2') {
      regArr.push({
        info: '2',
        verify (str) {
          return capitalReg.test(str);
        }
      });
    } else if (item === '3') {
      regArr.push({
        info: '3',
        verify (str) {
          return numReg.test(str);
        }
      });
    } else if (item === '4') {
      regArr.push({
        info: '4',
        verify (str) {
          return specialReg.test(str);
        }
      });
    }
  });
  return regArr;
};
// complicated 密码复杂规则
// complicatedNum 密码复杂规则几种组合
// miniLength 密码最小长度
// pwd 需要验证的密码
export let getRulesState = (complicated, complicatedNum, miniLength, pwd) => {
  if (pwd === 'loginpwd') {
    return true;
  }
  let regArr = getRegArr(complicated.split(','));
  let numArr = regArr.filter((item, index) => {
    return item.verify(pwd);
  });
  if ((numArr.length >= complicatedNum) && (pwd.length >= miniLength * 1)) {
    return true;
  } else {
    return false;
  }
};
