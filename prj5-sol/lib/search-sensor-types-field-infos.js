const FIELD_INFOS = {
    // 'use strict';
 
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
   