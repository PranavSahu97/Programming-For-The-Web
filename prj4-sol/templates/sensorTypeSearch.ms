<!DOCTYPE html>
<html>
  <head>
    <title>Search Sensor Types</title>
    <link rel="stylesheet" href="{{{base}}}/css/style.css">
  </head>
  <body>
    <h1>Search Sensor Types</h1>
    <ul>
      {{#errors}}
        <li class="error">{{.}}</li>
      {{/errors}}
    </ul>
    {{#err}}
       <li class="error">Not Found</li>
    {{/err}}
    <form method="GET" action="{{{base}}}/tst-sensor-types-search.html">
      <p>
     </p>

	{{#fields}}
   {{#isSearch}}
	    <label>
	    <span class="label">
	      {{#isRequired}} {{/isRequired}}{{friendlyName}}:
	    </span>
        {{#isRequired}}
	    <input name="{{name}}" {{#type}}type="{{type}}"{{/type}}
	           value="{{value}}">
        {{/isRequired}}

        {{#isSelect}}
            <select name="quantity"
            id="quantity" class="tst-quantity">
            <option value="" selected>
            Select
                </option>
                <option value="temperature">
                    Temperature
                </option>
                <option value="pressure">
                    Pressure
                </option>
                <option value="flow">
                    Flow
                </option>
                <option value="humidity">
                    Humidity
                </option>
            </select>
        {{#errorMessage}}
	      <div class="error">{{errorMessage}}</div><br/>
	    {{/errorMessage}}
        {{/isSelect}}
	    </label>
	    <br/>
	    {{#errorMessage}}
	      <div class="error">{{errorMessage}}</div><br/>
	    {{/errorMessage}}
      {{/isSearch}}
	 {{/fields}}
   
      <input name="submit" type="submit" value="search" class="control">
    </form> 
    
    <h2>Results Summary</h2>

    <table class="summary">
        <thead>
    	   <tr>
                  <th>Sensor Type ID</th>
                  <th>Model Number</th>
                  <th>Manufacturer</th>
                  <th>Quantity</th>
                  <th colspan="2">Limits</th>
    	   </tr>
    	   <tr>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th>Min</th>
                  <th>Max</th>
           </tr>
         </thead>
          <tbody>
          {{#users}}
          <tr>
        {{#fields}}
	        {{#value}}
          <td>{{value}}</td>
          {{/value}}	  
	{{/fields}}
  </tr>
    
    {{/users}}
    </tbody>
    </table>
    
        <div class="scroll">
        {{#prev}}
        <a class="tst-prev" href="{{prev}}" rel="prev">&lt;&lt;</a>
        {{/prev}}
        {{#next}}
        <a class="tst-next" href="{{next}}" rel="next">&gt;&gt;</a>
        {{/next}}
    </div>

      </body>
    {{>footer}}
  
</html>
