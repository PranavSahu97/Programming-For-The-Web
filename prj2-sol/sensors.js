'use strict';

const AppError = require('./app-error');
const validate = require('./validate');

const assert = require('assert');
const mongo = require('mongodb').MongoClient;

class Sensors {

  constructor(client,db){
    this.client=client;
    this.db=db;
    
  }
  /** Return a new instance of this class with database as
   *  per mongoDbUrl.  Note that mongoDbUrl is expected to
   *  be of the form mongodb://HOST:PORT/DB.
   */
  static async newSensors(mongoDbUrl) {
    //@TODO
   function testVal(mongoDbUrl){
     let urlRegex =new RegExp(
      "^(mongodb)\://[a-z\.]+\.[a-zA-Z]{2,3}(:[0-9]*)?/?([a-zA-Z0-9\-\._\?\,\'/\\\+&amp;%\$#\=~])*$"
    );
    if(urlRegex.test(mongoDbUrl)){
        return true;
      }
      else{
        return false;
      }
       
   }   
   
   if(testVal(mongoDbUrl)===true){
    const dbIndex=mongoDbUrl.lastIndexOf('/');
    const url=mongoDbUrl.slice(0,dbIndex);
    let db=mongoDbUrl.slice(dbIndex+1);
    let client=await mongo.connect(url, MONGO_OPTIONS);
    db=client.db(db);
    return new Sensors( client, db); 
   }
    else{
      throw new Error('Invalid URL');
    }   
    
  }
  /** Release all resources held by this Sensors instance.
   *  Specifically, close any database connections.
   */
  async close() {
    //@TODO
    await this.client.close();
  }

  /** Clear database */
  async clear() {
    //@TODO
    this.db.collection("sensorType").drop();
    this.db.collection("sensor").drop();
    this.db.collection("sensorData").drop();
  }

  /** Subject to field validation as per validate('addSensorType',
   *  info), add sensor-type specified by info to this.  Replace any
   *  earlier information for a sensor-type with the same id.
   *
   *  All user errors must be thrown as an array of AppError's.
   */
  async addSensorType(info) {
    const sensorType = validate('addSensorType', info);
    //@TODO
    let sen = await this.db.collection("sensorType").insertOne(info);
    let ret = await this.db.collection("sensorType").find().toArray();
  }
  
  /** Subject to field validation as per validate('addSensor', info)
   *  add sensor specified by info to this.  Note that info.model must
   *  specify the id of an existing sensor-type.  Replace any earlier
   *  information for a sensor with the same id.
   *
   *  All user errors must be thrown as an array of AppError's.
   */
  async addSensor(info) {
    const sensor = validate('addSensor', info);
    //@TODO
    let doc1=await this.db.collection("sensorType").findOne({id:sensor.model});
    if(doc1){
    let sen1 = await this.db.collection("sensor").insertOne(info);
    let ret = await this.db.collection("sensor").find().toArray();
    }
    else{
     const err ='no model ${sensor} sensor id';
     throw [new AppError('X_ID',err)];
    }
    
  }

  /** Subject to field validation as per validate('addSensorData',
   *  info), add reading given by info for sensor specified by
   *  info.sensorId to this. Note that info.sensorId must specify the
   *  id of an existing sensor.  Replace any earlier reading having
   *  the same timestamp for the same sensor.
   *
   *  All user errors must be thrown as an array of AppError's.
   */
  async addSensorData(info) {
    const sensorData = validate('addSensorData', info);
    //@TODO
    let doc2= await this.db.collection("sensor").findOne({id:sensorData.sensorId});
    if(doc2){
    let sen2 = await this.db.collection("sensorData").insertOne(info);
    let ret = await this.db.collection("sensorData").find().toArray();
    }
    else{
      const err ='no model ${sensorData} sensor id';
     throw [new AppError('X_ID',err)];
    }
  }

  /** Subject to validation of search-parameters in info as per
   *  validate('findSensorTypes', info), return all sensor-types which
   *  satisfy search specifications in info.  Note that the
   *  search-specs can filter the results by any of the primitive
   *  properties of sensor types (except for meta-properties starting
   *  with '_').
   *
   *  The returned value should be an object containing a data
   *  property which is a list of sensor-types previously added using
   *  addSensorType().  The list should be sorted in ascending order
   *  by id.
   *
   *  The returned object will contain a lastIndex property.  If its
   *  value is non-negative, then that value can be specified as the
   *  _index meta-property for the next search.  Note that the _index
   *  (when set to the lastIndex) and _count search-spec
   *  meta-parameters can be used in successive calls to allow
   *  scrolling through the collection of all sensor-types which meet
   *  some filter criteria.
   *
   *  All user errors must be thrown as an array of AppError's.
   */
  async findSensorTypes(info) {
    //@TODO
    const searchSpecs = validate('findSensorTypes', info);
    let a=searchSpecs._index;
    let b=searchSpecs._count;   

    let search=searchSpecs;
    let nextIndex=-1;
    if(searchSpecs._index!==0 && searchSpecs._count!==5){
      
    nextIndex=searchSpecs._index;
     nextIndex += searchSpecs._count;
      }
    
    
    for(let i in search){
       if(i==="_index" || i==="_count"){
         delete search[i];
       }
       else if(search[i]===null || search[i]===undefined){
         delete search[i];
       }
      }
    
    let doc=await this.db.collection("sensorType").find(search).skip(a).limit(b).sort({"id":1}).toArray();
    for(let i = 0; i < doc.length; i++){
      delete doc[i]['_id'];
    }

    return { data: [doc], nextIndex };
    
}
  
  /** Subject to validation of search-parameters in info as per
   *  validate('findSensors', info), return all sensors which satisfy
   *  search specifications in info.  Note that the search-specs can
   *  filter the results by any of the primitive properties of a
   *  sensor (except for meta-properties starting with '_').
   *
   *  The returned value should be an object containing a data
   *  property which is a list of all sensors satisfying the
   *  search-spec which were previously added using addSensor().  The
   *  list should be sorted in ascending order by id.
   *
   *  If info specifies a truthy value for a _doDetail meta-property,
   *  then each sensor S returned within the data array will have an
   *  additional S.sensorType property giving the complete sensor-type
   *  for that sensor S.
   *
   *  The returned object will contain a lastIndex property.  If its
   *  value is non-negative, then that value can be specified as the
   *  _index meta-property for the next search.  Note that the _index (when 
   *  set to the lastIndex) and _count search-spec meta-parameters can be used
   *  in successive calls to allow scrolling through the collection of
   *  all sensors which meet some filter criteria.
   *
   *  All user errors must be thrown as an array of AppError's.
   */
  async findSensors(info) {
    //@TODO
    const searchSpecs = validate('findSensors', info);
    let a=searchSpecs._index;
    let b=searchSpecs._count;   

    let search=searchSpecs;
    let nextIndex=-1;
    if(searchSpecs._index!==0 && searchSpecs._count!==5){
      
      nextIndex=searchSpecs._index;
       nextIndex += searchSpecs._count;
    }
    
    for(let i in search){
       if(i==="_index" || i==="_count"){
         delete search[i];
       }
       else if(search[i]===null || search[i]===undefined){
         delete search[i];
       }
      }
      console.log(searchSpecs);
    
    let doc1=await this.db.collection("sensor").find(search).skip(a).limit(b).sort({"id":1}).toArray();
    for(let i = 0; i < doc1.length; i++){
      delete doc1[i]['_id'];
    }
    return { data: [doc1], nextIndex};
  }
  
  /** Subject to validation of search-parameters in info as per
   *  validate('findSensorData', info), return all sensor readings
   *  which satisfy search specifications in info.  Note that info
   *  must specify a sensorId property giving the id of a previously
   *  added sensor whose readings are desired.  The search-specs can
   *  filter the results by specifying one or more statuses (separated
   *  by |).
   *
   *  The returned value should be an object containing a data
   *  property which is a list of objects giving readings for the
   *  sensor satisfying the search-specs.  Each object within data
   *  should contain the following properties:
   * 
   *     timestamp: an integer giving the timestamp of the reading.
   *     value: a number giving the value of the reading.
   *     status: one of "ok", "error" or "outOfRange".
   *
   *  The data objects should be sorted in reverse chronological
   *  order by timestamp (latest reading first).
   *
   *  If the search-specs specify a timestamp property with value T,
   *  then the first returned reading should be the latest one having
   *  timestamp <= T.
   * 
   *  If info specifies a truthy value for a doDetail property, 
   *  then the returned object will have additional 
   *  an additional sensorType giving the sensor-type information
   *  for the sensor and a sensor property giving the sensor
   *  information for the sensor.
   *
   *  Note that the timestamp search-spec parameter and _count
   *  search-spec meta-parameters can be used in successive calls to
   *  allow scrolling through the collection of all readings for the
   *  specified sensor.
   *
   *  All user errors must be thrown as an array of AppError's.
   */
  async findSensorData(info) {
    //@TODO
    const searchSpecs = validate('findSensorData', info);
    let a=searchSpecs.timestamp;
    let b=searchSpecs._count;
    let c=searchSpecs.statuses;
    let d=searchSpecs._doDetail;
    let search=searchSpecs;
    let ret1;
    let ret2;
    
    
    for(let i in search){
       if(i==="_count" || i==="statuses" || i==="timestamp" || i==="_doDetail"){
         delete search[i];
       }
       else if(search[i]===null || search[i]===undefined){
         delete search[i];
       }
      }
     
    let s1=await this.db.collection("sensorType").find().toArray();
    let s2=await this.db.collection("sensor").find().toArray();
    let doc2=await this.db.collection("sensorData").find(search).sort({"timestamp":-1}).toArray();
    doc2=await calcStatus(doc2,s1,s2);

    doc2=doc2.filter(elem => elem.timestamp <= a);
    doc2=doc2.filter(elem1=>c.has(elem1.status));

    if(d){ 
    let s2=await this.db.collection("sensor").find().toArray();
    let s1=await this.db.collection("sensorType").find().toArray();
    for(let j of s2){
      if(j.id===doc2[0].sensorId){
          ret1=j;
        }
    }
   for(let j of s1){
      if(j.id===ret1.model){
         ret2=j;
        }
      }

    delete ret2['_id'];
    delete ret1['_id'];
}

    for(let i=0;i<doc2.length;i++){
      delete doc2[i]['_id'];
      delete doc2[i]['sensorId'];
    }
    
   
    let data = [];                                            
    for(let i=0;i<b;i++){
      data.push(doc2[i]);
    }

    return { data , sensorType:[ret2], sensor:[ret1]};
  
  }
    
} //class Sensors

function calcStatus(sensorD, sensorT, sensoR){
  let e1;
  let m1;
  let l1;

  for(let i of sensorD){
    for(let j=0;j<sensoR.length;j++){
      if(i.sensorId === sensoR[j].id){
        e1=sensoR[j].expected;
        m1=sensoR[j].model;
      }
    }
    for(let j=0;j<sensorT.length;j++){
      if(m1===sensorT[j].id){
        l1=sensorT[j].limits;
      }
    }

    if(parseFloat(i.value)>=parseFloat(e1.min) && parseFloat(i.value)<=parseFloat(e1.max)){
      i.status='ok';
    }
    else if((parseFloat(i.value)>parseFloat(e1.max) && parseFloat(i.value) <= parseFloat(l1.max)) || (parseFloat(i.value) <parseFloat(e1.min) && parseFloat(i.value) >=parseFloat(l1.min))){
      i.status='outOfRange';
    }
    else{
      i.status='error';
    }
  }
  return sensorD;
}


module.exports = Sensors.newSensors;

//Options for creating a mongo client
const MONGO_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};


function inRange(value, range) {
  return Number(range.min) <= value && value <= Number(range.max);
}
