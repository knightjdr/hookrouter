"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useQueryParams = exports.getQueryParams = exports.setQueryParams = void 0;

var _react = _interopRequireDefault(require("react"));

var _isNode = _interopRequireDefault(require("./isNode"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var queryParamListeners = [];
var queryParamObject = {};

var setQueryParams = function setQueryParams(inObj) {
  var replace = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (!(inObj instanceof Object)) {
    throw new Error('Object required');
  }

  if (replace) {
    queryParamObject = inObj;
  } else {
    Object.assign(queryParamObject, inObj);
  }

  var now = Date.now();
  queryParamListeners.forEach(function (cb) {
    return cb(now);
  });

  if (!_isNode.default) {
    var qs = '?' + objectToQueryString(queryParamObject);

    if (qs === location.search) {
      return;
    }

    history.replaceState(null, null, location.pathname + (qs !== '?' ? qs : ''));
  }
};

exports.setQueryParams = setQueryParams;

var getQueryParams = function getQueryParams() {
  return Object.assign({}, queryParamObject);
};
/**
 * This takes an URL query string and converts it into a javascript object.
 * @param {string} inStr
 * @return {object}
 */


exports.getQueryParams = getQueryParams;

var queryStringToObject = function queryStringToObject(inStr) {
  var p = new URLSearchParams(inStr);
  var result = {};
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = p[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var param = _step.value;
      result[param[0]] = param[1];
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return result;
};
/**
 * This takes a javascript object and turns it into a URL query string.
 * @param {object} inObj
 * @return {string}
 */


var objectToQueryString = function objectToQueryString(inObj) {
  var qs = new URLSearchParams();
  Object.entries(inObj).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        value = _ref2[1];

    return value !== undefined ? qs.append(key, value) : null;
  });
  return qs.toString();
};

if (!_isNode.default) {
  queryParamObject = queryStringToObject(location.search.substr(1));
}
/**
 * This hook returns the currently set query parameters as object and offers a setter function
 * to set a new query string.
 *
 * All components that are hooked to the query parameters will get updated if they change.
 * Query params can also be updated along with the path, by calling `navigate(url, queryParams)`.
 *
 * @returns {array} [queryParamObject, setQueryParams]
 */


var useQueryParams = function useQueryParams() {
  var setUpdate = _react.default.useState(0)[1];

  _react.default.useEffect(function () {
    queryParamListeners.push(setUpdate);
    return function () {
      var index = queryParamListeners.indexOf(setUpdate);

      if (index === -1) {
        return;
      }

      queryParamListeners.splice(index, 1);
    };
  }, [setUpdate]);

  return [queryParamObject, setQueryParams];
};

exports.useQueryParams = useQueryParams;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9xdWVyeVBhcmFtcy5qcyJdLCJuYW1lcyI6WyJxdWVyeVBhcmFtTGlzdGVuZXJzIiwicXVlcnlQYXJhbU9iamVjdCIsInNldFF1ZXJ5UGFyYW1zIiwiaW5PYmoiLCJyZXBsYWNlIiwiT2JqZWN0IiwiRXJyb3IiLCJhc3NpZ24iLCJub3ciLCJEYXRlIiwiZm9yRWFjaCIsImNiIiwiaXNOb2RlIiwicXMiLCJvYmplY3RUb1F1ZXJ5U3RyaW5nIiwibG9jYXRpb24iLCJzZWFyY2giLCJoaXN0b3J5IiwicmVwbGFjZVN0YXRlIiwicGF0aG5hbWUiLCJnZXRRdWVyeVBhcmFtcyIsInF1ZXJ5U3RyaW5nVG9PYmplY3QiLCJpblN0ciIsInAiLCJVUkxTZWFyY2hQYXJhbXMiLCJyZXN1bHQiLCJwYXJhbSIsImVudHJpZXMiLCJrZXkiLCJ2YWx1ZSIsInVuZGVmaW5lZCIsImFwcGVuZCIsInRvU3RyaW5nIiwic3Vic3RyIiwidXNlUXVlcnlQYXJhbXMiLCJzZXRVcGRhdGUiLCJSZWFjdCIsInVzZVN0YXRlIiwidXNlRWZmZWN0IiwicHVzaCIsImluZGV4IiwiaW5kZXhPZiIsInNwbGljZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxtQkFBbUIsR0FBRyxFQUE1QjtBQUNBLElBQUlDLGdCQUFnQixHQUFHLEVBQXZCOztBQUVPLElBQU1DLGNBQWMsR0FBRyxTQUFqQkEsY0FBaUIsQ0FBQ0MsS0FBRCxFQUE0QjtBQUFBLE1BQXBCQyxPQUFvQix1RUFBVixLQUFVOztBQUN6RCxNQUFHLEVBQUVELEtBQUssWUFBWUUsTUFBbkIsQ0FBSCxFQUE4QjtBQUM3QixVQUFNLElBQUlDLEtBQUosQ0FBVSxpQkFBVixDQUFOO0FBQ0E7O0FBQ0QsTUFBR0YsT0FBSCxFQUFXO0FBQ1ZILElBQUFBLGdCQUFnQixHQUFHRSxLQUFuQjtBQUNBLEdBRkQsTUFFTztBQUNORSxJQUFBQSxNQUFNLENBQUNFLE1BQVAsQ0FBY04sZ0JB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LG1CQUFtQixDQUFDMEMsTUFBcEIsQ0FBMkJGLEtBQTNCLEVBQWtDLENBQWxDO0FBQ0EsS0FORDtBQU9BLEdBVkQsRUFVRyxDQUFDTCxTQUFELENBVkg7O0FBWUEsU0FBTyxDQUFDbEMsZ0JBQUQsRUFBbUJDLGNBQW5CLENBQVA7QUFDQSxDQWhCTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgaXNOb2RlIGZyb20gJy4vaXNOb2RlJztcblxuY29uc3QgcXVlcnlQYXJhbUxpc3RlbmVycyA9IFtdO1xubGV0IHF1ZXJ5UGFyYW1PYmplY3QgPSB7fTtcblxuZXhwb3J0IGNvbnN0IHNldFF1ZXJ5UGFyYW1zID0gKGluT2JqLCByZXBsYWNlID0gZmFsc2UpID0+IHtcblx0aWYoIShpbk9iaiBpbnN0YW5jZW9mIE9iamVjdCkpe1xuXHRcdHRocm93IG5ldyBFcnJvcignT2JqZWN0IHJlcXVpcmVkJyk7XG5cdH1cblx0aWYocmVwbGFjZSl7XG5cdFx0cXVlcnlQYXJhbU9iamVjdCA9IGluT2JqO1xuXHR9IGVsc2Uge1xuXHRcdE9iamVjdC5hc3NpZ24ocXVlcnlQYXJhbU9iamVjdCwgaW5PYmopO1xuXHR9XG5cdGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG5cdHF1ZXJ5UGFyYW1MaXN0ZW5lcnMuZm9yRWFjaChjYiA9PiBjYihub3cpKTtcblx0aWYgKCFpc05vZGUpIHtcblx0XHRjb25zdCBxcyA9ICc/JyArIG9iamVjdFRvUXVlcnlTdHJpbmcocXVlcnlQYXJhbU9iamVjdCk7XG5cdFx0aWYocXMgPT09IGxvY2F0aW9uLnNlYXJjaCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRoaXN0b3J5LnJlcGxhY2VTdGF0ZShudWxsLCBudWxsLCBsb2NhdGlvbi5wYXRobmFtZSArIChxcyAhPT0gJz8nID8gcXMgOiAnJykpO1xuXHR9XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0UXVlcnlQYXJhbXMgPSAoKSA9PiBPYmplY3QuYXNzaWduKHt9LCBxdWVyeVBhcmFtT2JqZWN0KTtcblxuLyoqXG4gKiBUaGlzIHRha2VzIGFuIFVSTCBxdWVyeSBzdHJpbmcgYW5kIGNvbnZlcnRzIGl0IGludG8gYSBqYXZhc2NyaXB0IG9iamVjdC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBpblN0clxuICogQHJldHVybiB7b2JqZWN0fVxuICovXG5jb25zdCBxdWVyeVN0cmluZ1RvT2JqZWN0ID0gKGluU3RyKSA9PiB7XG5cdGNvbnN0IHAgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKGluU3RyKTtcblx0bGV0IHJlc3VsdCA9IHt9O1xuXHRmb3IgKGxldCBwYXJhbSBvZiBwKSB7XG5cdFx0cmVzdWx0W3BhcmFtWzBdXSA9IHBhcmFtWzFdO1xuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59O1xuXG4vKipcbiAqIFRoaXMgdGFrZXMgYSBqYXZhc2NyaXB0IG9iamVjdCBhbmQgdHVybnMgaXQgaW50byBhIFVSTCBxdWVyeSBzdHJpbmcuXG4gKiBAcGFyYW0ge29iamVjdH0gaW5PYmpcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuY29uc3Qgb2JqZWN0VG9RdWVyeVN0cmluZyA9IChpbk9iaikgPT4ge1xuXHRjb25zdCBxcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoKTtcblx0T2JqZWN0LmVudHJpZXMoaW5PYmopLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4gdmFsdWUgIT09IHVuZGVmaW5lZCA/IHFzLmFwcGVuZChrZXksIHZhbHVlKSA6IG51bGwpO1xuXHRyZXR1cm4gcXMudG9TdHJpbmcoKTtcbn07XG5cbmlmKCFpc05vZGUpe1xuXHRxdWVyeVBhcmFtT2JqZWN0ID0gcXVlcnlTdHJpbmdUb09iamVjdChsb2NhdGlvbi5zZWFyY2guc3Vic3RyKDEpKTtcbn1cblxuLyoqXG4gKiBUaGlzIGhvb2sgcmV0dXJucyB0aGUgY3VycmVudGx5IHNldCBxdWVyeSBwYXJhbWV0ZXJzIGFzIG9iamVjdCBhbmQgb2ZmZXJzIGEgc2V0dGVyIGZ1bmN0aW9uXG4gKiB0byBzZXQgYSBuZXcgcXVlcnkgc3RyaW5nLlxuICpcbiAqIEFsbCBjb21wb25lbnRzIHRoYXQgYXJlIGhvb2tlZCB0byB0aGUgcXVlcnkgcGFyYW1ldGVycyB3aWxsIGdldCB1cGRhdGVkIGlmIHRoZXkgY2hhbmdlLlxuICogUXVlcnkgcGFyYW1zIGNhbiBhbHNvIGJlIHVwZGF0ZWQgYWxvbmcgd2l0aCB0aGUgcGF0aCwgYnkgY2FsbGluZyBgbmF2aWdhdGUodXJsLCBxdWVyeVBhcmFtcylgLlxuICpcbiAqIEByZXR1cm5zIHthcnJheX0gW3F1ZXJ5UGFyYW1PYmplY3QsIHNldFF1ZXJ5UGFyYW1zXVxuICovXG5leHBvcnQgY29uc3QgdXNlUXVlcnlQYXJhbXMgPSAoKSA9PiB7XG5cdGNvbnN0IHNldFVwZGF0ZSA9IFJlYWN0LnVzZVN0YXRlKDApWzFdO1xuXG5cdFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG5cdFx0cXVlcnlQYXJhbUxpc3RlbmVycy5wdXNoKHNldFVwZGF0ZSk7XG5cblx0XHRyZXR1cm4gKCkgPT4ge1xuXHRcdFx0Y29uc3QgaW5kZXggPSBxdWVyeVBhcmFtTGlzdGVuZXJzLmluZGV4T2Yoc2V0VXBkYXRlKTtcblx0XHRcdGlmIChpbmRleCA9PT0gLTEpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0cXVlcnlQYXJhbUxpc3RlbmVycy5zcGxpY2UoaW5kZXgsIDEpO1xuXHRcdH07XG5cdH0sIFtzZXRVcGRhdGVdKTtcblxuXHRyZXR1cm4gW3F1ZXJ5UGFyYW1PYmplY3QsIHNldFF1ZXJ5UGFyYW1zXTtcbn07XG4iXX0=