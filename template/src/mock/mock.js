import Mock from 'mockjs';

Mock.mock('/zdy', 'POST', {
  'list': [{
    n: 'aaaa',
    b: '222',
    c: '123'
  }]
});
