"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useRoutes = exports.getWorkingPath = exports.usePath = exports.getPath = exports.setPath = exports.navigate = exports.ParentContext = exports.getBasepath = exports.setBasepath = void 0;

var _react = _interopRequireDefault(require("react"));

var _isNode = _interopRequireDefault(require("./isNode"));

var _queryParams = require("./queryParams");

var _interceptor = require("./interceptor");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var preparedRoutes = {};
var stack = {};
var componentId = 1;
var currentPath = _isNode.default ? '' : location.pathname;
var basePath = '';
var basePathRegEx = null;
var pathUpdaters = [];
/**
 * Will define a base path that will be utilized in your routing and navigation.
 * To be called _before_ any routing or navigation happens.
 * @param {string} inBasepath
 */

var setBasepath = function setBasepath(inBasepath) {
  basePath = inBasepath;
  basePathRegEx = new RegExp('^' + basePath);
};
/**
 * Returns the currently used base path.
 * @returns {string}
 */


exports.setBasepath = setBasepath;

var getBasepath = function getBasepath() {
  return basePath;
};

exports.getBasepath = getBasepath;

var resolvePath = function resolvePath(inPath) {
  if (_isNode.default) {
    var url = require('url');

    return url.resolve(currentPath, inPath);
  }

  var current = new URL(currentPath, location.href);
  var resolved = new URL(inPath, current);
  return resolved.pathname;
};

var ParentContext = _react.default.createContext(null);
/**
 * Pass a route string to this function to receive a regular expression.
 * The transformation will be cached and if you pass the same route a second
 * time, the cached regex will be returned.
 * @param {string} inRoute
 * @returns {Array} [RegExp, propList]
 */


exports.ParentContext = ParentContext;

var prepareRoute = function prepareRoute(inRoute) {
  if (preparedRoutes[inRoute]) {
    return preparedRoutes[inRoute];
  }

  var preparedRoute = [new RegExp("".concat(inRoute.substr(0, 1) === '*' ? '' : '^').concat(inRoute.replace(/:[a-zA-Z]+/g, '([^/]+)').replace(/\*/g, '')).concat(inRoute.substr(-1) === '*' ? '' : '$'))];
  var propList = inRoute.match(/:[a-zA-Z]+/g);
  preparedRoute.push(propList ? propList.map(function (paramName) {
    return paramName.substr(1);
  }) : []);
  preparedRoutes[inRoute] = preparedRoute;
  return preparedRoute;
};
/**
 * Virtually navigates the browser to the given URL and re-processes all routers.
 * @param {string} url The URL to navigate to. Do not mix adding GET params here and using the `getParams` argument.
 * @param {boolean} [replace=false] Should the navigation be done with a history replace to prevent back navigation by the user
 * @param {object} [queryParams] Key/Value pairs to convert into get parameters to be appended to the URL.
 * @param {boolean} [replaceQueryParams=true] Should existing query parameters be carried over, or dropped (replaced)?
 */


var navigate = function navigate(url) {
  var replace = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var queryParams = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var replaceQueryParams = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  url = (0, _interceptor.interceptRoute)(currentPath, resolvePath(url));

  if (!url || url === currentPath) {
    return;
  }

  currentPath = url;

  if (_isNode.default) {
    setPath(url);
    processStack();
    updatePathHooks();
    return;
  }

  var finalURL = basePathRegEx ? url.match(basePathRegEx) ? url : basePath + url : url;
  window.history["".concat(replace ? 'replace' : 'push', "State")](null, null, finalURL);
  processStack();
  updatePathHooks();

  if (queryParams) {
    (0, _queryParams.setQueryParams)(queryParams, replaceQueryParams);
  }
};

exports.navigate = navigate;
var customPath = '/';
/**
 * Enables you to manually set the path from outside in a nodeJS environment, where window.history is not available.
 * @param {string} inPath
 */

var setPath = function setPath(inPath) {
  var url = require('url');

  customPath = url.resolve(customPath, inPath);
};
/**
 * Returns the current path of the router.
 * @returns {string}
 */


exports.setPath = setPath;

var getPath = function getPath() {
  return customPath;
};
/**
 * This hook returns the currently used URI.
 * Works in a browser context as well as for SSR.
 *
 * _Heads up:_ This will make your component render on every navigation unless you set this hook to passive!
 * @param {boolean} [active=true] Will update the component upon path changes. Set to false to only retrieve the path, once.
 * @param {boolean} [withBasepath=false] Should the base path be left at the beginning of the URI?
 * @returns {string}
 */


exports.getPath = getPath;

var usePath = function usePath() {
  var active = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  var withBasepath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var _React$useState = _react.default.useState(0),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      setUpdate = _React$useState2[1];

  _react.default.useEffect(function () {
    if (!active) {
      return;
    }

    pathUpdaters.push(setUpdate);
    return function () {
      var index = pathUpdaters.indexOf(setUpdate);

      if (index !== -1) {
        pathUpdaters.splice(index, 1);
      }
    };
  }, [setUpdate]);

  return withBasepath ? currentPath : currentPath.replace(basePathRegEx, '');
};
/**
 * Render all components that use path hooks.
 */


exports.usePath = usePath;

var updatePathHooks = function updatePathHooks() {
  var now = Date.now();
  pathUpdaters.forEach(function (cb) {
    return cb(now);
  });
};
/**
 * Called from within the router. This returns either the current windows url path
 * or a already reduced path, if a parent router has already matched with a finishing
 * wildcard before.
 * @param {string} [parentRouterId]
 * @returns {string}
 */


var getWorkingPath = function getWorkingPath(parentRouterId) {
  if (!parentRouterId) {
    return _isNode.default ? customPath : window.location.pathname.replace(basePathRegEx, '') || '/';
  }

  var stackEntry = stack[parentRouterId];

  if (!stackEntry) {
    throw 'wth';
  }

  return stackEntry.reducedPath !== null ? stackEntry.reducedPath || '/' : window.location.pathname;
};

exports.getWorkingPath = getWorkingPath;

var processStack = function processStack() {
  return Object.values(stack).forEach(process);
};
/**
 * This function takes two objects and compares if they have the same
 * keys and their keys have the same values assigned, so the objects are
 * basically the same.
 * @param {object} objA
 * @param {object} objB
 * @return {boolean}
 */


var objectsEqual = function objectsEqual(objA, objB) {
  var objAKeys = Object.keys(objA);
  var objBKeys = Object.keys(objB);

  var valueIsEqual = function valueIsEqual(key) {
    return objB.hasOwnProperty(key) && objA[key] === objB[key];
  };

  return objAKeys.length === objBKeys.length && objAKeys.every(valueIsEqual);
};

if (!_isNode.default) {
  window.addEventListener('popstate', function (e) {
    var nextPath = (0, _interceptor.interceptRoute)(currentPath, location.pathname);

    if (!nextPath || nextPath === currentPath) {
      e.preventDefault();
      e.stopPropagation();
      history.pushState(null, null, currentPath);
      return;
    }

    currentPath = nextPath;

    if (nextPath !== location.pathname) {
      history.replaceState(null, null, nextPath);
    }

    processStack();
    updatePathHooks();
  });
}

var emptyFunc = function emptyFunc() {
  return null;
};
/**
 * This will calculate the match of a given router.
 * @param {object} stackObj
 * @param {boolean} [directCall] If its not a direct call, the process function might trigger a component render.
 */


var process = function process(stackObj, directCall) {
  var routerId = stackObj.routerId,
      parentRouterId = stackObj.parentRouterId,
      routes = stackObj.routes,
      setUpdate = stackObj.setUpdate,
      resultFunc = stackObj.resultFunc,
      resultProps = stackObj.resultProps,
      previousReducedPath = stackObj.reducedPath;
  var currentPath = getWorkingPath(parentRouterId);
  var route = null;
  var targetFunction = null;
  var targetProps = null;
  var reducedPath = null;
  var anyMatched = false;

  for (var i = 0; i < routes.length; i++) {
    var _routes$i = _slicedToArray(routes[i], 2);

    route = _routes$i[0];
    targetFunction = _routes$i[1];

    var _ref = preparedRoutes[route] ? preparedRoutes[route] : prepareRoute(route),
        _ref2 = _slicedToArray(_ref, 2),
        regex = _ref2[0],
        groupNames = _ref2[1];

    var _result = currentPath.match(regex);

    if (!_result) {
      targetFunction = emptyFunc;
      continue;
    }

    if (groupNames.length) {
      targetProps = {};

      for (var j = 0; j < groupNames.length; j++) {
        targetProps[groupNames[j]] = _result[j + 1];
      }
    }

    reducedPath = currentPath.replace(_result[0], '');
    anyMatched = true;
    break;
  }

  if (!stack[routerId]) {
    return;
  }

  if (!anyMatched) {
    route = null;
    targetFunction = null;
    targetProps = null;
    reducedPath = null;
  }

  var funcsDiffer = resultFunc !== targetFunction;
  var pathDiffer = reducedPath !== previousReducedPath;
  var propsDiffer = true;

  if (!funcsDiffer) {
    if (!resultProps && !targetProps) {
      propsDiffer = false;
    } else {
      propsDiffer = !(resultProps && targetProps && objectsEqual(resultProps, targetProps) === true);
    }

    if (!propsDiffer) {
      if (!pathDiffer) {
        return;
      }
    }
  }

  var result = funcsDiffer || propsDiffer ? targetFunction ? targetFunction(targetProps) : null : stackObj.result;
  Object.assign(stack[routerId], {
    result: result,
    reducedPath: reducedPath,
    matchedRoute: route,
    passContext: route ? route.substr(-1) === '*' : false
  });

  if (!directCall && (funcsDiffer || propsDiffer || route === null)) {
    setUpdate(Date.now());
  }
};
/**
 * If a route returns a function, instead of a react element, we need to wrap this function
 * to eventually wrap a context object around its result.
 * @param RouteContext
 * @param originalResult
 * @returns {function(): *}
 */


var wrapperFunction = function wrapperFunction(RouteContext, originalResult) {
  return function () {
    return _react.default.createElement(RouteContext, null, originalResult.apply(originalResult, arguments));
  };
};
/**
 * Pass an object to this function where the keys are routes and the values
 * are functions to be executed when a route matches. Whatever your function returns
 * will be returned from the hook as well into your react component. Ideally you would
 * return components to be rendered when certain routes match, but you are not limited
 * to that.
 * @param {object} routeObj {"/someRoute": () => <Example />}
 */


var useRoutes = function useRoutes(routeObj) {
  // Each router gets an internal id to look them up again.
  var _React$useState3 = _react.default.useState(componentId),
      _React$useState4 = _slicedToArray(_React$useState3, 1),
      routerId = _React$useState4[0];

  var setUpdate = _react.default.useState(0)[1]; // Needed to create nested routers which use only a subset of the URL.


  var parentRouterId = _react.default.useContext(ParentContext); // If we just took the last ID, increase it for the next hook.


  if (routerId === componentId) {
    componentId += 1;
  } // Removes the router from the stack after component unmount - it won't be processed anymore.


  _react.default.useEffect(function () {
    return function () {
      return delete stack[routerId];
    };
  }, [routerId]);

  var stackObj = stack[routerId];

  if (stackObj && stackObj.originalRouteObj !== routeObj) {
    stackObj = null;
  }

  if (!stackObj) {
    stackObj = {
      routerId: routerId,
      originalRouteObj: routeObj,
      routes: Object.entries(routeObj),
      setUpdate: setUpdate,
      parentRouterId: parentRouterId,
      matchedRoute: null,
      reducedPath: null,
      passContext: false,
      result: null
    };
    stack[routerId] = stackObj;
    process(stackObj, true);
  }

  _react.default.useDebugValue(stackObj.matchedRoute);

  if (!stackObj.matchedRoute) {
    return null;
  }

  var result = stackObj.result;

  if (!stackObj.passContext) {
    return result;
  } else {
    var RouteContext = function RouteContext(_ref3) {
      var children = _ref3.children;
      return _react.default.createElement(ParentContext.Provider, {
        value: routerId
      }, children);
    };

    if (typeof result === 'function') {
      return wrapperFunction(RouteContext, result);
    }

    return _react.default.isValidElement(result) && result.type !== RouteContext ? _react.default.createElement(RouteContext, null, result) : result;
  }
};

exports.useRoutes = useRoutes;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9yb3V0ZXIuanMiXSwibmFtZXMiOlsicHJlcGFyZWRSb3V0ZXMiLCJzdGFjayIsImNvbXBvbmVudElkIiwiY3VycmVudFBhdGgiLCJpc05vZGUiLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwiYmFzZVBhdGgiLCJiYXNlUGF0aFJlZ0V4IiwicGF0aFVwZGF0ZXJzIiwic2V0QmFzZXBhdGgiLCJpbkJhc2VwYXRoIiwiUmVnRXhwIiwiZ2V0QmFzZXBhdGgiLCJyZXNvbHZlUGF0aCIsImluUGF0aCIsInVybCIsInJlcXVpcmUiLCJyZXNvbHZlIiwiY3VycmVudCIsIlVSTCIsImhyZWYiLCJyZXNvbHZlZCIsIlBhcmVudENvbnRleHQiLCJSZWFjdCIsImNyZWF0ZUNvbnRleHQiLCJwcmVwYXJlUm91dGUiLCJpblJvdXRlIiwicHJlcGFyZWRSb3V0ZSIsInN1YnN0ciIsInJlcGxhY2UiLCJwcm9wTGlzdCIsIm1hdGNoIiwicHVzaCIsIm1hcCIsInBhcmFtTmFtZSIsIm5hdmlnYXRlIiwicXVlcnlQYXJhbXMiLCJyZXBsYWNlUXVlcnlQYXJhbXMiLCJzZXRQYXRoIiwicHJvY2Vzc1N0YWNrIiwidXBkYXRlUGF0aEhvb2tzIiwiZmluYWxVUkwiLCJ3aW5kb3ciLCJoaXN0b3J5IiwiY3VzdG9tUGF0aCIsImdldFBhdGgiLCJ1c2VQYXRoIiwiYWN0aXZlIiwid2l0aEJhc2VwYXRoIiwidXNlU3RhdGUiLCJzZXRVcGRhdGUiLCJ1c2VFZmZlY3QiLCJpbmRleCIsImluZGV4T2YiLCJzcGxpY2UiLCJub3ciLCJEYXRlIiwiZm9yRWFjaCIsImNiIiwiZ2V0V29ya2luZ1BhdGgiLCJwYXJlbnRSb3V0ZXJJZCIsInN0YWNrRW50cnkiLCJyZWR1Y2VkUGF0aCIsIk9iamVjdCIsInZhbHVlcyIsInByb2Nlc3MiLCJvYmplY3RzRXF1YWwiLCJvYmpBIiwib2JqQiIsIm9iakFLZXlzIiwia2V5cyIsIm9iakJLZXlzIiwidmFsdWVJc0VxdWFsIiwia2V5IiwiaGFzT3duUHJvcGVydHkiLCJsZW5ndGgiLCJldmVyeSIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwibmV4dFBhdGgiLCJwcmV2ZW50RGVmYXVsdCIsInN0b3BQcm9wYWdhdGlvbiIsInB1c2hTdGF0ZSIsInJlcGxhY2VTdGF0ZSIsImVtcHR5RnVuYyIsInN0YWNrT2JqIiwiZGlyZWN0Q2FsbCIsInJvdXRlcklkIiwicm91dGVzIiwicmVzdWx0RnVuYyIsInJlc3VsdFByb3BzIiwicHJldmlvdXNSZWR1Y2VkUGF0aCIsInJvdXRlIiwidGFyZ2V0RnVuY3Rpb24iLCJ0YXJnZXRQcm9wcyIsImFueU1hdGNoZWQiLCJpIiwicmVnZXgiLCJncm91cE5hbWVzIiwicmVzdWx0IiwiaiIsImZ1bmNzRGlmZmVyIiwicGF0aERpZmZlciIsInByb3BzRGlmZmVyIiwiYXNzaWduIiwibWF0Y2hlZFJvdXRlIiwicGFzc0NvbnRleHQiLCJ3cmFwcGVyRnVuY3Rpb24iLCJSb3V0ZUNvbnRleHQiLCJvcmlnaW5hbFJlc3VsdCIsImFwcGx5IiwiYXJndW1lbnRzIiwidXNlUm91dGVzIiwicm91dGVPYmoiLCJ1c2VDb250ZXh0Iiwib3JpZ2luYWxSb3V0ZU9iaiIsImVudHJpZXMiLCJ1c2VEZWJ1Z1ZhbHVlIiwiY2hpbGRyZW4iLCJpc1ZhbGlkRWxlbWVudCIsInR5cGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUEsSUFBSUEsY0FBYyxHQUFHLEVBQXJCO0FBQ0EsSUFBSUMsS0FBSyxHQUFHLEVBQVo7QUFDQSxJQUFJQyxXQUFXLEdBQUcsQ0FBbEI7QUFDQSxJQUFJQyxXQUFXLEdBQUdDLGtCQUFTLEVBQVQsR0FBY0MsUUFBUSxDQUFDQyxRQUF6QztBQUNBLElBQUlDLFFBQVEsR0FBRyxFQUFmO0FBQ0EsSUFBSUMsYUFBYSxHQUFHLElBQXBCO0FBQ0EsSUFBTUMsWUFBWSxHQUFHLEVBQXJCO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDTyxJQUFNQyxXQUFXLEdBQUcsU0FB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QSxVQUFFVSxRQUFGLFNBQUVBLFFBQUY7QUFBQSxhQUFnQiw2QkFBQyxhQUFELENBQWUsUUFBZjtBQUF3QixRQUFBLEtBQUssRUFBRS9CO0FBQS9CLFNBQTBDK0IsUUFBMUMsQ0FBaEI7QUFBQSxLQUFyQjs7QUFFQSxRQUFJLE9BQU9uQixNQUFQLEtBQWtCLFVBQXRCLEVBQWtDO0FBQ2pDLGFBQU9RLGVBQWUsQ0FBQ0MsWUFBRCxFQUFlVCxNQUFmLENBQXRCO0FBQ0E7O0FBRUQsV0FBTzVFLGVBQU1nRyxjQUFOLENBQXFCcEIsTUFBckIsS0FBZ0NBLE1BQU0sQ0FBQ3FCLElBQVAsS0FBZ0JaLFlBQWhELEdBQ0osNkJBQUMsWUFBRCxRQUFlVCxNQUFmLENBREksR0FFSkEsTUFGSDtBQUdBO0FBQ0QsQ0E1RE0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IGlzTm9kZSBmcm9tICcuL2lzTm9kZSc7XG5pbXBvcnQge3NldFF1ZXJ5UGFyYW1zfSBmcm9tICcuL3F1ZXJ5UGFyYW1zJztcbmltcG9ydCB7aW50ZXJjZXB0Um91dGV9IGZyb20gJy4vaW50ZXJjZXB0b3InO1xuXG5sZXQgcHJlcGFyZWRSb3V0ZXMgPSB7fTtcbmxldCBzdGFjayA9IHt9O1xubGV0IGNvbXBvbmVudElkID0gMTtcbmxldCBjdXJyZW50UGF0aCA9IGlzTm9kZSA/ICcnIDogbG9jYXRpb24ucGF0aG5hbWU7XG5sZXQgYmFzZVBhdGggPSAnJztcbmxldCBiYXNlUGF0aFJlZ0V4ID0gbnVsbDtcbmNvbnN0IHBhdGhVcGRhdGVycyA9IFtdO1xuXG4vKipcbiAqIFdpbGwgZGVmaW5lIGEgYmFzZSBwYXRoIHRoYXQgd2lsbCBiZSB1dGlsaXplZCBpbiB5b3VyIHJvdXRpbmcgYW5kIG5hdmlnYXRpb24uXG4gKiBUbyBiZSBjYWxsZWQgX2JlZm9yZV8gYW55IHJvdXRpbmcgb3IgbmF2aWdhdGlvbiBoYXBwZW5zLlxuICogQHBhcmFtIHtzdHJpbmd9IGluQmFzZXBhdGhcbiAqL1xuZXhwb3J0IGNvbnN0IHNldEJhc2VwYXRoID0gKGluQmFzZXBhdGgpID0+IHtcblx0YmFzZVBhdGggPSBpbkJhc2VwYXRoO1xuXHRiYXNlUGF0aFJlZ0V4ID0gbmV3IFJlZ0V4cCgnXicgKyBiYXNlUGF0aCk7XG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIGN1cnJlbnRseSB1c2VkIGJhc2UgcGF0aC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBjb25zdCBnZXRCYXNlcGF0aCA9ICgpID0+IGJhc2VQYXRoO1xuXG5jb25zdCByZXNvbHZlUGF0aCA9IChpblBhdGgpID0+IHtcblx0aWYgKGlzTm9kZSkge1xuXHRcdGNvbnN0IHVybCA9IHJlcXVpcmUoJ3VybCcpO1xuXHRcdHJldHVybiB1cmwucmVzb2x2ZShjdXJyZW50UGF0aCwgaW5QYXRoKTtcblx0fVxuXG5cdGNvbnN0IGN1cnJlbnQgPSBuZXcgVVJMKGN1cnJlbnRQYXRoLCBsb2NhdGlvbi5ocmVmKTtcblx0Y29uc3QgcmVzb2x2ZWQgPSBuZXcgVVJMKGluUGF0aCwgY3VycmVudCk7XG5cdHJldHVybiByZXNvbHZlZC5wYXRobmFtZTtcbn07XG5cbmV4cG9ydCBjb25zdCBQYXJlbnRDb250ZXh0ID0gUmVhY3QuY3JlYXRlQ29udGV4dChudWxsKTtcblxuLyoqXG4gKiBQYXNzIGEgcm91dGUgc3RyaW5nIHRvIHRoaXMgZnVuY3Rpb24gdG8gcmVjZWl2ZSBhIHJlZ3VsYXIgZXhwcmVzc2lvbi5cbiAqIFRoZSB0cmFuc2Zvcm1hdGlvbiB3aWxsIGJlIGNhY2hlZCBhbmQgaWYgeW91IHBhc3MgdGhlIHNhbWUgcm91dGUgYSBzZWNvbmRcbiAqIHRpbWUsIHRoZSBjYWNoZWQgcmVnZXggd2lsbCBiZSByZXR1cm5lZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBpblJvdXRlXG4gKiBAcmV0dXJucyB7QXJyYXl9IFtSZWdFeHAsIHByb3BMaXN0XVxuICovXG5jb25zdCBwcmVwYXJlUm91dGUgPSAoaW5Sb3V0ZSkgPT4ge1xuXHRpZiAocHJlcGFyZWRSb3V0ZXNbaW5Sb3V0ZV0pIHtcblx0XHRyZXR1cm4gcHJlcGFyZWRSb3V0ZXNbaW5Sb3V0ZV07XG5cdH1cblxuXHRjb25zdCBwcmVwYXJlZFJvdXRlID0gW1xuXHRcdG5ldyBSZWdFeHAoYCR7aW5Sb3V0ZS5zdWJzdHIoMCwgMSkgPT09ICcqJyA/ICcnIDogJ14nfSR7aW5Sb3V0ZS5yZXBsYWNlKC86W2EtekEtWl0rL2csICcoW14vXSspJykucmVwbGFjZSgvXFwqL2csICcnKX0ke2luUm91dGUuc3Vic3RyKC0xLCkgPT09ICcqJyA/ICcnIDogJyQnfWApXG5cdF07XG5cblx0Y29uc3QgcHJvcExpc3QgPSBpblJvdXRlLm1hdGNoKC86W2EtekEtWl0rL2cpO1xuXHRwcmVwYXJlZFJvdXRlLnB1c2goXG5cdFx0cHJvcExpc3Rcblx0XHRcdD8gcHJvcExpc3QubWFwKHBhcmFtTmFtZSA9PiBwYXJhbU5hbWUuc3Vic3RyKDEpKVxuXHRcdFx0OiBbXVxuXHQpO1xuXG5cdHByZXBhcmVkUm91dGVzW2luUm91dGVdID0gcHJlcGFyZWRSb3V0ZTtcblx0cmV0dXJuIHByZXBhcmVkUm91dGU7XG59O1xuXG4vKipcbiAqIFZpcnR1YWxseSBuYXZpZ2F0ZXMgdGhlIGJyb3dzZXIgdG8gdGhlIGdpdmVuIFVSTCBhbmQgcmUtcHJvY2Vzc2VzIGFsbCByb3V0ZXJzLlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCBUaGUgVVJMIHRvIG5hdmlnYXRlIHRvLiBEbyBub3QgbWl4IGFkZGluZyBHRVQgcGFyYW1zIGhlcmUgYW5kIHVzaW5nIHRoZSBgZ2V0UGFyYW1zYCBhcmd1bWVudC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW3JlcGxhY2U9ZmFsc2VdIFNob3VsZCB0aGUgbmF2aWdhdGlvbiBiZSBkb25lIHdpdGggYSBoaXN0b3J5IHJlcGxhY2UgdG8gcHJldmVudCBiYWNrIG5hdmlnYXRpb24gYnkgdGhlIHVzZXJcbiAqIEBwYXJhbSB7b2JqZWN0fSBbcXVlcnlQYXJhbXNdIEtleS9WYWx1ZSBwYWlycyB0byBjb252ZXJ0IGludG8gZ2V0IHBhcmFtZXRlcnMgdG8gYmUgYXBwZW5kZWQgdG8gdGhlIFVSTC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW3JlcGxhY2VRdWVyeVBhcmFtcz10cnVlXSBTaG91bGQgZXhpc3RpbmcgcXVlcnkgcGFyYW1ldGVycyBiZSBjYXJyaWVkIG92ZXIsIG9yIGRyb3BwZWQgKHJlcGxhY2VkKT9cbiAqL1xuZXhwb3J0IGNvbnN0IG5hdmlnYXRlID0gKHVybCwgcmVwbGFjZSA9IGZhbHNlLCBxdWVyeVBhcmFtcyA9IG51bGwsIHJlcGxhY2VRdWVyeVBhcmFtcyA9IHRydWUpID0+IHtcblx0dXJsID0gaW50ZXJjZXB0Um91dGUoY3VycmVudFBhdGgsIHJlc29sdmVQYXRoKHVybCkpO1xuXG5cdGlmICghdXJsIHx8IHVybCA9PT0gY3VycmVudFBhdGgpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRjdXJyZW50UGF0aCA9IHVybDtcblxuXHRpZiAoaXNOb2RlKSB7XG5cdFx0c2V0UGF0aCh1cmwpO1xuXHRcdHByb2Nlc3NTdGFjaygpO1xuXHRcdHVwZGF0ZVBhdGhIb29rcygpO1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGNvbnN0IGZpbmFsVVJMID0gYmFzZVBhdGhSZWdFeFxuXHRcdD8gdXJsLm1hdGNoKGJhc2VQYXRoUmVnRXgpXG5cdFx0XHQ/IHVybFxuXHRcdFx0OiBiYXNlUGF0aCArIHVybFxuXHRcdDpcblx0XHR1cmw7XG5cblx0d2luZG93Lmhpc3RvcnlbYCR7cmVwbGFjZSA/ICdyZXBsYWNlJyA6ICdwdXNoJ31TdGF0ZWBdKG51bGwsIG51bGwsIGZpbmFsVVJMKTtcblx0cHJvY2Vzc1N0YWNrKCk7XG5cdHVwZGF0ZVBhdGhIb29rcygpO1xuXG5cdGlmIChxdWVyeVBhcmFtcykge1xuXHRcdHNldFF1ZXJ5UGFyYW1zKHF1ZXJ5UGFyYW1zLCByZXBsYWNlUXVlcnlQYXJhbXMpO1xuXHR9XG59O1xuXG5sZXQgY3VzdG9tUGF0aCA9ICcvJztcbi8qKlxuICogRW5hYmxlcyB5b3UgdG8gbWFudWFsbHkgc2V0IHRoZSBwYXRoIGZyb20gb3V0c2lkZSBpbiBhIG5vZGVKUyBlbnZpcm9ubWVudCwgd2hlcmUgd2luZG93Lmhpc3RvcnkgaXMgbm90IGF2YWlsYWJsZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBpblBhdGhcbiAqL1xuZXhwb3J0IGNvbnN0IHNldFBhdGggPSAoaW5QYXRoKSA9PiB7XG5cdGNvbnN0IHVybCA9IHJlcXVpcmUoJ3VybCcpO1xuXHRjdXN0b21QYXRoID0gdXJsLnJlc29sdmUoY3VzdG9tUGF0aCwgaW5QYXRoKTtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgY3VycmVudCBwYXRoIG9mIHRoZSByb3V0ZXIuXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5leHBvcnQgY29uc3QgZ2V0UGF0aCA9ICgpID0+IGN1c3RvbVBhdGg7XG5cbi8qKlxuICogVGhpcyBob29rIHJldHVybnMgdGhlIGN1cnJlbnRseSB1c2VkIFVSSS5cbiAqIFdvcmtzIGluIGEgYnJvd3NlciBjb250ZXh0IGFzIHdlbGwgYXMgZm9yIFNTUi5cbiAqXG4gKiBfSGVhZHMgdXA6XyBUaGlzIHdpbGwgbWFrZSB5b3VyIGNvbXBvbmVudCByZW5kZXIgb24gZXZlcnkgbmF2aWdhdGlvbiB1bmxlc3MgeW91IHNldCB0aGlzIGhvb2sgdG8gcGFzc2l2ZSFcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2FjdGl2ZT10cnVlXSBXaWxsIHVwZGF0ZSB0aGUgY29tcG9uZW50IHVwb24gcGF0aCBjaGFuZ2VzLiBTZXQgdG8gZmFsc2UgdG8gb25seSByZXRyaWV2ZSB0aGUgcGF0aCwgb25jZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW3dpdGhCYXNlcGF0aD1mYWxzZV0gU2hvdWxkIHRoZSBiYXNlIHBhdGggYmUgbGVmdCBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBVUkk/XG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5leHBvcnQgY29uc3QgdXNlUGF0aCA9IChhY3RpdmUgPSB0cnVlLCB3aXRoQmFzZXBhdGggPSBmYWxzZSkgPT4ge1xuXHRjb25zdCBbLCBzZXRVcGRhdGVdID0gUmVhY3QudXNlU3RhdGUoMCk7XG5cblx0UmVhY3QudXNlRWZmZWN0KCgpID0+IHtcblx0XHRpZiAoIWFjdGl2ZSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHBhdGhVcGRhdGVycy5wdXNoKHNldFVwZGF0ZSk7XG5cdFx0cmV0dXJuICgpID0+IHtcblx0XHRcdGNvbnN0IGluZGV4ID0gcGF0aFVwZGF0ZXJzLmluZGV4T2Yoc2V0VXBkYXRlKTtcblx0XHRcdGlmIChpbmRleCAhPT0gLTEpIHtcblx0XHRcdFx0cGF0aFVwZGF0ZXJzLnNwbGljZShpbmRleCwgMSk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fSwgW3NldFVwZGF0ZV0pO1xuXG5cdHJldHVybiB3aXRoQmFzZXBhdGggPyBjdXJyZW50UGF0aCA6IGN1cnJlbnRQYXRoLnJlcGxhY2UoYmFzZVBhdGhSZWdFeCwgJycpO1xufTtcblxuLyoqXG4gKiBSZW5kZXIgYWxsIGNvbXBvbmVudHMgdGhhdCB1c2UgcGF0aCBob29rcy5cbiAqL1xuY29uc3QgdXBkYXRlUGF0aEhvb2tzID0gKCkgPT4ge1xuXHRjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuXHRwYXRoVXBkYXRlcnMuZm9yRWFjaChjYiA9PiBjYihub3cpKTtcbn07XG5cbi8qKlxuICogQ2FsbGVkIGZyb20gd2l0aGluIHRoZSByb3V0ZXIuIFRoaXMgcmV0dXJucyBlaXRoZXIgdGhlIGN1cnJlbnQgd2luZG93cyB1cmwgcGF0aFxuICogb3IgYSBhbHJlYWR5IHJlZHVjZWQgcGF0aCwgaWYgYSBwYXJlbnQgcm91dGVyIGhhcyBhbHJlYWR5IG1hdGNoZWQgd2l0aCBhIGZpbmlzaGluZ1xuICogd2lsZGNhcmQgYmVmb3JlLlxuICogQHBhcmFtIHtzdHJpbmd9IFtwYXJlbnRSb3V0ZXJJZF1cbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBjb25zdCBnZXRXb3JraW5nUGF0aCA9IChwYXJlbnRSb3V0ZXJJZCkgPT4ge1xuXHRpZiAoIXBhcmVudFJvdXRlcklkKSB7XG5cdFx0cmV0dXJuIGlzTm9kZSA/IGN1c3RvbVBhdGggOiB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUucmVwbGFjZShiYXNlUGF0aFJlZ0V4LCAnJykgfHwgJy8nO1xuXHR9XG5cdGNvbnN0IHN0YWNrRW50cnkgPSBzdGFja1twYXJlbnRSb3V0ZXJJZF07XG5cdGlmICghc3RhY2tFbnRyeSkge1xuXHRcdHRocm93ICd3dGgnO1xuXHR9XG5cblx0cmV0dXJuIHN0YWNrRW50cnkucmVkdWNlZFBhdGggIT09IG51bGwgPyBzdGFja0VudHJ5LnJlZHVjZWRQYXRoIHx8ICcvJyA6IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcbn07XG5cbmNvbnN0IHByb2Nlc3NTdGFjayA9ICgpID0+IE9iamVjdC52YWx1ZXMoc3RhY2spLmZvckVhY2gocHJvY2Vzcyk7XG5cbi8qKlxuICogVGhpcyBmdW5jdGlvbiB0YWtlcyB0d28gb2JqZWN0cyBhbmQgY29tcGFyZXMgaWYgdGhleSBoYXZlIHRoZSBzYW1lXG4gKiBrZXlzIGFuZCB0aGVpciBrZXlzIGhhdmUgdGhlIHNhbWUgdmFsdWVzIGFzc2lnbmVkLCBzbyB0aGUgb2JqZWN0cyBhcmVcbiAqIGJhc2ljYWxseSB0aGUgc2FtZS5cbiAqIEBwYXJhbSB7b2JqZWN0fSBvYmpBXG4gKiBAcGFyYW0ge29iamVjdH0gb2JqQlxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuY29uc3Qgb2JqZWN0c0VxdWFsID0gKG9iakEsIG9iakIpID0+IHtcblx0Y29uc3Qgb2JqQUtleXMgPSBPYmplY3Qua2V5cyhvYmpBKTtcblx0Y29uc3Qgb2JqQktleXMgPSBPYmplY3Qua2V5cyhvYmpCKTtcblxuXHRjb25zdCB2YWx1ZUlzRXF1YWwgPSBrZXkgPT4gb2JqQi5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIG9iakFba2V5XSA9PT0gb2JqQltrZXldO1xuXG5cdHJldHVybiAoXG5cdFx0b2JqQUtleXMubGVuZ3RoID09PSBvYmpCS2V5cy5sZW5ndGhcblx0XHQmJiBvYmpBS2V5cy5ldmVyeSh2YWx1ZUlzRXF1YWwpXG5cdCk7XG59O1xuXG5pZiAoIWlzTm9kZSkge1xuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCAoZSkgPT4ge1xuXHRcdGNvbnN0IG5leHRQYXRoID0gaW50ZXJjZXB0Um91dGUoY3VycmVudFBhdGgsIGxvY2F0aW9uLnBhdGhuYW1lKTtcblxuXHRcdGlmICghbmV4dFBhdGggfHwgbmV4dFBhdGggPT09IGN1cnJlbnRQYXRoKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUobnVsbCwgbnVsbCwgY3VycmVudFBhdGgpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGN1cnJlbnRQYXRoID0gbmV4dFBhdGg7XG5cblx0XHRpZiAobmV4dFBhdGggIT09IGxvY2F0aW9uLnBhdGhuYW1lKSB7XG5cdFx0XHRoaXN0b3J5LnJlcGxhY2VTdGF0ZShudWxsLCBudWxsLCBuZXh0UGF0aCk7XG5cdFx0fVxuXHRcdHByb2Nlc3NTdGFjaygpO1xuXHRcdHVwZGF0ZVBhdGhIb29rcygpO1xuXHR9KTtcbn1cblxuY29uc3QgZW1wdHlGdW5jID0gKCkgPT4gbnVsbDtcblxuLyoqXG4gKiBUaGlzIHdpbGwgY2FsY3VsYXRlIHRoZSBtYXRjaCBvZiBhIGdpdmVuIHJvdXRlci5cbiAqIEBwYXJhbSB7b2JqZWN0fSBzdGFja09ialxuICogQHBhcmFtIHtib29sZWFufSBbZGlyZWN0Q2FsbF0gSWYgaXRzIG5vdCBhIGRpcmVjdCBjYWxsLCB0aGUgcHJvY2VzcyBmdW5jdGlvbiBtaWdodCB0cmlnZ2VyIGEgY29tcG9uZW50IHJlbmRlci5cbiAqL1xuY29uc3QgcHJvY2VzcyA9IChzdGFja09iaiwgZGlyZWN0Q2FsbCkgPT4ge1xuXHRjb25zdCB7XG5cdFx0cm91dGVySWQsXG5cdFx0cGFyZW50Um91dGVySWQsXG5cdFx0cm91dGVzLFxuXHRcdHNldFVwZGF0ZSxcblx0XHRyZXN1bHRGdW5jLFxuXHRcdHJlc3VsdFByb3BzLFxuXHRcdHJlZHVjZWRQYXRoOiBwcmV2aW91c1JlZHVjZWRQYXRoXG5cdH0gPSBzdGFja09iajtcblxuXHRjb25zdCBjdXJyZW50UGF0aCA9IGdldFdvcmtpbmdQYXRoKHBhcmVudFJvdXRlcklkKTtcblx0bGV0IHJvdXRlID0gbnVsbDtcblx0bGV0IHRhcmdldEZ1bmN0aW9uID0gbnVsbDtcblx0bGV0IHRhcmdldFByb3BzID0gbnVsbDtcblx0bGV0IHJlZHVjZWRQYXRoID0gbnVsbDtcblx0bGV0IGFueU1hdGNoZWQgPSBmYWxzZTtcblxuXHRmb3IgKGxldCBpID0gMDsgaSA8IHJvdXRlcy5sZW5ndGg7IGkrKykge1xuXHRcdFtyb3V0ZSwgdGFyZ2V0RnVuY3Rpb25dID0gcm91dGVzW2ldO1xuXHRcdGNvbnN0IFtyZWdleCwgZ3JvdXBOYW1lc10gPSBwcmVwYXJlZFJvdXRlc1tyb3V0ZV1cblx0XHRcdD8gcHJlcGFyZWRSb3V0ZXNbcm91dGVdXG5cdFx0XHQ6IHByZXBhcmVSb3V0ZShyb3V0ZSk7XG5cblx0XHRjb25zdCByZXN1bHQgPSBjdXJyZW50UGF0aC5tYXRjaChyZWdleCk7XG5cdFx0aWYgKCFyZXN1bHQpIHtcblx0XHRcdHRhcmdldEZ1bmN0aW9uID0gZW1wdHlGdW5jO1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXG5cdFx0aWYgKGdyb3VwTmFtZXMubGVuZ3RoKSB7XG5cdFx0XHR0YXJnZXRQcm9wcyA9IHt9O1xuXHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCBncm91cE5hbWVzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdHRhcmdldFByb3BzW2dyb3VwTmFtZXNbal1dID0gcmVzdWx0W2ogKyAxXTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZWR1Y2VkUGF0aCA9IGN1cnJlbnRQYXRoLnJlcGxhY2UocmVzdWx0WzBdLCAnJyk7XG5cdFx0YW55TWF0Y2hlZCA9IHRydWU7XG5cdFx0YnJlYWs7XG5cdH1cblxuXHRpZiAoIXN0YWNrW3JvdXRlcklkXSkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGlmICghYW55TWF0Y2hlZCkge1xuXHRcdHJvdXRlID0gbnVsbDtcblx0XHR0YXJnZXRGdW5jdGlvbiA9IG51bGw7XG5cdFx0dGFyZ2V0UHJvcHMgPSBudWxsO1xuXHRcdHJlZHVjZWRQYXRoID0gbnVsbDtcblx0fVxuXG5cdGNvbnN0IGZ1bmNzRGlmZmVyID0gcmVzdWx0RnVuYyAhPT0gdGFyZ2V0RnVuY3Rpb247XG5cdGNvbnN0IHBhdGhEaWZmZXIgPSByZWR1Y2VkUGF0aCAhPT0gcHJldmlvdXNSZWR1Y2VkUGF0aDtcblx0bGV0IHByb3BzRGlmZmVyID0gdHJ1ZTtcblxuXHRpZiAoIWZ1bmNzRGlmZmVyKSB7XG5cdFx0aWYgKCFyZXN1bHRQcm9wcyAmJiAhdGFyZ2V0UHJvcHMpIHtcblx0XHRcdHByb3BzRGlmZmVyID0gZmFsc2U7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHByb3BzRGlmZmVyID0gIShyZXN1bHRQcm9wcyAmJiB0YXJnZXRQcm9wcyAmJiBvYmplY3RzRXF1YWwocmVzdWx0UHJvcHMsIHRhcmdldFByb3BzKSA9PT0gdHJ1ZSk7XG5cdFx0fVxuXG5cdFx0aWYgKCFwcm9wc0RpZmZlcikge1xuXHRcdFx0aWYgKCFwYXRoRGlmZmVyKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRjb25zdCByZXN1bHQgPSBmdW5jc0RpZmZlciB8fCBwcm9wc0RpZmZlclxuXHRcdD8gdGFyZ2V0RnVuY3Rpb25cblx0XHRcdD8gdGFyZ2V0RnVuY3Rpb24odGFyZ2V0UHJvcHMpXG5cdFx0XHQ6IG51bGxcblx0XHQ6IHN0YWNrT2JqLnJlc3VsdDtcblxuXHRPYmplY3QuYXNzaWduKHN0YWNrW3JvdXRlcklkXSwge1xuXHRcdHJlc3VsdCxcblx0XHRyZWR1Y2VkUGF0aCxcblx0XHRtYXRjaGVkUm91dGU6IHJvdXRlLFxuXHRcdHBhc3NDb250ZXh0OiByb3V0ZSA/IHJvdXRlLnN1YnN0cigtMSkgPT09ICcqJyA6IGZhbHNlXG5cdH0pO1xuXG5cdGlmICghZGlyZWN0Q2FsbCAmJiAoZnVuY3NEaWZmZXIgfHwgcHJvcHNEaWZmZXIgfHwgcm91dGUgPT09IG51bGwpKSB7XG5cdFx0c2V0VXBkYXRlKERhdGUubm93KCkpO1xuXHR9XG59O1xuXG4vKipcbiAqIElmIGEgcm91dGUgcmV0dXJucyBhIGZ1bmN0aW9uLCBpbnN0ZWFkIG9mIGEgcmVhY3QgZWxlbWVudCwgd2UgbmVlZCB0byB3cmFwIHRoaXMgZnVuY3Rpb25cbiAqIHRvIGV2ZW50dWFsbHkgd3JhcCBhIGNvbnRleHQgb2JqZWN0IGFyb3VuZCBpdHMgcmVzdWx0LlxuICogQHBhcmFtIFJvdXRlQ29udGV4dFxuICogQHBhcmFtIG9yaWdpbmFsUmVzdWx0XG4gKiBAcmV0dXJucyB7ZnVuY3Rpb24oKTogKn1cbiAqL1xuY29uc3Qgd3JhcHBlckZ1bmN0aW9uID0gKFJvdXRlQ29udGV4dCwgb3JpZ2luYWxSZXN1bHQpID0+IGZ1bmN0aW9uICgpe1xuXHRyZXR1cm4gKFxuXHRcdDxSb3V0ZUNvbnRleHQ+e29yaWdpbmFsUmVzdWx0LmFwcGx5KG9yaWdpbmFsUmVzdWx0LCBhcmd1bWVudHMpfTwvUm91dGVDb250ZXh0PlxuXHQpO1xufTtcblxuLyoqXG4gKiBQYXNzIGFuIG9iamVjdCB0byB0aGlzIGZ1bmN0aW9uIHdoZXJlIHRoZSBrZXlzIGFyZSByb3V0ZXMgYW5kIHRoZSB2YWx1ZXNcbiAqIGFyZSBmdW5jdGlvbnMgdG8gYmUgZXhlY3V0ZWQgd2hlbiBhIHJvdXRlIG1hdGNoZXMuIFdoYXRldmVyIHlvdXIgZnVuY3Rpb24gcmV0dXJuc1xuICogd2lsbCBiZSByZXR1cm5lZCBmcm9tIHRoZSBob29rIGFzIHdlbGwgaW50byB5b3VyIHJlYWN0IGNvbXBvbmVudC4gSWRlYWxseSB5b3Ugd291bGRcbiAqIHJldHVybiBjb21wb25lbnRzIHRvIGJlIHJlbmRlcmVkIHdoZW4gY2VydGFpbiByb3V0ZXMgbWF0Y2gsIGJ1dCB5b3UgYXJlIG5vdCBsaW1pdGVkXG4gKiB0byB0aGF0LlxuICogQHBhcmFtIHtvYmplY3R9IHJvdXRlT2JqIHtcIi9zb21lUm91dGVcIjogKCkgPT4gPEV4YW1wbGUgLz59XG4gKi9cbmV4cG9ydCBjb25zdCB1c2VSb3V0ZXMgPSAocm91dGVPYmopID0+IHtcblx0Ly8gRWFjaCByb3V0ZXIgZ2V0cyBhbiBpbnRlcm5hbCBpZCB0byBsb29rIHRoZW0gdXAgYWdhaW4uXG5cdGNvbnN0IFtyb3V0ZXJJZF0gPSBSZWFjdC51c2VTdGF0ZShjb21wb25lbnRJZCk7XG5cdGNvbnN0IHNldFVwZGF0ZSA9IFJlYWN0LnVzZVN0YXRlKDApWzFdO1xuXHQvLyBOZWVkZWQgdG8gY3JlYXRlIG5lc3RlZCByb3V0ZXJzIHdoaWNoIHVzZSBvbmx5IGEgc3Vic2V0IG9mIHRoZSBVUkwuXG5cdGNvbnN0IHBhcmVudFJvdXRlcklkID0gUmVhY3QudXNlQ29udGV4dChQYXJlbnRDb250ZXh0KTtcblxuXHQvLyBJZiB3ZSBqdXN0IHRvb2sgdGhlIGxhc3QgSUQsIGluY3JlYXNlIGl0IGZvciB0aGUgbmV4dCBob29rLlxuXHRpZiAocm91dGVySWQgPT09IGNvbXBvbmVudElkKSB7XG5cdFx0Y29tcG9uZW50SWQgKz0gMTtcblx0fVxuXG5cdC8vIFJlbW92ZXMgdGhlIHJvdXRlciBmcm9tIHRoZSBzdGFjayBhZnRlciBjb21wb25lbnQgdW5tb3VudCAtIGl0IHdvbid0IGJlIHByb2Nlc3NlZCBhbnltb3JlLlxuXHRSZWFjdC51c2VFZmZlY3QoKCkgPT4gKCkgPT4gZGVsZXRlIHN0YWNrW3JvdXRlcklkXSwgW3JvdXRlcklkXSk7XG5cblx0bGV0IHN0YWNrT2JqID0gc3RhY2tbcm91dGVySWRdO1xuXG5cdGlmIChzdGFja09iaiAmJiBzdGFja09iai5vcmlnaW5hbFJvdXRlT2JqICE9PSByb3V0ZU9iaikge1xuXHRcdHN0YWNrT2JqID0gbnVsbDtcblx0fVxuXG5cdGlmICghc3RhY2tPYmopIHtcblx0XHRzdGFja09iaiA9IHtcblx0XHRcdHJvdXRlcklkLFxuXHRcdFx0b3JpZ2luYWxSb3V0ZU9iajogcm91dGVPYmosXG5cdFx0XHRyb3V0ZXM6IE9iamVjdC5lbnRyaWVzKHJvdXRlT2JqKSxcblx0XHRcdHNldFVwZGF0ZSxcblx0XHRcdHBhcmVudFJvdXRlcklkLFxuXHRcdFx0bWF0Y2hlZFJvdXRlOiBudWxsLFxuXHRcdFx0cmVkdWNlZFBhdGg6IG51bGwsXG5cdFx0XHRwYXNzQ29udGV4dDogZmFsc2UsXG5cdFx0XHRyZXN1bHQ6IG51bGxcblx0XHR9O1xuXG5cdFx0c3RhY2tbcm91dGVySWRdID0gc3RhY2tPYmo7XG5cblx0XHRwcm9jZXNzKHN0YWNrT2JqLCB0cnVlKTtcblx0fVxuXG5cdFJlYWN0LnVzZURlYnVnVmFsdWUoc3RhY2tPYmoubWF0Y2hlZFJvdXRlKTtcblxuXHRpZiAoIXN0YWNrT2JqLm1hdGNoZWRSb3V0ZSkge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0bGV0IHJlc3VsdCA9IHN0YWNrT2JqLnJlc3VsdDtcblxuXHRpZiAoIXN0YWNrT2JqLnBhc3NDb250ZXh0KSB7XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fSBlbHNlIHtcblx0XHRjb25zdCBSb3V0ZUNvbnRleHQgPSAoe2NoaWxkcmVufSkgPT4gPFBhcmVudENvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3JvdXRlcklkfT57Y2hpbGRyZW59PC9QYXJlbnRDb250ZXh0LlByb3ZpZGVyPjtcblxuXHRcdGlmICh0eXBlb2YgcmVzdWx0ID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRyZXR1cm4gd3JhcHBlckZ1bmN0aW9uKFJvdXRlQ29udGV4dCwgcmVzdWx0KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gUmVhY3QuaXNWYWxpZEVsZW1lbnQocmVzdWx0KSAmJiByZXN1bHQudHlwZSAhPT0gUm91dGVDb250ZXh0XG5cdFx0XHQ/IDxSb3V0ZUNvbnRleHQ+e3Jlc3VsdH08L1JvdXRlQ29udGV4dD5cblx0XHRcdDogcmVzdWx0O1xuXHR9XG59O1xuIl19