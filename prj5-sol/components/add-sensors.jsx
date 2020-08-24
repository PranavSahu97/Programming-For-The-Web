const React = require('react');

const {FIELD_INFOS, fieldInfos} = require('../lib/add-sensors-field-infos');
const FormComponent = require('./form-component.jsx');

class AddSensors extends React.Component {
  constructor(props) {
    super(props);
    const extraInfos = {
      submit: {
        type: 'submit',
        value: 'Create',
      },
    };
    const infos = fieldInfos(Object.keys(FIELD_INFOS), extraInfos);
    this.onSubmit = this.onSubmit.bind(this);
    this.form = <FormComponent infos={infos} onSubmit={this.onSubmit}/>;
  }
  reset() { this.form.reset(); }

  async onSubmit(form) {
    try {
      let form1={};
     form1.id=form.values().sensorId;
     form1.model=form.values().model;
     form1.period=form.values().period;

     let min=form.values().minimumRange;
     let max=form.values().maximumRange;

     form1.expected={min,max};
     console.log(form1);
      await this.props.ws.update('sensors',form1);
      this.props.app.select('sensors-search');
    }
    catch (err) {
      const msg = (err.message) ? err.message : 'web service error';
      form.setFormErrors([msg]);
    }
  }
  render() { return <div className="user-container">{this.form}</div>; }
}

module.exports = AddSensors;