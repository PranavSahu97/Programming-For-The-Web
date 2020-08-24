const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');

const AppError = require('./app-error');

const OK = 200;
const CREATED = 201;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const CONFLICT = 409;
const SERVER_ERROR = 500;

function serve(port, model) {
  //@TODO set up express app, routing and listen
  const app=express();
  app.locals.port=port;
  app.locals.model=model;
  setupRoutes(app);
  app.listen(port, function(){
    console.log(`listening on port ${port}`);
  });
}

module.exports = { serve: serve };

const base = '/sensor-types';
const base1='/sensors';
const base2='/sensor-data';

//@TODO routing function, handlers, utility functions
function setupRoutes(app){
  app.use(cors());
  app.use(bodyParser.json());
  app.get(base, doList(app));
  app.get(`${base}/:id`, doGet(app));
  app.post(base, doCreate(app));
  app.get(base1,doList1(app));
  app.get(`${base1}/:id`, doGet1(app));
  app.post(base1, doCreate1(app));
  app.get('/sensor-data/:sensorId', doList2(app));
  app.get(`${base2}/:id/:timestamp`, doGet2(app));
  app.post('/sensor-data/:sensorId', doCreate2(app));
}

function doList(app){
  return errorWrap(async function(req,res){
    const q=req.query||{};
    
    try{
      const results=await app.locals.model.findSensorTypes(q);
      let n=results.nextIndex;
      let p=results.previousIndex;
      for(let i=0; i<results.data.length;i++){
        results.data[i].self=requestUrl(req);
      }
      results.self=requestUrl(req);
      if(results.previousIndex===0 || results.previousIndex===-1 || results.nextIndex==-1 || results.nextIndex==0){
      results.next= requestUrl(req).split('?', 1) + '?' + '_index' + '=' + `${results.nextIndex}` + '&' +'_count' + '=' +`${q._count}`;
      }
      else{
        results.previous= requestUrl(req).split('?',1) + '?' + '_index' + '=' + `${results.previousIndex}` + '&' +'_count' + '=' +`${q._count}`;
        results.next= requestUrl(req).split('?',1) + '?' + '_index' + '=' + `${results.nextIndex}` + '&' +'_count' + '=' +`${q._count}`;
      }
      res.json(results);
    }
    catch(err){
      const mapped=mapError(err);
      const new_obj=Object.assign({}, mapped);
      delete new_obj.status;
      const new_obj1={errors:[new_obj]};
      res.status(mapped.status).json(new_obj1);
    }
  });
}

function doList1(app){
  return errorWrap(async function(req,res){
    const q=req.query||{};
    try{
      const results=await app.locals.model.findSensors(q);
      let n=results.nextIndex;
      let p=results.previousIndex;
      for(let i=0; i<results.data.length;i++){
        results.data[i].self=requestUrl(req);
      }
      results.self=requestUrl(req);
      if(q.model && q._count){
      if(results.previousIndex===0 || results.previousIndex===-1 || results.nextIndex==-1 || results.nextIndex==0){
        results.next= requestUrl(req).split('?',1) + '?' + 'model' + '=' + `${q.model}` + '&' +'_count' + '=' +`${q._count}` + '&' + '_index' + '=' + `${results.nextIndex}`;
      }
      else{
        results.previous= requestUrl(req).split('?',1) + '?' + 'model' + '=' + `${q.model}` + '&' +'_count' + '=' +`${q._count}` + '&' + '_index' + '=' + `${results.previousIndex}`;
        results.next= requestUrl(req).split('?',1) + '?' + 'model' + '=' + `${q.model}` + '&' +'_count' + '=' +`${q._count}` + '&' + '_index' + '=' + `${results.nextIndex}`;
      }
    }

    else if(q._count && q._doDetail){
      if(results.previousIndex===0 || results.previousIndex===-1 || results.nextIndex==-1 || results.nextIndex==0){
        results.next= requestUrl(req).split('?',1) + '?' + '_count' + '=' +`${q._count}` + '&' + '_doDetail' + '=' + `${q._doDetail}` + '&' + '_index' + '=' + `${results.nextIndex}`;
      }
      else{
        results.previous= requestUrl(req).split('?') + '?' + '_count' + '=' +`${q._count}` + '&' + '_doDetail' + '=' + `${q._doDetail}` + '&' + '_index' + '=' + `${results.previousIndex}`;
        results.next= requestUrl(req).split('?',1) + '?' + '_count' + '=' +`${q._count}` + '&' + '_doDetail' + '=' + `${q._doDetail}` + '&' + '_index' + '=' + `${results.nextIndex}`;
      }
    }
    else{
      if(results.previousIndex===0 || results.previousIndex===-1 || results.nextIndex==-1 || results.nextIndex==0){
        results.next= requestUrl(req).split('?',1) + '?' + '_index' + '=' + `${results.nextIndex}` + '&' + '_count' + '=' +`${q._count}`;
      }
      else{
        results.previous= requestUrl(req).split('?',1) + '?' + '_index' + '=' + `${results.previousIndex}` + '&' + '_count' + '=' +`${q._count}`;
        results.next= requestUrl(req).split('?',1) + '?' + '_index' + '=' + `${results.nextIndex}` + '&' + '_count' + '=' +`${q._count}`;
      }
    }
      res.json(results);
    }
    catch(err){
      const mapped=mapError(err);
      const new_obj=Object.assign({}, mapped);
      delete new_obj.status;
      const new_obj1={errors:[new_obj]};
      res.status(mapped.status).json(new_obj1);
    }
  });
}


function doList2(app){
  return errorWrap(async function(req,res){
    const q=req.query||{};
    const id = req.params.sensorId;
    q.sensorId = req.params.sensorId;
    try{
      const results=await app.locals.model.findSensorData(q);
      for(let i=0; i<results.data.length;i++){
        results.data[i].self=requestUrl(req);
      }
      results.self=requestUrl(req);
      if(results.previousIndex===0 || results.previousIndex===-1){
        results.next=requestUrl1(req);
      }
      else{
        results.previous=requestUrl2(req);
        results.next=requestUrl1(req);
      }
      res.json(results);
    }
    catch(err){
      const mapped=mapError(err);
      const new_obj=Object.assign({}, mapped);
      delete new_obj.status;
      const new_obj1={errors:[new_obj]};
      res.status(mapped.status).json(new_obj1);
    }
  });
}


function doGet(app){
  return errorWrap(async function(req,res){
    try{
      const id = req.params.id;
      const results=await app.locals.model.findSensorTypes({id : id});
      if(results.data.length===0){
        throw{
          errors :true,
          code:'NOT_FOUND',
          message: `user ${id} not found`,
        };
      }
      else{
        for(let i=0; i<results.data.length;i++){
          results.data[i].self=requestUrl(req);
        }  
        results.self=requestUrl(req);
        res.json(results);
      }
    }
    catch(err){
      const mapped=mapError(err);
      const new_obj=Object.assign({}, mapped);
      delete new_obj.status;
      const new_obj1={errors:[new_obj]};
      res.status(mapped.status).json(new_obj1);
    }
  });
}


function doGet1(app){
  return errorWrap(async function(req,res){
    try{
      const id = req.params.id;
      const results=await app.locals.model.findSensors({id : id});
      if(results.data.length===0){
        throw{
          errors :true,
          code:'NOT_FOUND',
          message: `user ${id} not found`,
        };
      }
      else{
        for(let i=0; i<results.data.length;i++){
          results.data[i].self=requestUrl(req);
        }  
        results.self=requestUrl(req);
        res.json(results);
      }
    }
    catch(err){
      const mapped=mapError(err);
      const new_obj=Object.assign({}, mapped);
      delete new_obj.status;
      const new_obj1={errors:[new_obj]};
      res.status(mapped.status).json(new_obj1);
    }
  });
}

function doGet2(app){
  return errorWrap(async function(req,res){
    try{
      const id = req.params.id;
      const time = req.params.timestamp;
      const results = await app.locals.model.findSensorData({sensorId : id, timestamp: time, statuses: 'all'});
      const res1=results.data.filter(elem => elem.timestamp === Number(time));
      res1.time;
      if(res1.length===0){
        throw{
          errors: true,
          code:'NOT_FOUND',
          message: `no data for timestamp ${time}`,
          };
      }
      else{
        for(let i=0; i<results.data.length;i++){
          results.data[i].self=requestUrl(req);
        }  
        results.self=requestUrl(req);
        res.json(res1);
      } 
    }
    catch(err){
      const mapped=mapError(err);
      const new_obj=Object.assign({}, mapped);
      delete new_obj.status;
      const new_obj1={errors:[new_obj]};
      res.status(mapped.status).json(new_obj1);
    }
  });
}

function doCreate(app){
  return errorWrap(async function(req,res){
    try{
      const obj=req.body;
      const results=await app.locals.model.addSensorType(obj);
      res.append('Location', requestUrl(req) + '/' + obj.id);
      res.sendStatus(CREATED);
    }
    catch(err){
      const mapped=mapError(err);
      res.status(mapped.status).json(mapped);
    }
  });
}

function doCreate1(app){
  return errorWrap(async function(req,res){
    try{
      const obj=req.body;
      const results=await app.locals.model.addSensor(obj);
      res.append('Location', requestUrl(req) + '/' + obj.id);
      res.sendStatus(CREATED);
    }
    catch(err){
      const mapped=mapError(err);
      res.status(mapped.status).json(mapped);
    }
  });
}

function doCreate2(app){
  return errorWrap(async function(req,res){
    try{
      const obj=req.body;
      obj.sensorId=req.params.sensorId;
      const results=await app.locals.model.addSensorData(obj);
      res.append('Location', requestUrl(req) + '/' + obj.sensorId + '/' + obj.timestamp);
      res.sendStatus(CREATED);
    }
    catch(err){
      const mapped=mapError(err);
      res.status(mapped.status).json(mapped);
    }
  });
}

function errorWrap(handler){
  return async(req,res,next) => {
    try{
      await handler(req,res,next);
    }
    catch(err){
      next(err);
    }
  };
}


const ERROR_MAP = {
  EXISTS: CONFLICT,
  NOT_FOUND : NOT_FOUND
}

function mapError(err){
  console.error(err);
  return err.errors
   ?{ status: (ERROR_MAP[err.code] || BAD_REQUEST),
    code:err.code,
    message:err.message
   }
  : { 
     status: NOT_FOUND,
     code: 'NOT_FOUND',
     message: err.toString()
  };
}

function requestUrl(req){
  const port=req.app.locals.port;
  return `${req.protocol}: //${req.hostname}:${port}${req.originalUrl}`;
}

/*
function requestUrl1(q,n){
  let a = 'http://localhost:2345/sensor-types?';
  for(let [key, value] of Object.entries(q)){
    a += (`${key}=${value}`);
  }
    console.log(n);
    a['_index']=n;
  
  return a;
}

function requestUrl2(q,p){
  let a = 'http://localhost:2345/sensor-types?';
  for(let [key, value] of Object.entries(q)){
    a += (`${key}=${value}`);
  }
  a['_index']=p;
  return a;
}

function requestUrl3(q,n){
  let a = 'http://localhost:2345/sensors?';
  for(let [key, value] of Object.entries(q)){
    a += (`${key}=${value}`);
  }
  a['_index']=n;
  return a;
}

function requestUrl4(q,p){
  let a = 'http://localhost:2345/sensors?';
  for(let [key, value] of Object.entries(q)){
    a += (`${key}=${value}`);
  }
  a['_index']=p;
  return a;
}*/