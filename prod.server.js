var express = require('express');
var config = require('./config/index');

var port = process.env.PORT || config.build.port;

var app = express();

var router = express.Router();

router.get('/', function(req, res, next) {
  req.url = '/index.html';
  next();
});

app.use(router);

//数据模拟
// const express = require('express');
// const app = express();//请求server
var appData = require('./data.json');//加载本地数据文件
var seller = appData.seller;//获取对应的本地数据
var goods = appData.goods;
var ratings = appData.ratings;
var apiRoutes = express.Router();
// app.use('/api', apiRoutes);//通过路由请求数据

//数据模拟
// before (app) {
  app.get('/api/seller', (req, res) => {
    res.json({
      errno: 0,
      data: seller
    }); //接口返回json数据，上面配置的数据seller就赋值给data请求后调用
  });
  app.get('/api/goods', (req, res) => {
    res.json({
      errno: 0,
      data: goods
    });
  });
  app.get('/api/ratings', (req, res) => {
    res.json({
      errno: 0,
      data: ratings
    });
  });
// }
app.use('/api', apiRoutes);//通过路由请求数据

app.use(express.static('./dist'));

// module.exports = new Promise((resolve, reject) => {
//   // portfinder.basePort = process.env.PORT || config.dev.port
//   portfinder.getPort((err, port) => {
//     if (err) {
//       reject(err)
//     } else {
//       // publish the new Port, necessary for e2e tests
//       process.env.PORT = port
//       // add port to devServer config
//       devWebpackConfig.devServer.port = port

//       // Add FriendlyErrorsPlugin
//       devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
//         compilationSuccessInfo: {
//           messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
//         },
//         onErrors: config.dev.notifyOnErrors
//         ? utils.createNotifierCallback()
//         : undefined
//       }))

//       resolve(devWebpackConfig)
//     }
//   })
// })

module.exports = app.listen(port, function (err) {
  if (err) {
      console.log(err);
      return
  }
  console.log('Listening at http://localhost:' + port + '\n')
});