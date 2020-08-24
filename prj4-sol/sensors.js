'use strict';

const assert = require('assert');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const querystring = require('querystring');

const Mustache = require('mustache');
const widgetView = require('./widget-view');

const STATIC_DIR = 'statics';
const TEMPLATES_DIR = 'templates';

function serve(port, model, base='') {
  //@TODO
  const app=express();
  app.locals.port=port;
  app.locals.base=base;
  app.locals.model=model;
  process.chdir(__dirname);
  app.use(base,express.static(STATIC_DIR));
  setupTemplates(app);
  setupRoutes(app);
  app.listen(port,function(){
    console.log(`listening on port ${port}`);
  });

}

module.exports = serve;
// const scrollOpts = {
//   next: nextBatch,
//   previous: previousBatch,
//   itemSelf: itemSelf(['id']),
// };

//const idOpts = { itemSelf: itemSelf(), };
//@TODO
function setupRoutes(app){
  const base=app.locals.base;

  app.get(`/tst-sensor-types-add.html`, createSensorType(app));
  app.get(`/tst-sensor-types-search.html`, doSensorTypeSearch(app));
  app.post(`/tst-sensor-types-add.html`, bodyParser.urlencoded({extended: false}), createNewSensorType(app));
  app.get(`/tst-sensors-search.html`, doSensorsSearch(app));
  app.get(`/tst-sensors-add.html`, createSensors(app));
  app.post(`/tst-sensors-add.html`, bodyParser.urlencoded({extended: false}), createNewSensor(app));
}

const FIELDS_INFO = {
  id: {
    friendlyName: 'Sensor Type ID',
    isSearch:true,
    isSearch1: true,
    isRequired: true,
    regex: /[a-zA-z0-9\_\-]+/,
    error: 'Search Id field can only contain alphanumerics or - or _ characters',
  },
  modelNumber:{
    friendlyName:'Model Number',
    isSearch:true,
    isRequired:true,
    isSearch1:true,
    regex: /[a-zA-Z'\s\\-]+/,
    error: "Model Number field can only contain -,',space or alphabetics",
  },
  manufacturer:{
    friendlyName: 'Manufacturer',
    isSearch:true,
    isSearch1:true,
    isRequired:true,
    regex: /[a-zA-Z'\s\\-]+/,
    error: "Manufacturer can only contain -,',space or alphabetic characters",
  },
  quantity:{
    friendlyName: 'Quantity',
    isSearch:true,
    isSearch1:true,
    isRequired:false,
    isSelect:true,
    //regex: /^\w+$/,
    regex: /^(temperature|pressure|flow|humidity)$/,
    error: "Can only have internal values Temperatures, Pressure, Flow or Humidity",
  },
  minimumLimit:{
    friendlyName: 'Minimum Limit',
    isSearch1:true,
    isRequired: true,
    regex:/^-?[0-9]\d*(\.\d+)?$/,
    error: 'Minimum Limit field can only contain numbers',
  },
  maximumLimit:{
    friendlyName: 'Maximum Limit',
    isSearch1:true,
    isRequired: true,
    regex:/^-?[0-9]\d*(\.\d+)?$/,
    error: 'Maximum Limit field can only contain numbers',
  },
  sensorID: {
    friendlyName: 'Sensor ID',
    isSensors:true,
    isSensors1: true,
    isRequired1: true,
    regex: /[a-zA-z0-9_\\-]+/,
    error: 'Search Id field can only contain alphanumerics or _',
  },
  model:{
    friendlyName:'Model',
    isSensors:true,
    isRequired1:true,
    isSensors1:true,
    regex: /[a-zA-Z'\s\\-]+/,
    error: 'Model field can only contain alphanumerics or _',
  },
  period:{
    friendlyName: 'Period',
    isSensors:true,
    isRequired1: true,
    isSensors1:true,
    regex: /^[0-9]*$/,
    error: 'Period field can only be an integer',
  },

  minimumRange:{
    friendlyName: 'Minimum Range',
    isSensors1:true,
    isRequired1: true,
    regex: /^-?[0-9]\d*(\.\d+)?$/,
    error: 'Minimum Range field can only contain numbers',
  },
  maximumRange:{
    friendlyName: 'Maximum Range',
    isSensors1:true,
    isRequired1: true,
    regex: /^-?[0-9]\d*(\.\d+)?$/,
    error: 'Maximum Range field can only contain numbers',
  },
  _index: '5',
};

const FIELDS =
  Object.keys(FIELDS_INFO).map((n) => Object.assign({name: n}, FIELDS_INFO[n]));

  
/*************************** Action Routines ***************************/


/************************** Sensor Types****************************/

function createSensorType(app){
  return async function(req, res) {
    const model = { base: app.locals.base, fields: FIELDS };
    const html = doMustache(app, 'sensorTypeCreate', model);
    res.send(html);
  };
};

function createNewSensorType(app){
  return async function(req, res) {
    const user = getNonEmptyValues(req.body);
    let errors = validate(user, ['id','modelNumber','manufacturer','quantity','minimumLimit','maximumLimit']);
    if(user.quantity==='flow'){
      user.unit='gpm';
    }
    else if(user.quantity==='humidity'){
      user.unit='%';
    }
    else if(user.quantity==='pressure'){
      user.unit='PSI';
    }
    else if(user.quantity==='temperature'){
      user.unit='C';
    }
    

    const min=user.minimumLimit;
    const max=user.maximumLimit;
    user.limits={min,max};

    if (!errors) {
      try {
	  await app.locals.model.update('sensor-types',user);
	  res.redirect(`${app.locals.base}/tst-sensor-types-search.html`);
      }
      catch (err) {
	      console.error(err);
	      errors = wsErrors(err);
      }
    }
    
      if(errors){
      const model = errorModel(app, user, errors);
      const html = doMustache(app,'sensorTypeCreate', model);
      res.send(html);
    }
   
    
  };
};

function doSensorTypeSearch(app) {
  return async function(req, res) {
    const isSubmit = req.query.submit !== undefined;
    let users = [];
    let errors = undefined;
    const search = getNonEmptyValues(req.query);
      errors = validate(search);
      if (Object.keys(search).length == 0) {
	const msg = 'at least one search parameter must be specified';
	errors = Object.assign(errors || {}, { _: msg });
      }
  const q = querystring.stringify(search);
  
	try {
      users = await app.locals.model.list('sensor-types',search);
    for(let i=0;i<users.data.length;i++){
      users.data[i].minimumLimit=users.data[i].limits.min;
      users.data[i].maximumLimit=users.data[i].limits.max;
    }
  }

	catch (err) {
          console.error(err);
	  errors = wsErrors(err);
  }
  let model1;
	if (users.length === 0) {
	  errors = {_: 'no users found for specified criteria; please retry'};
  }

  if(errors){
    model1 = {base: app.locals.base,fields: FIELDS, err:errors};
    const html = doMustache(app, 'sensorTypeSearch', model1);
    res.send(html);
  }
 else{
    let model, template;
    let next1 = "";
    let prev1="";
     const fields1 =
       users.data.map((u) => ({id: u.id, fields: fieldsWithValues(u)}));
       if(users.next){
         next1=users.next.substring(43);
       }
       if(users.prev){
       prev1=users.prev.substring(43);
      }
     model = { base: app.locals.base, users: fields1,fields: FIELDS, prev: prev1, next: next1};
     const html = doMustache(app, 'sensorTypeSearch', model);
     res.send(html);
 }
   
    
  };
};

/************************** Sensors ****************************/

function createSensors(app){
  return async function(req, res) {
    const model = { base: app.locals.base, fields: FIELDS };
    const html = doMustache(app, 'sensorsCreate', model);
    res.send(html);
  };
};

function createNewSensor(app){
  return async function(req, res) {
    const user = getNonEmptyValues(req.body);
    let errors = validate(user, ['sensorID','model','period','minimumRange','maximumRange']);
    user.id=user.sensorID;
    delete user.sensorID;
    const min=user.minimumRange;
    const max=user.maximumRange;

    delete user.minimumRange;
    delete user.maximumRange;

    user.expected={min,max};
    if (!errors) {
      try {
    await app.locals.model.update('sensors',user);
	  res.redirect(`${app.locals.base}/tst-sensors-search.html`);
      }
      catch (err) {
	      console.error(err);
	      errors = wsErrors(err);
      }
    }
    if (errors) {
      const model = errorModel(app, user, errors);
      const html = doMustache(app,'sensorsCreate', model);
      res.send(html);
    }
  };
};


function doSensorsSearch(app) {
  return async function(req, res) {
    const isSubmit = req.query.submit !== undefined;
    let users = [];
    let errors = undefined;
    const search = getNonEmptyValues(req.query);
      errors = validate(search);
      if (Object.keys(search).length == 0) {
	const msg = 'at least one search parameter must be specified';
	errors = Object.assign(errors || {}, { _: msg });
      }
  const q = querystring.stringify(search);
  search.id=search.sensorID;
  delete search.sensorID;
	try {
      users = await app.locals.model.list('sensors',search);
      for(let i=0;i<users.data.length;i++){
        delete users.data[i].minimum;
        delete users.data[i].maximum;
        users.data[i].minimumRange=users.data[i].expected.min;
        users.data[i].maximumRange=users.data[i].expected.max;
      }
	}
	catch (err) {
          console.error(err);
	  errors = wsErrors(err);
	}
	if (users.length === 0) {
	  errors = {_: 'no users found for specified criteria; please retry'};
  }
    let model, template;
    let next1 = "";
    let prev1="";
      const fields1 =
        users.data.map((u) => ({id: u.id, fields: fieldsWithValues(u)}));
        if(users.next){
          next1=users.next.substring(38);
        }
        if(users.prev){
        prev1=users.prev.substring(38);
       }

    model = { base: app.locals.base, users:fields1, fields: FIELDS, prev:prev1, next:next1};
    const html = doMustache(app, 'sensorsSearch', model);
    res.send(html);
  };
};

/************************** Field Utilities ****************************/

/** Return copy of FIELDS with values and errors injected into it. */
function fieldsWithValues(values, errors={}) {
  return FIELDS.map(function (info) {
    const name = info.name;
    const extraInfo = { value: values[name] };
    if(extraInfo.value===0){
      extraInfo.value='0';
    }
    if (errors[name]) extraInfo.errorMessage = errors[name];
    return Object.assign(extraInfo, info);
    //console.log(info);
  });
}

/** Given map of field values and requires containing list of required
 *  fields, validate values.  Return errors hash or falsy if no errors.
 */
function validate(values, requires=[]) {
  const errors = {};
  requires.forEach(function (name) {
    //console.log(name);
    if (values[name] === undefined) {
      errors[name] =
	`A value for '${FIELDS_INFO[name].friendlyName}' must be provided`;
    }
    
  });
  for (const name of Object.keys(values)) {
    const fieldInfo = FIELDS_INFO[name];
    const value = values[name];
    if (fieldInfo.regex && !value.match(fieldInfo.regex)) {
      errors[name] = fieldInfo.error;
    }
  }
  return Object.keys(errors).length > 0 && errors;
}


function getNonEmptyValues(values) {
  const out = {};
  Object.keys(values).forEach(function(k) {
    if (FIELDS_INFO[k] !== undefined) {
      const v = values[k];
      if (v && v.trim().length > 0) out[k] = v.trim();
    }
  });
  return out;
}

/** Return a model suitable for mixing into a template */
function errorModel(app, values={}, errors={}) {
  return {
    base: app.locals.base,
    errors: errors._,
    fields: fieldsWithValues(values, errors)
  };
}

/************************ General Utilities ****************************/

/** Decode an error thrown by web services into an errors hash
 *  with a _ key.
 */
function wsErrors(err) {
  const msg = (err.message) ? err.message : 'web service error';
  console.error(msg);
  return { _: [ msg ] };
}

function doMustache(app, templateId, view) {
  const templates = { footer: app.templates.footer };
  return Mustache.render(app.templates[templateId], view, templates);
}

function errorPage(app, errors, res) {
  if (!Array.isArray(errors)) errors = [ errors ];
  const html = doMustache(app, 'errors', { errors: errors });
  res.send(html);
}

function isNonEmpty(v) {
  return (v !== undefined) && v.trim().length > 0;
}

function setupTemplates(app) {
  app.templates = {};
  for (let fname of fs.readdirSync(TEMPLATES_DIR)) {
    const m = fname.match(/^([\w\-]+)\.ms$/);
    if (!m) continue;
    try {
      app.templates[m[1]] =
	String(fs.readFileSync(`${TEMPLATES_DIR}/${fname}`));
    }
    catch (e) {
      console.error(`cannot read ${fname}: ${e}`);
      process.exit(1);
    }
  }
}
