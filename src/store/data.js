import axios from 'axios'

const SET_SCORECARD_DATA = 'SET_SCORECCARD_DATA'

const setScorecardData = scorecardData => {
  return {
    type: SET_SCORECARD_DATA,
    scorecardData
  };
};


export const fetchScorecardData = cityId => {
  const url = 'https://api.data.gov/ed/collegescorecard/v1/schools?api_key=0Y9Pcb6dLksYPQvH9VRX2iJkhpvogEde9Ms83gMb';
  return async dispatch => {
    try {
      const { data } = await axios.get(url)
      dispatch(setScorecardData(data))
    } catch (err) {
      console.log(err)
    };
  };
};

const scorecardReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_SCORECARD_DATA:
      return action.scorecardData
    default:
      return state
  };
};

export default scorecardReducer;