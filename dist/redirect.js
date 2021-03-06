"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _router = require("./router");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var useRedirect = function useRedirect(fromURL, toURL) {
  var queryParams = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var replace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

  var parentRouterId = _react.default.useContext(_router.ParentContext);

  var currentPath = (0, _router.getWorkingPath)(parentRouterId);

  if (currentPath === fromURL) {
    (0, _router.navigate)(parentRouterId ? ".".concat(toURL) : toURL, replace, queryParams);
  }
};

var _default = useRedirect;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9yZWRpcmVjdC5qcyJdLCJuYW1lcyI6WyJ1c2VSZWRpcmVjdCIsImZyb21VUkwiLCJ0b1VSTCIsInF1ZXJ5UGFyYW1zIiwicmVwbGFjZSIsInBhcmVudFJvdXRlcklkIiwiUmVhY3QiLCJ1c2VDb250ZXh0IiwiUGFyZW50Q29udGV4dCIsImN1cnJlbnRQYXRoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7Ozs7QUFFQSxJQUFNQSxXQUFXLEdBQUcsU0FBZEEsV0FBYyxDQUFDQyxPQUFELEVBQVVDLEtBQVYsRUFBd0Q7QUFBQSxNQUF2Q0MsV0FBdUMsdUVBQXpCLElBQXlCO0FBQUEsTUFBbkJDLE9BQW1CLHVFQUFULElBQVM7O0FBQzNFLE1BQU1DLGNBQWMsR0FBR0MsZUFBTUMsVUFBTixDQUFpQkMscUJBQWpCLENBQXZCOztBQUNBLE1BQU1DLFdBQVcsR0FBRyw0QkFBZUosY0FBZixDQUFwQjs7QUFFQSxNQUFJSSxXQUFXLEtBQUtSLE9BQXBCLEVBQTZCO0FBQzVCLDBCQUFTSSxjQUFjLGNBQU9ILEtBQVAsSUFBaUJBLEtBQXhDLEVBQStDRSxPQUEvQyxFQUF3REQsV0FBeEQ7QUFDQTtBQUNELENBUEQ7O2VBU2VILFciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtuYXZpZ2F0ZSwgUGFyZW50Q29udGV4dCwgZ2V0V29ya2luZ1BhdGh9IGZyb20gJy4vcm91dGVyJztcblxuY29uc3QgdXNlUmVkaXJlY3QgPSAoZnJvbVVSTCwgdG9VUkwsIHF1ZXJ5UGFyYW1zID0gbnVsbCwgcmVwbGFjZSA9IHRydWUpID0+IHtcblx0Y29uc3QgcGFyZW50Um91dGVySWQgPSBSZWFjdC51c2VDb250ZXh0KFBhcmVudENvbnRleHQpO1xuXHRjb25zdCBjdXJyZW50UGF0aCA9IGdldFdvcmtpbmdQYXRoKHBhcmVudFJvdXRlcklkKTtcblxuXHRpZiAoY3VycmVudFBhdGggPT09IGZyb21VUkwpIHtcblx0XHRuYXZpZ2F0ZShwYXJlbnRSb3V0ZXJJZCA/IGAuJHt0b1VSTH1gIDogdG9VUkwsIHJlcGxhY2UsIHF1ZXJ5UGFyYW1zKTtcblx0fVxufTtcblxuZXhwb3J0IGRlZmF1bHQgdXNlUmVkaXJlY3Q7XG4iXX0=