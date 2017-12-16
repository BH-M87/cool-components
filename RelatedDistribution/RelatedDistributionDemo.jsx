import React, { Component } from 'react';
import RelatedDistribution from '.';

class RelatedDistributionDemo extends Component {
  render() {
    const data = { dateWithData: ['2017-06-14', '2017-06-15', '2017-06-16'] };
    const actions = {
      onDateRangeSelection(startDate, endDate) {
        console.log(startDate, endDate);
      }
    };
    const options = {
      startDate: '2017-05-01',
      selectedStartDate: '2017-06-01',
      selectedEndDate: '2017-06-20',
      endDate: '2017-07-01',
      dateFormat: 'YYYY-MM-DD'
    };
    return <RelatedDistribution data={data} actions={actions} options={options} />;
  }
}

export default RelatedDistributionDemo;
