const React = require('react');

const {FIELD_INFOS, fieldInfos} = require('../lib/search-sensors-field-infos');
const FormComponent = require('./form-component.jsx');

class SearchSensors extends React.Component {
  constructor(props) {
    super(props);
    const extraInfos = {
      submit: {
        type: 'submit',
        value: 'Search',
      },
    };
    
    const infos = fieldInfos(Object.keys(FIELD_INFOS), extraInfos);
    this.state={data1:[]};
    this.onSubmit = this.onSubmit.bind(this);
    this.form = <FormComponent infos={infos} onSubmit={this.onSubmit}/>;
    
  }

  reset() { this.form.reset(); }
  async componentDidMount() { await this.onLoad(); }

  async onLoad() {
    const res =  await this.props.ws.list('sensors',{});
    this.setState({data1:res});
      }
      

userDetails(){
    let res = this.state.data1.data;
    let fields=[];
    if(res!==undefined){
    fields = res.map((i,v)=>{
      return(
      <tr>

            <td>{i.id}</td>
            <td>{i.model}</td>
            <td>{i.period}</td>
            <td>{i.expected.min}</td>
            <td>{i.expected.max}</td>
       </tr>
      );
   }); 
   return fields;  
  }
  
  };


  async onSubmit(form) {
    try {
      const res=await this.props.ws.list('sensors',form.values());
      this.setState({data1:res});
    }
    catch (err) {
      const msg = (err.message) ? err.message : 'web service error';
      form.setFormErrors([msg]);
    }
  }
  render() { 
    const display = this.userDetails();
    return (
    <div className="user-container">{this.form} 
    <h2>Results Summary</h2>

<table className="summary">
    <thead>
     <tr>
              <th>Sensor ID</th>
              <th>Model </th>
              <th>Period</th>
              <th colSpan="2">Expected Range</th>
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
        {display}
 </tbody>
 </table>
</div>

  );
  }
}

module.exports = SearchSensors;

