<!DOCTYPE html>
<html>
  <head>
    <title>Create/Add Sensor Types</title>
    <link rel="stylesheet" href="{{{base}}}/css/style.css">
  </head>
  <body>
    <h1>Create/Add Sensor Types</h1>
    <ul>
      {{#errors}}
        <li class="error">{{.}}</li>
      {{/errors}}
    </ul>
    <form method="POST" action="{{{base}}}/tst-sensor-types-add.html">
      <p>
     </p>
	{{#fields}}
  {{#isSearch1}}
	    <label>
	    <span class="label">
	      {{#isRequired}} {{/isRequired}}{{friendlyName}}*:
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
      {{/isSelect}}
	    </label>
	    <br/>
	    {{#errorMessage}}
	      <span class="error">{{errorMessage}}</span><br/>
	    {{/errorMessage}}
    {{/isSearch1}}
	 {{/fields}}
      <input name="submit" type="submit" value="create" class="control">
    </form> 
    {{>footer}}
  </body>
</html>
