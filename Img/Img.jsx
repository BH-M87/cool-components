import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImgReact from 'react-image';
import VisibilitySensor from 'react-visibility-sensor';
import classnames from 'utils/classnames';
import styles from './Img.scss';

const PREFIX = 'img';
const cx = utils.classnames(PREFIX, styles);

class Img extends Component {
  render() {
    const altElement = (
      <div
        className={cx('alt-element')}
        style={{ height: this.props.height, width: this.props.width }}
      >
        <span>暂无图片</span>
      </div>
    );

    return (
      <div
        style={this.props.style}
        className={`${cx('img-wrap')} ${this.props.className}`}
        onClick={this.props.onClick}
      >
        <VisibilitySensor>
          <ImgReact
            src={this.props.src}
            unloader={altElement}
            height={this.props.height}
            width={this.props.width}
          />
        </VisibilitySensor>
      </div>
    );
  }
}

Img.propTypes = {
  src: PropTypes.string,
  style: PropTypes.object,
  height: PropTypes.number,
  width: PropTypes.number,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

Img.defaultProps = {
  className: '',
  height: 104,
  width: 180,
  onClick: () => {},
};

export default Img;
