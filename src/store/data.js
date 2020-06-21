import axios from 'axios'

const SET_SCORECARD_DATA = 'SET_SCORECARD_DATA'

const setScorecardData = scorecardData => {
  return {
    type: SET_SCORECARD_DATA,
    scorecardData
  };
};


export const fetchScorecardData = cityId => {
  const url = 'https://api.data.gov/ed/collegescorecard/v1/schools?school.operating=1&2015.academics.program_available.assoc_or_bachelors=true&2015.student.size__range=1..&school.degrees_awarded.predominant__range=1..3&school.degrees_awarded.highest__range=2..4&id=240444&api_key=0Y9Pcb6dLksYPQvH9VRX2iJkhpvogEde9Ms83gMb';
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