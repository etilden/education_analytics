import React from 'react';
import { connect } from "react-redux";
import { fetchScorecardData } from './store/data'
import { Doughnut } from 'react-chartjs-2'
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null
    }
    this.dataProcesser = this.dataProcesser.bind(this);
    this.toggleSelected = this.toggleSelected.bind(this);
  }

  componentDidMount() {
    this.props.fetchScorecardData(); 
  }

  dataProcesser(contentType) {
    let stats = this.props.scorecard.results[0].latest;
    let content = contentType === 'program' ? stats.academics.program_percentage : 
      contentType === 'race_ethnicity' ?  stats.student.demographics.race_ethnicity : 
      stats.completion.title_iv.completed_by;
      let data = {
        labels: [],
        datasets:[{
          data: [],
          borderColor: '#FFFFFF',
          backgroundColor: []
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

  toggleSelected(event) {
    if (this.state.selected === event.target.parentElement.id) {
      console.log('if')
      // this.setState({...this.state, selected: null});
      // event.target.parentElement.className = 'chart'
      // event.target.parentElement.parentElement.className = 'chartsContainer'
    } else {
      console.log('else')
      console.log('id', event.target.parentElement.id)
      this.setState({...this.state, selected: event.target.parentElement.id});
      // event.target.parentElement.parentElement.childNodes.forEach(node => node.className = 'chart')
      // event.target.parentElement.className = 'selected'
      // event.target.parentElement.parentElement.className = 'singleChart'
    }
    // setTimeout(console.log(this.state, 'state after timeout'), 2000)
  }

  render() {
    if (this.props.scorecard.results && this.state) {
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
            {this.state.selected ?
            <div>
              {
                <div>
                  {/*on click make it go back to single view
                  set keys info on left hand side*/}
                  <div key={this.state.selected} id={this.state.selected}>{this.state.selected}<Doughnut data={this.dataProcesser(this.state.selected)} /></div>
                </div>
              }
            </div>
            :
            <div className='chartsContainer'>
              {console.log('does this work?', this.state.selected)}
              {['program', 'race_ethnicity', 'title_iv'].map(content => {
                let data = this.dataProcesser(content)
                return <div key={content} className='chart' id = {content} onClick={(event) => this.toggleSelected(event)}>{content}<Doughnut data={data} options={{legend: false}} /></div>
              })}
            </div> 
            }
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