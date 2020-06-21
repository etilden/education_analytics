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

  dataProcesser(content) {
    let data = content === 'program' ? this.props.scorecard.results[0].latest.academics.program_percentage : content === 'race_ethnicity' ?  this.props.scorecard.results[0].latest.student.demographics.race_ethnicity : this.props.scorecard.results[0].latest.completion.title_iv.completed_by
    //then process this data so that it is appropriate for the doughnut graph needs
  }

  render() {
    if (this.props.scorecard.results) {
      console.log(this.props.scorecard.results[0].school, 'prahps')
      let school = this.props.scorecard.results[0].school; 
      let stats = this.props.scorecard.results[0].latest
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
              <Doughnut data={(content) => this.dataProcesser(content)} />
            })}
            {/* {stats.academics.program_percentage} */}
            {/* {stats.student.demographics.race_ethnicity} */}
            {/* {stats.completion.title_iv.completed_by} */}
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