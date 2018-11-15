var express = require('express');
var router = express.Router();
const config = require('../config.json');


router.use(function(req,res,next){

  
  console.log(req.headers);
  console.log('req.url = %s',req.url);
  console.log('req.ip = %s',req.ip);
  console.log('req.originalUrl = %s',req.originalUrl);
  console.log('req.header', req.headers)

  const {hostRules} = config;
  const matchedRule = hostRules.find((rule) => {
    return req.headers.host === rule.originalReqHost;
  })

  console.log(matchedRule)

  if(matchedRule){    
    global.proxy.on('proxyReq', function(proxyReq, req, res, options){ 
      if(matchedRule.rewriteReqHost){     
        proxyReq.setHeader('host', matchedRule.rewriteReqHost);
      }
    });

    global.proxy.web(req, res,{
      target : matchedRule.target
   });

  } else {
    if(req.url == '/favicon.ico'){
      res.send('/images/favicon.ico');
    } else {
      console.log('not define url prefix : %s',req.url);
      res.status(500).end();
    }
  }
  
  /* for uri based proxy
  const {urlRules} = config;
  const matchedRule = urlRules.find((rule) => {
    return req.url.startsWith(rule.prefix);
  })

  if(matchedRule){    
    global.proxy.on('proxyReq', function(proxyReq, req, res, options){ 
      if(matchedRule.headers.host){     
        proxyReq.setHeader('host', matchedRule.headers.host);
      }
      const rewritedUrl = req.url.replace(matchedRule.prefix,'/');
      proxyReq.path = rewritedUrl;
    });

    global.proxy.web(req, res,{
      target : matchedRule.target
   });

  } else {
    if(req.url == '/favicon.ico'){
      res.send('/images/favicon.ico');
    } else {
      console.log('not define url prefix : %s',req.url);
      res.status(500).end();
    }
  }
*/  

})


module.exports = router;
