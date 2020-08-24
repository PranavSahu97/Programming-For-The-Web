<!DOCTYPE html>
<html>
  <head>
    <title>Create/Add Sensors</title>
    <link rel="stylesheet" href="{{{base}}}/css/style.css">
  </head>
  <body>
    <h1>Create/Add Sensors</h1>
    <ul>
      {{#errors}}
        <li class="error">{{.}}</li>
      {{/errors}}
    </ul>
    <form method="POST" action="{{{base}}}/tst-sensors-add.html">
      <p>
     </p>
	{{#fields}}
    {{#isSensors1}}
	    <label>
	    <span class="label">
	      {{#isRequired1}} {{/isRequired1}}{{friendlyName}}*:
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
    {{/isSensors1}}
	 {{/fields}}
      <input name="submit" type="submit" value="create" class="control">
    </form> 
    {{>footer}}
  </body>
</html>
