import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import './RelatedDistribution.scss';

class RelatedDistribution extends Component {
  componentDidMount() {
    this.draw();
  }

  componentDidUpdate() {
    this.draw();
  }

  draw() {
    const props = this.props;
    const dateFormat = props.options.dateFormat;
    const startMoment = moment(props.options.startDate, dateFormat);
    const endMoment = moment(props.options.endDate, dateFormat);
    let selectedStartDateStr = props.options.selectedStartDate;
    let selectedEndDateStr = props.options.selectedEndDate;
    const selectedStartMoment = moment(selectedStartDateStr, dateFormat);
    const selectedEndMoment = moment(selectedEndDateStr, dateFormat);
    const dateInterval =
      (endMoment.unix() - startMoment.unix()) / 60 / 60 / 24 + 1;
    const selectedStartDateIndex =
      (selectedStartMoment.unix() - startMoment.unix()) / 60 / 60 / 24;
    const selectedEndDateIndex =
      (selectedEndMoment.unix() - startMoment.unix()) / 60 / 60 / 24;
    // default interval
    let axisInterval = 10;
    const textXOffset = -13;
    const textYOffset = -4;
    const textHeight = 20;
    const dateWithData = props.data.dateWithData;
    const element = d3.select('#related-distribution-box');
    const padding = { left: 30, right: 0, top: 30, bottom: 20 };
    const width = parseInt(element.style('width'), 10) || 1000;
    const initHeight = 100;
    const height = initHeight + padding.top + padding.bottom;
    // remove the svg element first when update
    element.select('svg').remove();
    const svg = element
      .append('svg')
      .attr('width', width)
      .attr('height', height);
    if (dateInterval <= 10) {
      axisInterval = 1;
    } else {
      axisInterval = Math.ceil(dateInterval / 10);
    }
    // 一共几个格子，10个
    const axisTicks = Math.ceil(dateInterval / axisInterval);
    const axisBrandWidth = (width - padding.left - padding.right) / axisTicks;
    // 最后一个格子显示的时间数量
    const axisLastInterval = dateInterval - axisTicks * (axisInterval - 1);
    const scale = d3
      .scaleLinear()
      .domain([0, dateInterval])
      .range([padding.left, width - padding.right]);
    const circleWidth = Math.ceil(
      dateInterval > 0
        ? scale(1) - scale(0)
        : width - padding.left - padding.right / 2,
    );
    // get dataSet
    const dataSet = [];
    const lineDataSet = [];
    for (let i = 0; i < dateInterval; i++) {
      const dateMoment = moment(startMoment).add(i, 'd');
      const data = { date: dateMoment.format('MM.DD') };
      for (const item of dateWithData) {
        if (moment(item, dateFormat).isSame(dateMoment)) {
          data.highlight = true;
        }
      }
      dataSet.push(data);
      if (i % axisInterval === 0) {
        data.index = i;
        lineDataSet.push(data);
      }
    }
    const polygonWidth = 12;
    const polygonHeight = 9;
    // draw
    const intervalLine = svg
      .selectAll('.interval-line')
      .data(lineDataSet)
      .enter()
      .append('line')
      .attr('class', 'interval-line')
      .attr('x1', d => scale(d.index))
      .attr('y1', padding.top)
      .attr('x2', d => scale(d.index))
      .attr('y2', height - padding.bottom - textHeight)
      .style('stroke', '#3D4B55')
      .style('stroke-width', 1);
    const intervalLineText = svg
      .selectAll('.interval-line-text')
      .data(lineDataSet)
      .enter()
      .append('text')
      .attr('class', 'interval-line-text')
      .attr('x', d => scale(d.index) + textXOffset)
      .attr('y', height - padding.bottom + textYOffset)
      .style('fill', '#999999')
      .style('font-size', 10)
      .text(d => d.date);
    const bottomLine = svg
      .append('line')
      .attr('x1', 0)
      .attr('y1', height - padding.bottom - textHeight)
      .attr('x2', width)
      .attr('y2', height - padding.bottom - textHeight)
      .style('stroke', '#666666')
      .style('stroke-width', 1);
    const startDateLine = svg
      .append('line')
      .attr('class', 'start-date')
      .attr('x1', scale(selectedStartDateIndex))
      // .attr('x1', polygonWidth / 2)
      .attr('y1', padding.top)
      .attr('x2', scale(selectedStartDateIndex))
      // .attr('x2', polygonWidth / 2)
      .attr('y2', height - padding.bottom - textHeight)
      .style('stroke', '#FF7300')
      .style('stroke-width', 2);
    const startDatePolygon = svg
      .append('polygon')
      .attr('class', 'start-date')
      .attr(
        'points',
        `${scale(selectedStartDateIndex) - polygonWidth / 2},${padding.top} ${scale(selectedStartDateIndex) + polygonWidth / 2},${padding.top} ${scale(selectedStartDateIndex)},${padding.top + polygonHeight}`,
      )
      .style('fill', '#FF7300');
    const startDateText = svg
      .append('text')
      .attr('class', 'start-date-text')
      .attr('x', scale(selectedStartDateIndex) + textXOffset)
      .attr('y', padding.top + textYOffset)
      .style('fill', '#999999')
      .style('font-size', 10)
      .text(selectedStartMoment.format('MM.DD'));
    const endDateLine = svg
      .append('line')
      .attr('class', 'end-date')
      .attr('x1', scale(selectedEndDateIndex))
      .attr('y1', padding.top)
      .attr('x2', scale(selectedEndDateIndex))
      .attr('y2', height - padding.bottom - textHeight)
      .style('stroke', '#FF7300')
      .style('stroke-width', 2);
    const endDatePolygon = svg
      .append('polygon')
      .attr('class', 'end-date')
      .attr(
        'points',
        `${scale(selectedEndDateIndex) - polygonWidth / 2},${padding.top} ${scale(selectedEndDateIndex) + polygonWidth / 2},${padding.top} ${scale(selectedEndDateIndex)},${padding.top + polygonHeight}`,
      )
      .style('fill', '#FF7300');
    const endDateText = svg
      .append('text')
      .attr('class', 'start-date-text')
      .attr('x', scale(selectedEndDateIndex) + textXOffset)
      .attr('y', padding.top + textYOffset)
      .style('fill', '#999999')
      .style('font-size', 10)
      .text(selectedEndMoment.format('MM.DD'));
    const circle = svg
      .selectAll('.circle')
      .data(dataSet)
      .enter()
      .append('circle')
      .attr('class', 'circle')
      .attr('cx', (d, i) => scale(i))
      .attr(
        'cy',
        (height - padding.bottom - padding.top - textHeight) / 2 + padding.top,
      )
      .attr('r', 4)
      .style('fill', d => (d.highlight ? '#00C1DE' : '#38454F'));
    const startDateArea = svg
      .append('rect')
      .attr('class', 'start-date-area')
      .attr('x', scale(selectedStartDateIndex) - polygonWidth / 2)
      .attr('y', padding.top)
      .attr('width', polygonWidth)
      .attr('height', height - padding.bottom - padding.top - textHeight)
      .style('fill-opacity', 0);
    const endDateArea = svg
      .append('rect')
      .attr('class', 'end-date-area')
      .attr('x', scale(selectedEndDateIndex) - polygonWidth / 2)
      .attr('y', padding.top)
      .attr('width', polygonWidth)
      .attr('height', height - padding.bottom - padding.top - textHeight)
      .style('fill-opacity', 0);
    // Add event listener
    // https://github.com/d3/d3-drag#drag_on
    const dateTransition = d3.transition().duration(300);
    const changeStartDatePosition = (x, text, transition) => {
      if (transition) {
        startDateArea
          .transition(dateTransition)
          .attr('x', x - polygonWidth / 2);
        startDateLine.transition(dateTransition).attr('x1', x).attr('x2', x);
        startDatePolygon
          .transition(dateTransition)
          .attr(
            'points',
            `${x - polygonWidth / 2},${padding.top} ${x + polygonWidth / 2},${padding.top} ${x},${padding.top + polygonHeight}`,
          );
        startDateText
          .transition(dateTransition)
          .attr('x', x + textXOffset)
          .text(text);
      } else {
        startDateArea.attr('x', x - polygonWidth / 2);
        startDateLine.attr('x1', x).attr('x2', x);
        startDatePolygon.attr(
          'points',
          `${x - polygonWidth / 2},${padding.top} ${x + polygonWidth / 2},${padding.top} ${x},${padding.top + polygonHeight}`,
        );
        startDateText.attr('x', x + textXOffset).text(text);
      }
    };
    const changeEndDatePosition = (x, text, transition) => {
      if (transition) {
        endDateArea.transition(dateTransition).attr('x', x - polygonWidth / 2);
        endDateLine.transition(dateTransition).attr('x1', x).attr('x2', x);
        endDatePolygon
          .transition(dateTransition)
          .attr(
            'points',
            `${x - polygonWidth / 2},${padding.top} ${x + polygonWidth / 2},${padding.top} ${x},${padding.top + polygonHeight}`,
          );
        endDateText
          .transition(dateTransition)
          .attr('x', x + textXOffset)
          .text(text);
      } else {
        endDateArea.attr('x', x - polygonWidth / 2);
        endDateLine.attr('x1', x).attr('x2', x);
        endDatePolygon.attr(
          'points',
          `${x - polygonWidth / 2},${padding.top} ${x + polygonWidth / 2},${padding.top} ${x},${padding.top + polygonHeight}`,
        );
        endDateText.attr('x', x + textXOffset).text(text);
      }
    };
    const getSelected = (x) => {
      for (let i = 0; i < dateInterval; i++) {
        if (x > scale(i) - circleWidth / 2 && x < scale(i) + circleWidth / 2) {
          return { date: moment(startMoment).add(i, 'd'), index: i };
        }
      }
    };
    // remove listener first
    // startDateArea.on('.drag', null);
    // endDateArea.on('.drag', null);
    startDateArea.call(
      d3.drag().on('start', () => {
        d3.event.on('drag', dragged).on('end', ended);
        function dragged() {
          const location = d3.mouse(this);
          const x = location[0];
          const selected = getSelected(x);
          changeStartDatePosition(x, selected.date.format('MM.DD'), false);
        }
        function ended() {
          const location = d3.mouse(this);
          const x = location[0];
          const selected = getSelected(x);
          selectedStartDateStr = selected.date.format(dateFormat);
          changeStartDatePosition(
            scale(selected.index),
            selected.date.format('MM.DD'),
          );
          props.actions.onDateRangeSelection(
            selectedStartDateStr,
            selectedEndDateStr,
            true,
          );
        }
      }),
    );
    endDateArea.call(
      d3.drag().on('start', () => {
        d3.event.on('drag', dragged).on('end', ended);
        function dragged() {
          const location = d3.mouse(this);
          const x = location[0];
          const selected = getSelected(x);
          changeEndDatePosition(x, selected.date.format('MM.DD'), false);
        }
        function ended() {
          const location = d3.mouse(this);
          const x = location[0];
          const selected = getSelected(x);
          selectedEndDateStr = selected.date.format(dateFormat);
          changeEndDatePosition(
            scale(selected.index),
            selected.date.format('MM.DD'),
            true,
          );
          props.actions.onDateRangeSelection(
            selectedStartDateStr,
            selectedEndDateStr,
          );
        }
      }),
    );
  }
  render() {
    return (
      <div id="related-distribution-box" className="related-distribution-box" />
    );
  }
}

RelatedDistribution.propTypes = {
  data: PropTypes.object,
  options: PropTypes.object,
  actions: PropTypes.object,
};

export default RelatedDistribution;
