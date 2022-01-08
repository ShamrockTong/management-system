import { find, assign } from 'lodash'
import axios from 'axios'


const users = [
  { username: 'van', password: '123', uuid: 'admin-uuid', name: 'Admin' },
  { username: 'editor', password: 'editor', uuid: 'editor-uuid', name: 'Editor' },
  { username: 'user1', password: 'user1', uuid: 'user1-uuid', name: 'User1' }
]
export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({
  /**
   * @description 登录
   * @param {Object} data 登录携带的信息
   */
  SYS_USER_LOGIN (data = {}) {
   
    // mock
      // .onAny('/login')
      // .reply(config => {
    // // axios.post('http://localhost:3000/api/login', {
    // //       username: tools.parse(config.data).username,
    // //       pwd: tools.parse(config.data).password
    // //     }).then(function (res) {
    // //        if(res.data.success){
    // //          const result = {username:tools.parse(config.data).username,pwd:tools.parse(config.data).password}
    // //          console.log('登录成功',result);
    // //       tools.responseSuccess(assign({}, result, { token: faker.random.uuid() }))
    // //          }else{
    // //       console.log('登陆失败');
    // //       tools.responseError({}, '账号或密码不正确')
    // //   }
    // //   }).catch(function (error) {
    // //       console.log(error);
    // //   });
    //     // console.log(tools.parse(config.data).username)
        // const user = find(users, tools.parse(config.data))
        // return user
        //   ? tools.responseSuccess(assign({}, user, { token: faker.random.uuid() }))
        //   : tools.responseError({}, '账号或密码不正确')
    // 接口请求
    
    console.log(data)
    return (
      request({
      url: 'login',
      method: 'post',
      data
    })
    )
    
  }
})
