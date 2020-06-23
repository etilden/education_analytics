import React from 'react';
import { connect } from "react-redux";
import { fetchScorecardData } from './store/data'
import { Doughnut } from 'react-chartjs-2'
import * as jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { CSVLink } from 'react-csv'
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null
    }
    this.dataProcesser = this.dataProcesser.bind(this);
    this.toggleSelected = this.toggleSelected.bind(this);
    this.makePDF = this.makePDF.bind(this);
    this.download = this.download.bind(this);
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
        }],
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
      this.setState({...this.state, selected: null});
    } else {
      this.setState({...this.state, selected: event.target.parentElement.id});
    }
  }

  async makePDF() {
    html2canvas(document.getElementById('app')).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 0, 0);
      pdf.save("download.pdf"); 
    });
  }

  download() {

  }

  render() {
    if (this.props.scorecard.results && this.state) {
      let school = this.props.scorecard.results[0].school; 
      let stats = this.props.scorecard.results[0].latest;
      let graphTopics = ['program', 'race /_ethnicity', 'title_iV'];
      return (
        <div className="app">
          <div>
            <div className='header'>
              <h1>{school.name}</h1><h3>{`${stats.student.size.toLocaleString()} Students`}</h3>
              <h3>{school.alias ? school.alias : null}</h3>
            </div>
            <div className='sub-head-container'>
                <a 
                target="_blank" 
                rel="noopener noreferrer" 
                href = {`http://${school.school_url}`}
                className='left'
                >
                  {school.school_url}
                </a>
                <p className='right'>{school.city}, {school.state}, {school.zip.split('-')[0]}</p>
            </div>
          </div>
          <div>
            {this.state.selected ?
            <div>
              {
                <div>
                  <div
                  key={this.state.selected} 
                  id={this.state.selected} 
                  onClick={(event) => this.toggleSelected(event)}
                  onMouseOver = {(event) => {event.target.className = event.target.className + ' bold'}}
                  onMouseOut= {(event) => {event.target.className=event.target.className.split(' ').filter(name => name !== 'bold').join (' ')}}
                  >
                    {window.screen.width <= 400 ? 
                      <Doughnut 
                      data={this.dataProcesser(this.state.selected)} 
                      options={{legend: false, title: {display: true, text: this.state.selected.split('_')
                      .map(word => word[0].toUpperCase() + word.slice(1, word.length)).join(' ')}}}
                      /> :
                      <Doughnut 
                        data={this.dataProcesser(this.state.selected)} 
                        options={{legend: {position: 'left'}, title: {display: true, text: this.state.selected.split('_')
                        .map(word => word[0].toUpperCase() + word.slice(1, word.length)).join(' ')}}}
                      />
                    }
                  </div>
                </div>
              }
            </div>
            :
            <div className='chartsContainer'>
              {graphTopics.map(content => {
                let data = this.dataProcesser(content)
                return <div 
                key={content}
                className='chart' 
                id = {content} 
                onClick={(event) => this.toggleSelected(event)}
                onMouseOver = {(event) => {event.target.className = event.target.className + ' bold'}}
                onMouseOut= {(event) => {event.target.className=event.target.className.split(' ').filter(name => name !== 'bold').join (' ')}}
                >
                  <Doughnut 
                    data={data} 
                    options={{legend: false, title: {display: true, text: content.split('_')
                    .map(word => word[0].toUpperCase() + word.slice(1, word.length)).join(' ')}}}
                  />
                </div>
              })}
            </div> 
            }
          </div>
          <div className='buttonContainer'>
            <button type='button' onClick={() => this.makePDF()}>Save as PDF</button>
            <button><CSVLink data = {[
              {name: school.name}, 
              {url: school.school_url}, 
              {city: school.city}, 
              {state: school.state}, 
              {zip: school.zip}, 
              {classSize: stats.student.size}, 
              stats.academics.program_percentage, 
              stats.student.demographics.race_ethnicity, 
              stats.completion.title_iv.completed_by
            ]}>
              Download Data
              </CSVLink></button>
            <button>Print Page</button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="app">Loading...</div>
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