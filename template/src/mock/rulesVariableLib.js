import Mock from 'mockjs';

export default Mock.mock('/api/query', 'get', {
  'status': 200,
  'list': [{
    n: 'aaaa',
    b: '222',
    c: '123'
  }]
});
