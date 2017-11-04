/* global _ */
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Pagination } from 'antd';
import QueueAnim from 'rc-queue-anim';
import classnames from 'utils/classnames';
import styles from './List.scss';

const PREFIX = 'list';
const cx = classnames(PREFIX, styles);

class List extends Component {
  renderFooter({ totalCount, paginationNo, pageSize, totalNumClassName }, { changePagination }) {
    return (
      <div className={cx('pagination')}>
        <div className={cx('total-num')}>共有{totalCount}条</div>
        <Pagination
          current={paginationNo}
          onChange={changePagination}
          total={totalCount}
          pageSize={pageSize || 10}
        />
      </div>
    );
  }

  renderHeaderItems({ cols = [], sortedColumns }, { onSort }) {
    return cols.map(item => (
      <div key={item.index} className={item.className ? item.className : item.index}>
        {item.text}
        {item.sortable ? (
          <i
            role="button"
            tabIndex="0"
            className={`fa fa-sort ${_.find(sortedColumns, n => n === item.index)
              ? cx('sorted-icon')
              : cx('sort-icon')}`}
            onClick={() => onSort(item.index)}
            style={{ outline: 'none' }}
          />
        ) : null}
      </div>
    ));
  }

  renderHeader(options, actions) {
    return (
      <div className={`${cx('header')} ${this.props.options.headerClassName}`}>
        {this.renderHeaderItems(options, actions)}
      </div>
    );
  }

  renderBodyItems(items, index) {
    const cells = [];
    for (const col of this.props.options.cols) {
      let value;
      if (col.render) {
        value = col.render(items[col.index], index, items);
      } else {
        value = items[col.index];
      }
      cells.push(
        <div key={col.index} className={col.className}>
          {value}
        </div>
      );
    }
    return cells;
  }

  renderBodyRows(dataSource, { rowClassName }) {
    return dataSource.map((items, index) => (
      <div
        key={index}
        className={`${cx('row')} ${rowClassName} ${items.detail ? `${cx('row-hover')}` : ''}`}
      >
        <div className={cx('items')}>{this.renderBodyItems(items, index)}</div>
        {items.detail ? (
          <div className={cx('detail')}>
            {items.detail.imageUrl &&
            items.detail.imageUrl !== '' &&
            items.detail.imageUrl !== ' ' ? (
              <div className={cx('img')}>
                <img src={items.detail.imageUrl} alt="" height="100%" />
              </div>
            ) : null}
            <div className={`${cx('text')} ${items.detail.textClassName}`}>{items.detail.text}</div>
          </div>
        ) : null}
      </div>
    ));
  }

  renderBody(dataSource, options) {
    return (
      <div className={cx('body')}>
        {options.animation ? (
          <QueueAnim animConfig={{ opacity: [1, 0] }}>
            {this.renderBodyRows(dataSource, options)}
          </QueueAnim>
        ) : (
          this.renderBodyRows(dataSource, options)
        )}
      </div>
    );
  }

  render() {
    const { data: { dataSource = [] }, options, actions } = this.props;
    return (
      <div className={`${cx('list')} ${options.listClassName}`}>
        {options.showHeader ? this.renderHeader(options, actions) : null}
        {this.renderBody(dataSource, options)}
        {options.isPagination ? this.renderFooter(options, actions) : null}
      </div>
    );
  }
}

List.propTypes = {
  data: PropTypes.shape({
    dataSource: PropTypes.arrayOf(PropTypes.object)
  }).isRequired,
  options: PropTypes.shape({
    cols: PropTypes.arrayOf(
      PropTypes.shape({
        index: PropTypes.string,
        text: PropTypes.string,
        className: PropTypes.string,
        sortable: PropTypes.bool,
        render: PropTypes.func
      })
    ),
    totalCount: PropTypes.number,
    paginationNo: PropTypes.number,
    pageSize: PropTypes.number,
    listClassName: PropTypes.string,
    sortedColumns: PropTypes.arrayOf(PropTypes.string),
    rowClassName: PropTypes.string,
    headerClassName: PropTypes.string,
    isPagination: PropTypes.bool,
    showHeader: PropTypes.bool,
    animation: PropTypes.bool
  }).isRequired,
  actions: PropTypes.shape({
    onSort: PropTypes.func,
    onFilter: PropTypes.func,
    changePagination: PropTypes.func
  })
};

List.defaultProps = {
  actions: {}
};

export default List;
