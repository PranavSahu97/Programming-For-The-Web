const React = require('react');

const {FIELD_INFOS, fieldInfos} = require('../lib/add-sensor-types-field-infos');
const FormComponent = require('./form-component.jsx');

class AddSensorTypes extends React.Component {
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
     form1.id=form.values().id;
     form1.modelNumber=form.values().modelNumber;
     form1.manufacturer=form.values().manufacturer;
     form1.quantity=form.values().quantity;
     form1.unit=form.values().unit;

     let min=form.values().minimumLimit;
     let max=form.values().maximumLimit;

     form1.limits={min,max};
      await this.props.ws.update('sensor-types',form1);
      this.props.app.select('sensor-types-search');
    }
    catch (err) {
      const msg = (err.message) ? err.message : 'web service error';
      form.setFormErrors([msg]);
    }
  }
  render() { return <div className="user-container">{this.form}</div>; }
}

module.exports = AddSensorTypes;