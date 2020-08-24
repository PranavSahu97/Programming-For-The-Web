'use strict';

const assert = require('assert');

class Sensors {

  constructor(info) {
    //@TODO
    this.info=info;
    this.sensorType=[];
    this.sensor=[];
    this.sensorData=[];
    this.nextIndex=0;
    this.nextIndex1=0;
  }

  /** Clear out all data from this object. */
  async clear() {
    //@TODO
    this.sensorType.length=0;
    this.sensor.length=0;
    this.sensorData.length=0;
    this.nextIndex=0;
    this.nextIndex1=0;
  }

  /** Subject to field validation as per FN_INFOS.addSensorType,
   *  add sensor-type specified by info to this.  Replace any
   *  earlier information for a sensor-type with the same id.
   *
   *  All user errors must be thrown as an array of objects.
   */
  async addSensorType(info) {
    const sensorType = validate('addSensorType', info);
      this.sensorType.push(info);

    //@TODO
  }
  
  
  /** Subject to field validation as per FN_INFOS.addSensor, add
   *  sensor specified by info to this.  Replace any earlier
   *  information for a sensor with the same id.
   *
   *  All user errors must be thrown as an array of objects.
   */
  async addSensor(info) {
    const sensor = validate('addSensor', info);
    let storeInfo1={};
    this.flag=false;
    for(let i=0;i<this.sensorType.length;i++){
      if(this.sensorType[i].id===info.model){
        this.flag=true;
       this.sensor.push(info);
    //@TODO
    } 
  }
  if(this.flag==false){
    throw['Invalid incoming sensor id'];
  }
  }

  /** Subject to field validation as per FN_INFOS.addSensorData, add
   *  reading given by info for sensor specified by info.sensorId to
   *  this. Replace any earlier reading having the same timestamp for
   *  the same sensor.
   *
   *  All user errors must be thrown as an array of objects.
   */
  async addSensorData(info) {
    
    const sensorData = validate('addSensorData', info);
    let storeInfo2={};
    this.flag1=false;
    for(let j=0;j<this.sensor.length;j++){
      if(this.sensor[j].id ===info.sensorId){
        this.flag1=true;
        this.sensorData.push(info);
    }
      
    }
  if(this.flag1==false){
    throw['Invalid sensor id'];
  }
  
    //@TODO

  }

  /** Subject to validation of search-parameters in info as per
   *  FN_INFOS.findSensorTypes, return all sensor-types which
   *  satisfy search specifications in info.  Note that the
   *  search-specs can filter the results by any of the primitive
   *  properties of sensor types.  
   *
   *  The returned value should be an object containing a data
   *  property which is a list of sensor-types previously added using
   *  addSensorType().  The list should be sorted in ascending order
   *  by id.
   *
   *  The returned object will contain a lastIndex property.  If its
   *  value is non-negative, then that value can be specified as the
   *  index property for the next search.  Note that the index (when 
   *  set to the lastIndex) and count search-spec parameters can be used
   *  in successive calls to allow scrolling through the collection of
   *  all sensor-types which meet some filter criteria.
   *
   *
   *  All user errors must be thrown as an array of objects.
   */
  async findSensorTypes(info) {
    const searchSpecs = validate('findSensorTypes', info);
    //@TODO
   
    let searchId=[];
    this.sensorType.sort((a,b)=>(a.id>b.id)?1:-1);
    let count=0;
    let nextInd=this.nextIndex;
    let defaultCount=DEFAULT_COUNT;
      if(info.id || info.manufacturer || info.modelNumber || info.quantity || info.unit){
        for(let i=nextInd;i<this.sensorType.length;i++){
          if(this.sensorType[i].id===info.id || this.sensorType[i].quantity===info.quantity){
            searchId.push(this.sensorType[i]);
            nextInd=-1;
        }
        
      }
      this.nextIndex=nextInd;
    }
    else if(info.index && info.count){
        count=info.index;
        defaultCount=info.count;
        nextInd=+count + +defaultCount;
        for(let i=count;i<nextInd;i++){
          searchId.push(this.sensorType[i]);
        }
        this.nextIndex=nextInd;
    }
    else{
   
      for(let i=this.nextIndex;i<this.sensorType.length;i++){
        if(defaultCount>0){
        searchId.push(this.sensorType[i]);
        nextInd++;
        defaultCount--;
        }
        else{
          break;
        }
      }
      this.nextIndex=nextInd;
    }
   
    
    return{nextIndex:this.nextIndex,data:searchId};
}
  
  /** Subject to validation of search-parameters in info as per
   *  FN_INFOS.findSensors, return all sensors which
   *  satisfy search specifications in info.  Note that the
   *  search-specs can filter the results by any of the primitive
   *  properties of a sensor.  
   *
   *  The returned value should be an object containing a data
   *  property which is a list of all sensors satisfying the
   *  search-spec which were previously added using addSensor().  The
   *  list should be sorted in ascending order by id.
   *
   *  If info specifies a truthy value for a doDetail property, 
   *  then each sensor S returned within the data array will have
   *  an additional S.sensorType property giving the complete 
   *  sensor-type for that sensor S.
   *
   *  The returned object will contain a lastIndex property.  If its
   *  value is non-negative, then that value can be specified as the
   *  index property for the next search.  Note that the index (when 
   *  set to the lastIndex) and count search-spec parameters can be used
   *  in successive calls to allow scrolling through the collection of
   *  all sensors which meet some filter criteria.
   *
   *  All user errors must be thrown as an array of objects.
   */
  async findSensors(info) {
    const searchSpecs = validate('findSensors', info);
    //@TODO
    let searchId1=[];
    this.sensor.sort((a,b)=>(a.id>b.id)?1:-1);
    let count1=0;
    let nextInd1=this.nextIndex;
    let defaultCount=DEFAULT_COUNT;
      
    if(info.model && info.count){
        defaultCount=info.count;
        for(let i=this.nextIndex;i<this.sensor.length;i++){
          if(defaultCount>0){
            if(this.sensor[i].model===info.model){
              searchId1.push(this.sensor[i]);
              nextInd1=i;
              
              defaultCount--;
            }
          }
           else{
             break;
            }
          
        }
        this.nextIndex=nextInd1;
      }
    else if(info.model && info.count && info.index){
        count1=info.index;
        defaultCount=info.count;
          nextInd1=+count + +defaultCount;
          for(let i=count;i<nextInd1;i++){
          if(defaultCount>0){
          if(this.sensor[i].model===info.model){
          searchId1.push(this.sensor[i]);
         nextInd1=i;
         
         defaultCount--;
          }
        }
        else{
          break;
        }
      }
      this.nextIndex=nextInd1;
    }
    else{
      for(let i=this.nextIndex;i<this.sensorType.length;i++){
        if(defaultCount>0){
        searchId1.push(this.sensorType[i]);
        nextInd1++;
        defaultCount--;
        }
        else{
          break;
        }
      }
      this.nextIndex=nextInd1;
    }
   
    return {nextIndex:this.nextIndex, data:searchId1};
  }
  
  /** Subject to validation of search-parameters in info as per
   *  FN_INFOS.findSensorData, return all sensor reading which satisfy
   *  search specifications in info.  Note that info must specify a
   *  sensorId property giving the id of a previously added sensor
   *  whose readings are desired.  The search-specs can filter the
   *  results by specifying one or more statuses (separated by |).
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
   *  Note that the timestamp and count search-spec parameters can be
   *  used in successive calls to allow scrolling through the
   *  collection of all readings for the specified sensor.
   *
   *  All user errors must be thrown as an array of objects.
   */
  async findSensorData(info) {
    const searchSpecs = validate('findSensorData', info);
    
    let searchId2=[];
    let defaultCount=DEFAULT_COUNT;
    this.sensorData.sort((a,b)=>(a.timestamp<b.timestamp)?1:-1);
    let expected1;
    let model1;
    let limit1;
    let store;
    let store1;
    let statusS;
    let statusS1;
    let statusS2;
    let tt;

    for(let j=0;j<this.sensorData.length;j++){
      for(let i=0;i<this.sensor.length;i++){
        if(this.sensorData[j].sensorId===this.sensor[i].id){
          expected1 =this.sensor[i].expected;
          model1=this.sensor[i].model;
        }
      }
      
      for(let i=0;i<this.sensorType.length;i++){
        if(model1===this.sensorType[i].id){
          limit1=this.sensorType[i].limits;
        }
      }

      if(parseFloat(expected1.min)<=parseFloat(this.sensorData[j].value) && parseFloat(this.sensorData[j].value)<=parseFloat(expected1.max)){
        this.sensorData[j].status='ok';    
        }
        // else if(parseFloat(this.sensorData[j].value)>parseFloat(expected1.max)){
        //   if(parseFloat(limit1.min)<=parseFloat(this.sensorData[j].value) && parseFloat(this.sensorData[j].value)<=parseFloat(limit1.max)){
        //     this.sensorData[j].status='outOfRange';
        //   }
        // }
        else if((parseFloat(this.sensorData[j].value)>parseFloat(expected1.max) && parseFloat(this.sensorData[j].value)<=parseFloat(limit1.max)) || (parseFloat(this.sensorData[j].value)<parseFloat(expected1.min) && parseFloat(this.sensorData[j].value)>=parseFloat(limit1.min))){
          this.sensorData[j].status='outOfRange';
        }
        else{
          this.sensorData[j].status='error';
        }         
    }
    
      if(info.sensorId && info.count && searchSpecs.statuses && info.timestamp){
        defaultCount=info.count;
        statusS=searchSpecs.statuses.values();
        statusS1=statusS.next().value;
        statusS2=statusS.next().value;
        tt=info.timestamp;

        for(let j=0;j<this.sensorData.length;j++){
          if(defaultCount>0){
          if(info.sensorId===this.sensorData[j].sensorId && statusS1===this.sensorData[j].status && tt>this.sensorData[j].timestamp){
            delete this.sensorData[j].sensorId;
            
            searchId2.push(this.sensorData[j]);
              defaultCount--;
          }
        }
        else{
          break;
        }
        }
      
    }

   else if(info.sensorId && info.count && searchSpecs.statuses && info.timestamp){
      defaultCount=info.count;
      statusS=searchSpecs.statuses.values();
      statusS1=statusS.next().value;
      statusS2=statusS.next().value;
      tt=info.timestamp;
      
      for(let j=0;j<this.sensorData.length;j++){
        if(defaultCount>0){
        if(info.sensorId===this.sensorData[j].sensorId  && tt>this.sensorData[j].timestamp && (statusS1===this.sensorData[j].status || statusS2===this.sensorData[j].status)){
         // delete this.sensorData[j].sensorId;
              
          searchId2.push(this.sensorData[j]);
            defaultCount--;
        }
      }
      else{
        break;
      }
      }
    
  }

  else if(info.sensorId && searchSpecs.statuses && info.count){
    defaultCount=info.count;
    statusS=searchSpecs.statuses.values();
    statusS1=statusS.next().value;
    for(let i=0;i<this.sensorData.length;i++){
      if(defaultCount>0){
        if(info.sensorId===this.sensorData[i].sensorId && statusS1===this.sensorData[i].status){
         // delete this.sensorData[i].sensorId;
            
          searchId2.push(this.sensorData[i]);
          defaultCount--;
        }
      }
      else{
        break;
      }
    }
  }
   
  else if(info.sensorId && info.count && searchSpecs.doDetail){
      defaultCount=info.count;
      for(let i=0;i<this.sensorData.length;i++){
        if(defaultCount>0){
          if(info.sensorId===this.sensorData[i].sensorId){
           // delete this.sensorData[i].sensorId;
            
            searchId2.push(this.sensorData[i]);        
            defaultCount--;
          }
        for(let j=0;j<this.sensor.length;j++){
          if(this.sensorData[i].sensorId===this.sensor[j].id){
           // delete this.sensorData[j].sensorId;
            
            store=this.sensor[j];
          }
        }
        for(let j=0;j<this.sensorType.length;j++){
          if(store.model===this.sensorType[j].id){
           // delete this.sensorData[j].sensorId;
            
            store1=this.sensorType[j];
          }
        }
        
       }
        else{
          break;
        }
      }
    }


    else if(info.sensorId && info.timestamp){
      for(let i=0;i<this.sensorData.length;i++){
        if(this.sensorData[i].sensorId ===info.sensorId && this.sensorData[i].timestamp>info.timestamp){
          //delete this.sensorData[i].sensorId;
            
          searchId2.push(this.sensorData[i]);
        }
      }
    }

   else if(info.sensorId && info.count){
      defaultCount=info.count;
      for(let i=0;i<this.sensorData.length;i++){
        if(defaultCount>0){
          if(this.sensorData[i].sensorId===info.sensorId){
           // delete this.sensorData[i].sensorId;
            
            searchId2.push(this.sensorData[i]);
            defaultCount--;
          }
        }
         else{
           break;
          }
      }
    }

    else if(info.sensorId){
        for(let i=0;i<this.sensorData.length;i++){
          if(defaultCount>0){
          if(info.sensorId===this.sensorData[i].sensorId){
            //delete this.sensorData[i].sensorId;
            
            searchId2.push(this.sensorData[i]);
            defaultCount--;
            }
          }
          else{
            break;
          }
        }
      }
      //console.log(searchId2);
      let newArr1=[];
      for(let i=0;i<searchId2.length;i++){
      const newArr = (({timestamp, value,status}) => ({timestamp, value,status}))(searchId2[i]);
      newArr1.push(newArr);
      }
      //console.log(newArr);
  
    //@TODO
    return {data:newArr1, sensor:store, sensorType:store1};
  }
  
  
}

module.exports = Sensors;

//@TODO add auxiliary functions as necessary

const DEFAULT_COUNT = 5;    

/** Validate info parameters for function fn.  If errors are
 *  encountered, then throw array of error messages.  Otherwise return
 *  an object built from info, with type conversions performed and
 *  default values plugged in.  Note that any unknown properties in
 *  info are passed unchanged into the returned object.
 */
function validate(fn, info) {
  //console.log("Hello");
  //console.log(info);
  const errors = [];
  const values = validateLow(fn, info, errors);
  if (errors.length > 0) throw errors; 
  return values;
}

function validateLow(fn, info, errors, name='') {
  const values = Object.assign({}, info);
  for (const [k, v] of Object.entries(FN_INFOS[fn])) {
    const validator = TYPE_VALIDATORS[v.type] || validateString;
    const xname = name ? `${name}.${k}` : k;
    const value = info[k];
    const isUndef = (
      value === undefined ||
      value === null ||
      String(value).trim() === ''
    );
    values[k] =
      (isUndef)
      ? getDefaultValue(xname, v, errors)
      : validator(xname, value, v, errors);
  }
  return values;
}

function getDefaultValue(name, spec, errors) {
  if (spec.default !== undefined) {
    return spec.default;
  }
  else {
    errors.push(`missing value for ${name}`);
    return;
  }
}

function validateString(name, value, spec, errors) {
  assert(value !== undefined && value !== null && value !== '');
  if (typeof value !== 'string') {
    errors.push(`require type String for ${name} value ${value} ` +
		`instead of type ${typeof value}`);
    return;
  }
  else {
    return value;
  }
}

function validateNumber(name, value, spec, errors) {
  assert(value !== undefined && value !== null && value !== '');
  switch (typeof value) {
  case 'number':
    return value;
  case 'string':
    if (value.match(/^[-+]?\d+(\.\d+)?([eE][-+]?\d+)?$/)) {
      return Number(value);
    }
    else {
      errors.push(`value ${value} for ${name} is not a number`);
      return;
    }
  default:
    errors.push(`require type Number or String for ${name} value ${value} ` +
		`instead of type ${typeof value}`);
  }
}

function validateInteger(name, value, spec, errors) {
  assert(value !== undefined && value !== null && value !== '');
  switch (typeof value) {
  case 'number':
    if (Number.isInteger(value)) {
      return value;
    }
    else {
      errors.push(`value ${value} for ${name} is not an integer`);
      return;
    }
  case 'string':
    if (value.match(/^[-+]?\d+$/)) {
      return Number(value);
    }
    else {
      errors.push(`value ${value} for ${name} is not an integer`);
      return;
    }
  default:
    errors.push(`require type Number or String for ${name} value ${value} ` +
		`instead of type ${typeof value}`);
  }
}

function validateRange(name, value, spec, errors) {
  assert(value !== undefined && value !== null && value !== '');
  if (typeof value !== 'object') {
    errors.push(`require type Object for ${name} value ${value} ` +
		`instead of type ${typeof value}`);
  }
  return validateLow('_range', value, errors, name);
}

const STATUSES = new Set(['ok', 'error', 'outOfRange']);

function validateStatuses(name, value, spec, errors) {
  assert(value !== undefined && value !== null && value !== '');
  if (typeof value !== 'string') {
    errors.push(`require type String for ${name} value ${value} ` +
		`instead of type ${typeof value}`);
  }
  if (value === 'all') return STATUSES;
  const statuses = value.split('|');
  const badStatuses = statuses.filter(s => !STATUSES.has(s));
  if (badStatuses.length > 0) {
    errors.push(`invalid status ${badStatuses} in status ${value}`);
  }
  return new Set(statuses);
}

const TYPE_VALIDATORS = {
  'integer': validateInteger,
  'number': validateNumber,
  'range': validateRange,
  'statuses': validateStatuses,
};


/** Documents the info properties for different commands.
 *  Each property is documented by an object with the
 *  following properties:
 *     type: the type of the property.  Defaults to string.
 *     default: default value for the property.  If not
 *              specified, then the property is required.
 */
const FN_INFOS = {
  addSensorType: {
    id: { }, 
    manufacturer: { }, 
    modelNumber: { }, 
    quantity: { }, 
    unit: { },
    limits: { type: 'range', },
  },
  addSensor:   {
    id: { },
    model: { },
    period: { type: 'integer' },
    expected: { type: 'range' },
  },
  addSensorData: {
    sensorId: { },
    timestamp: { type: 'integer' },
    value: { type: 'number' },
  },
  findSensorTypes: {
    id: { default: null },  //if specified, only matching sensorType returned.
    index: {  //starting index of first result in underlying collection
      type: 'integer',
      default: 0,
    },
    count: {  //max # of results
      type: 'integer',
      default: DEFAULT_COUNT,
    },
  },
  findSensors: {
    id: { default: null }, //if specified, only matching sensor returned.
    index: {  //starting index of first result in underlying collection
      type: 'integer',
      default: 0,
    },
    count: {  //max # of results
      type: 'integer',
      default: DEFAULT_COUNT,
    },
    doDetail: { //if truthy string, then sensorType property also returned
      default: null, 
    },
  },
  findSensorData: {
    sensorId: { },
    timestamp: {
      type: 'integer',
      default: Date.now() + 999999999, //some future date
    },
    count: {  //max # of results
      type: 'integer',
      default: DEFAULT_COUNT,
    },
    statuses: { //ok, error or outOfRange, combined using '|'; returned as Set
      type: 'statuses',
      default: new Set(['ok']),
    },
    doDetail: {     //if truthy string, then sensor and sensorType properties
      default: null,//also returned
    },
  },
  _range: { //pseudo-command; used internally for validating ranges
    min: { type: 'number' },
    max: { type: 'number' },
  },
};  
