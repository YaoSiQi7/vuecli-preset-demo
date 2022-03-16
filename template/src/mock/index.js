import Mock from 'mockjs';

const Random = Mock.Random;

// 设置全局延时，没有延时的话，有时候会检测不到数据变化
Mock.setup({
  timeout: '300-600'
});

// 创建个数组来接收数据
const list = [];
const n = 5;
for (let i = 0; i < n; i++) {
  list.push(Mock.mock({
    functionName: 'aaaa',
    description: '222',
    func: '99999',
    id: Random.id()
  }));
}
// 查询列表
function getList () {
  return {
    code: 200,
    list: list
  };
}
// 增加列表
function addFunc (parms) {
  let o = JSON.parse(parms.body);
  o.id = Random.id();
  list.push(o);
  return {
    code: 200,
    list: list,
    msg: '添加成功'
  };
}
// 删除列表
function deteleFunc (parms) {
  let id = JSON.parse(parms.body).id;
  console.log(id);
  list.map((res, i) => {
    if (res.id == id) { //eslint-disable-line
      list.splice(i, 1);
    }
  });
  return {
    code: 200,
    msg: '删除成功',
    list: list
  };
}
// 编辑列表
function editFunc () {
  return {
    code: 200,
    msg: '编辑成功',
    list: list
  };
}

Mock.mock('/list', 'get', getList);
Mock.mock('/add', 'post', addFunc);
Mock.mock('/detele', 'post', deteleFunc);
Mock.mock('/edit', 'post', editFunc);

export default Mock;
