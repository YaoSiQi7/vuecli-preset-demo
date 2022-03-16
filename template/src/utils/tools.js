import * as dataService from '../api/riskMarket.js';

function getCityData () {
  try {
    return dataService.getcity();
  } catch (err) {
    this.snackbarServe = true;
    this.snackbarServeMsg = err.msg;
    this.snackbarServeColor = 'error';
  }
}
const toolList = {
  'getCityData': getCityData
};
export default toolList;
