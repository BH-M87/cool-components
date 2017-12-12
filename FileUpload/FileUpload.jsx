/* eslint no-param-reassign:0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import _ from 'lodash';
import reqwest from 'reqwest';
import classnames from 'utils/classnames';
import http from 'common/http';
import { Upload, Button } from 'antd';
import styles from './FileUpload.scss';

const PREFIX = 'file-upload';
const cx = classnames(PREFIX, styles);

const FORM_FILES_NAME = 'file';
const ACTION_URL = '/resourceMgr/alertObjMgr/importData';

/*  file attribute example:
  file = {
    uid: 'rc-upload-1510220017186-2',
    name: 'IMG_9293_resize.jpg',
    lastModified: 1508123568725,
    lastModifiedDate: 'Mon Oct 16 2017 11:12:48 GMT+0800 (CST)',
    webkitRelativePath: '',
    lastModified: 1508123568725,
    lastModifiedDate: 'Mon Oct 16 2017 11:12:48 GMT+0800 (CST) {}',
    name: 'IMG_9293_resize.jpg',
    size: 525633,
    type: 'image/jpeg',
    uid: 'rc-upload-1510220017186-2',
    webkitRelativePath: '',
  }; */

class FileUploadModel {
  @observable fileList = [];
  @observable uploading = false;
}

@observer
class FileUpload extends Component {
  static propTypes = {
    options: PropTypes.object, // options refs to https://www.npmjs.com/package/react-fileupload
    buttonType: PropTypes.oneOf(['primary', 'default']),
    text: PropTypes.string,
    className: PropTypes.string,
    autoUpload: PropTypes.bool,
    formDatas: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        value: PropTypes.string,
      })
    ), // change the commit prop if caller wants to handleUpload
    chooseFile: PropTypes.func,
    callback: PropTypes.func, // this callback function will be called when the upload finish, whether success or not
    isFileListDisplay: PropTypes.bool,
    clearFileListTrigger: PropTypes.bool,
  };

  static defaultProps = {
    options: {
      action: ACTION_URL,
    },
    buttonType: 'primary',
    text: '浏览文件',
    autoUpload: false,
    chooseFile: file => {
      console.log(file);
    },
    callback: (status, fileNames, message) => {},
    isFileListDisplay: false,
  };

  constructor(props) {
    super();
    this.model = new FileUploadModel();
    this.defaultOptions = {
      action: props.options.action,
      beforeUpload: file => {
        this.model.fileList = [file];
        // callback executed when file choosed
        this.props.chooseFile(file);
        return props.autoUpload;
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    const formDatas = toJS(nextProps.formDatas);

    if (formDatas.length > 0) {
      this.handleUpload(formDatas);
    }

    if (nextProps.clearFileListTrigger !== this.props.clearFileListTrigger) {
      this.model.fileList = [];
    }
  }

  request = async (url, formData, props, model) => {
    const csrfToken = await http.getCsrfToken();

    reqwest({
      url,
      method: 'post',
      processData: false,
      data: formData,
      type: 'json',
      headers: {
        'X-CSRF-TOKEN': csrfToken,
      },
      success: response => {
        model.uploading = false;
        props.callback(true, model.fileList, 'upload success.');
        model.fileList = [];
      },
      error: () => {
        model.uploading = false;
        props.callback(false, model.fileList, 'upload failed.');
      },
    });
  };

  handleUpload = newFormDatas => {
    const { fileList } = this.model;
    const formData = new FormData();

    const addFormData = (fData, newFData) => {
      newFData.forEach(item => {
        fData.append(item.name, item.value);
      });
    };

    fileList.forEach(file => {
      formData.append(FORM_FILES_NAME, file);
      addFormData(formData, newFormDatas);
    });

    this.model.uploading = true;

    this.request(this.props.options.action, formData, this.props, this.model);
  };

  render() {
    const options = _.assign({}, this.defaultOptions, this.props.options);
    if (!this.props.isFileListDisplay) {
      options.fileList = [];
    }
    return (
      <Upload {...options}>
        <Button
          type={this.props.buttonType}
          className={`${cx('button')} ${this.props.className}`}
        >
          {this.props.text}
        </Button>
      </Upload>
    );
  }
}

export default FileUpload;
