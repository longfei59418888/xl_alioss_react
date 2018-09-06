"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _isomorphicFetch = require("isomorphic-fetch");

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Main = function (_React$Component) {
    _inherits(Main, _React$Component);

    function Main() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, Main);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Main.__proto__ || Object.getPrototypeOf(Main)).call.apply(_ref, [this].concat(args))), _this), _this.clickUpload = function () {
            var input = document.createElement('input');
            var inputBox = document.createElement('div');
            input.setAttribute('type', 'file');
            input.onchange = function (e) {
                _this.doUpload();
            };
            inputBox.style.height = 0;
            inputBox.style.overflow = 'hidden';
            inputBox.appendChild(input);
            document.body.appendChild(inputBox);
            _this.input = input;
            _this.inputBox = inputBox;
            input.click();
        }, _this.doUpload = function () {
            var file = _this.input.files[0];
            var _this$props = _this.props,
                url = _this$props.url,
                upload = _this$props.upload;

            _this.inputBox.parentNode.removeChild(_this.inputBox);
            _this.input = null;
            _this.inputBox = null;
            getAliOssInfo(url).then(function (rst) {
                if (upload) {
                    upload(rst, file, _this.upLoadAlioss);
                    return;
                }
                _this.upLoadAlioss(Object.assign({}, rst, { file: file }));
            });
        }, _this.upLoadAlioss = function (options) {
            var file = options.file;
            var curDate = new FormData();
            var key = options.dir + new Date().getTime() + '_' + options.file.name;
            curDate.append("OSSAccessKeyId", options.accessid);
            curDate.append("policy", options.policy);
            curDate.append("Signature", options.signature);
            curDate.append("key", key);
            curDate.append("success_action_status", '200');
            curDate.append('file', file);
            return (0, _isomorphicFetch2.default)(options.host, {
                method: 'post',
                body: curDate
            }).then(function () {
                _this.props.uploadEnd(options.host + '/' + key);
            }).catch(function (err) {
                _this.props.uploadEnd(false);
            });
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(Main, [{
        key: "render",
        value: function render() {
            var children = this.props.children;

            return _react2.default.createElement(
                "div",
                { className: "react-alioss-upload-box" },
                _react2.default.createElement(
                    "div",
                    { onClick: this.clickUpload },
                    children
                )
            );
        }
    }]);

    return Main;
}(_react2.default.Component);

exports.default = Main;


function getAliOssInfo(url) {
    return (0, _isomorphicFetch2.default)(url, {
        credentials: 'include'
    }).then(function (rst) {
        return rst.json();
    }).catch(function (err) {
        return false;
    });
}
