"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTitle = exports.useTitle = void 0;

var _react = _interopRequireDefault(require("react"));

var _isNode = _interopRequireDefault(require("./isNode"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var currentTitle = '';
/**
 * This hook will set the window title, when a component gets mounted.
 * When the component gets unmounted, the previously used title will be restored.
 * @param {string} inString
 */

var useTitle = function useTitle(inString) {
  currentTitle = inString;

  if (_isNode.default) {
    return;
  }

  _react.default.useEffect(function () {
    var previousTitle = document.title;
    document.title = inString;
    return function () {
      document.title = previousTitle;
    };
  });
};
/**
 * Returns the current window title to be used in a SSR context
 * @returns {string}
 */


exports.useTitle = useTitle;

var getTitle = function getTitle() {
  return currentTitle;
};

exports.getTitle = getTitle;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy90aXRsZS5qcyJdLCJuYW1lcyI6WyJjdXJyZW50VGl0bGUiLCJ1c2VUaXRsZSIsImluU3RyaW5nIiwiaXNOb2RlIiwiUmVhY3QiLCJ1c2VFZmZlY3QiLCJwcmV2aW91c1RpdGxlIiwiZG9jdW1lbnQiLCJ0aXRsZSIsImdldFRpdGxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7Ozs7QUFFQSxJQUFJQSxZQUFZLEdBQUcsRUFBbkI7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNPLElBQU1DLFFBQVEsR0FBRyxTQUFYQSxRQUFXLENBQUNDLFFBQUQsRUFBYztBQUNyQ0YsRUFBQUEsWUFBWSxHQUFHRSxRQUFmOztBQUVBLE1BQUdDLGVBQUgsRUFBVTtBQUNUO0FBQ0E7O0FBRURDLGlCQUFNQyxTQUFOLENBQWdCLFlBQU07QUFDckIsUUFBTUMsYUFBYSxHQUFHQyxRQUFRLENBQUNDLEtBQS9CO0FBQ0FELElBQUFBLFFBQVEsQ0FBQ0MsS0FBVCxHQUFpQk4sUUFBakI7QUFDQSxXQUFPLFlBQU07QUFDWkssTUFBQUEsUUFBUSxDQUFDQyxLQUFULEdBQWlCRixhQUFqQjtBQUNBLEtBRkQ7QUFHQSxHQU5EO0FBT0EsQ0FkTTtBQWdCUDtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFDTyxJQUFNRyxRQUFRLEdBQUcsU0FBWEEsUUFBVztBQUFBLFNBQU1ULFlBQU47QUFBQSxDQUFqQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgaXNOb2RlIGZyb20gJy4vaXNOb2RlJztcblxubGV0IGN1cnJlbnRUaXRsZSA9ICcnO1xuXG4vKipcbiAqIFRoaXMgaG9vayB3aWxsIHNldCB0aGUgd2luZG93IHRpdGxlLCB3aGVuIGEgY29tcG9uZW50IGdldHMgbW91bnRlZC5cbiAqIFdoZW4gdGhlIGNvbXBvbmVudCBnZXRzIHVubW91bnRlZCwgdGhlIHByZXZpb3VzbHkgdXNlZCB0aXRsZSB3aWxsIGJlIHJlc3RvcmVkLlxuICogQHBhcmFtIHtzdHJpbmd9IGluU3RyaW5nXG4gKi9cbmV4cG9ydCBjb25zdCB1c2VUaXRsZSA9IChpblN0cmluZykgPT4ge1xuXHRjdXJyZW50VGl0bGUgPSBpblN0cmluZztcblxuXHRpZihpc05vZGUpe1xuXHRcdHJldHVybjtcblx0fVxuXG5cdFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG5cdFx0Y29uc3QgcHJldmlvdXNUaXRsZSA9IGRvY3VtZW50LnRpdGxlO1xuXHRcdGRvY3VtZW50LnRpdGxlID0gaW5TdHJpbmc7XG5cdFx0cmV0dXJuICgpID0+IHtcblx0XHRcdGRvY3VtZW50LnRpdGxlID0gcHJldmlvdXNUaXRsZTtcblx0XHR9O1xuXHR9KTtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgY3VycmVudCB3aW5kb3cgdGl0bGUgdG8gYmUgdXNlZCBpbiBhIFNTUiBjb250ZXh0XG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5leHBvcnQgY29uc3QgZ2V0VGl0bGUgPSAoKSA9PiBjdXJyZW50VGl0bGU7XG4iXX0=