import React from 'react';
import { connect } from "react-redux";
import { fetchScorecardData } from './store/data'
import './App.css';

class App extends React.Component {

  componentDidMount() {
    this.props.fetchScorecardData(); 
  }
  render() {
    console.log(this.props, 'prahps');
    return (
      <div>
        HELLO WORLD
      </div>
      // <div className="App">
      //   <header className="App-header">
      //     <img src={logo} className="App-logo" alt="logo" />
      //     <p>
      //       Edit <code>src/App.js</code> and save to reload.
      //     </p>
      //     <a
      //       className="App-link"
      //       href="https://reactjs.org"
      //       target="_blank"
      //       rel="noopener noreferrer"
      //     >
      //       Learn React
      //     </a>
      //   </header>
      // </div>
    );
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