var path = require('path');

//module.exports = {
//  //...
//  devServer: {
//    contentBase: path.join(__dirname, 'dist'),
//    compress: true,
//    port: 9000,
//  },
//};

//
//
module.exports = {
  devServer: {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "POST, PUT, GET, OPTIONS, DELETE",
        "Access-Control-Allow-Headers": "Content-Type, Accept, X-Requested-With, Authorization",
        "Access-Control-Max-Age": "360000"
      }
  }
}