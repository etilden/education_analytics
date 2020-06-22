import React from 'react';
import { connect } from "react-redux";
import { fetchScorecardData } from './store/data'
import { Doughnut } from 'react-chartjs-2'
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.dataProcesser = this.dataProcesser.bind(this);
  }

  componentDidMount() {
    this.props.fetchScorecardData(); 
  }

  dataProcesser(contentType) {
    console.log('awooga', contentType)
    let stats = this.props.scorecard.results[0].latest;
    let content = contentType === 'program' ? stats.academics.program_percentage : 
      contentType === 'race_ethnicity' ?  stats.student.demographics.race_ethnicity : 
      stats.completion.title_iv.completed_by;
      let data = {
        labels: [],
        datasets:[{
          data: [],
          borderColor: '#FFFFFF',
          backgroundColor: [],
          labels:'%'
        }]
      }
      for (let key in content) {
        if (content[key]) {
          data.labels.push(key.split('_').map(word => word[0].toUpperCase() + word.slice(1, key.length)).join(' '));
          data.datasets[0].data.push((content[key]*100).toFixed(2));
          data.datasets[0].backgroundColor.push('#'+((1<<24)*(Math.random()+1)|0).toString(16).substr(1));
        }
      }
    return data
  }

  render() {
    if (this.props.scorecard.results) {
      let school = this.props.scorecard.results[0].school; 
      let stats = this.props.scorecard.results[0].latest;
      return (
        <div>
          <div>
            <h1>{school.name}</h1>
            <h3>{school.alias ? school.alias : null}</h3>
            <a href = {school.school_url}>{school.school_url}</a>
            <p>{school.city}, {school.state}</p>
            <p>{school.zip}</p>
          </div>
          <div>
            {stats.student.size.toLocaleString()}
            {['program', 'race_ethnicity', 'title_iv'].map(content => {
              let data = this.dataProcesser(content)
              console.log(data)
              return <div key={content}>{content}<Doughnut data={data} options={{legend: false}}/></div>
            })}
          </div>
          <div>
            <button>Save as PDF</button>
            <button>Download Data</button>
            <button>Print Page</button>
          </div>
        </div>
      );
    } else {
      return (
        <div>Loading...</div>
      )
    };
  }
}

const mapStateToProps = state => {
  return {
    scorecard: state.scorecard
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchScorecardData: () => dispatch(fetchScorecardData())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
// export default App