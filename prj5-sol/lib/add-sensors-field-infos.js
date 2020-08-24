const FIELD_INFOS = {
    // 'use strict';
 
    sensorId: {
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
   
 //   validators: [
 //     { checkFn: ({limits}) => Number(limits.min) <= Number(limits.max),
 //       error: ({limits: interval}, {limits: fieldInfo}) => {
 // 	return `The ${fieldInfo.friendlyName} Min value ${interval.min} is ` +
 // 	  `greater than its Max value ${interval.max}`;
 //       },
 //       widget: 'limits',
 //       views: new Set(['add']),
 //     },
 //   ]
     
   };
   
   function fieldInfos(fields, overrides={}) {
     const infos = {};
     fields.forEach((f) => {
       const v = Object.assign({}, FIELD_INFOS[f] || {});
       infos[f] = Object.assign(v, overrides[f] || {});
     });
     Object.keys(overrides).forEach((f) => {
       infos[f] = infos[f] || overrides[f];
     });
     return infos;
   }
   
   module.exports = {
     FIELD_INFOS,
     fieldInfos,
   };
   