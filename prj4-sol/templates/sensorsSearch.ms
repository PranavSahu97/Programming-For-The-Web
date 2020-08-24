<!DOCTYPE html>
<html>
  <head>
    <title>Search Sensors</title>
    <link rel="stylesheet" href="{{{base}}}/css/style.css">
  </head>
  <body>
    <h1>Search Sensors</h1>
    <ul>
      {{#errors}}
        <li class="error">{{.}}</li>
      {{/errors}}
    </ul>
    <form method="GET" action="{{{base}}}/tst-sensors-search.html">
      <p>
     </p>

	{{#fields}}
   {{#isSensors}}
	    <label>
	    <span class="label">
	      {{#isRequired1}} {{/isRequired1}}{{friendlyName}}:
	    </span>
        {{#isRequired1}}
	    <input name="{{name}}" {{#type}}type="{{type}}"{{/type}}
	           value="{{value}}">
        {{/isRequired1}}
	    </label>
	    <br/>
	    {{#errorMessage}}
	      <span class="error">{{errorMessage}}</span><br/>
	    {{/errorMessage}}
      {{/isSensors}}
	 {{/fields}}
   
      <input name="submit" type="submit" value="search" class="control">
    </form> 
    <h2>Results Summary</h2>

    <table class="summary">
        <thead>
    	   <tr>
                
                  <th>Sensor ID</th>
                  <th>Model</th>
                  <th>Period</th>
                  <th colspan="2">Expected</th>
    	   </tr>
    	   <tr>
                  
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
