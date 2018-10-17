'use strict';

const AV = require('leanengine');
const Router = require('koa-router');

const router = new Router({prefix: '/users'});

const Todo = AV.Object.extend('Todo');

// 查询 Todo 列表
router.get('/', async function(ctx) {

    const phone = ctx.request.body.phone;
    const password = ctx.request.body.password;

  //判断手机号是否正确

    var phoneReg = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/;

	if (!phoneReg.test(phone)) {
        
        ctx.status = 204
        // ctx.message = "手机号不正确"
        ctx.body = {
            error:'手机号不正确'
        }
        console.log('手机号不正确')
        return false;
    }
  
  console.log(ctx)
//   await ctx.render('todos.ejs');
});

// 新增 Todo 项目
router.post('/', async function(ctx) {
    const phone = ctx.request.body.phone;
    const password = ctx.request.body.password;

  //判断手机号是否正确

    var phoneReg = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/;

	if (!phoneReg.test(phone)) {
        
        // ctx.status = 204
        // ctx.message = "手机号不正确"
        ctx.body = {
            code : "1001",
            message:"手机号不正确",
            data:{}
        }
        console.log('手机号不正确')
        return false;
    }

    if(password.length  < 6){
        // ctx.status = 1002
        // ctx.message = "密码太短"
        ctx.body = {
            code : "1002",
            message:"密码太短",
            data:{}
        }
        console.log('密码太短')
        return false;
    }

    //查询用户

    var query = new AV.Query('_User');
    query.equalTo("username",phone);
    var user = await query.first();
    console.log(user)

    if(user){
        //存在
        ctx.body = {
            code : "1003",
            message:"用户已存在",
            data:user
        }
        return;
    }

    var user = new AV.User();
    // 设置用户名
    user.setUsername(phone);
    // 设置密码
    user.setPassword(password);

    var user = {}

    try{
        user = await user.signUp()
    }catch(err){
        // console.log(err)
        ctx.body = {
            code : "1004",
            message:"登录失败",
            data:user
        }

        return;
    }

    

    console.log("user")
    console.log(user)

    // ctx.status = 200
    // ctx.message = "获取成功"
    ctx.body = {
        code : "200",
        message:"获取成功",
        data:user
    }
});

module.exports = router;
