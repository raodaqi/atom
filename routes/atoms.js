'use strict';

const AV = require('leanengine');
const Router = require('koa-router');

const router = new Router({prefix: '/atoms'});

const Atom = AV.Object.extend('Apps');

// 查询 Todo 列表
router.get('/', async function(ctx) {

  //获取用户id
  var userId = ctx.query.userId

  if (!userId) {
        
    // ctx.status = 204
    // ctx.message = "手机号不正确"
    ctx.body = {
        code : "1005",
        message:"用户不存在",
        data:{}
    }
    console.log('用户不存在')
    return false;
  }

  const query = new AV.Query(Atom);
  query.equalTo("userId",userId);
  query.descending('createdAt');

  var atoms = [];

  try {
    atoms = await query.find();
  } catch (err) {
    
  }

  ctx.body = {
    code : "200",
    message:"获取成功",
    data:atoms
  }
});

// 新增 Todo 项目
router.post('/', async function(ctx) {
  const userId = ctx.request.body.userId;
  const name = ctx.request.body.name;
  const url = ctx.request.body.url;

  console.log(userId,name,url)

  if (!userId || !name || !url) {
        
    // ctx.status = 204
    // ctx.message = "手机号不正确"
    ctx.body = {
        code : "1006",
        message:"缺少参数",
        data:{}
    }
    console.log('缺少参数')
    return false;
  }

  var Expression=/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
  var objExp=new RegExp(Expression);
  if(objExp.test(url)!=true){
    ctx.body = {
      code : "1007",
      message:"url格式不正确",
      data:{}
  }
  console.log('缺少参数')
  return false;
  }


  var atom = new Atom();
  atom.set('userId', userId);
  atom.set('name', name);
  atom.set('url', url);
  atom = await atom.save();

  ctx.body = {
    code : "200",
    message:"获取成功",
    data:atom
  }
});

module.exports = router;
