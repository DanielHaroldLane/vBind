var stubbed_noop = function() {};

describe('VBind', function() {
  var VBind_Mock;

  beforeEach(function() {
    VBind_Mock = function(args) {
      VBind.call(this, args);
    };
    VBind_Mock.prototype = Object.create(VBind.prototype);
    VBind_Mock.prototype._get_template = stubbed_noop;
    VBind_Mock.prototype._populateContainer = stubbed_noop;
  });

  afterEach(function() {
    VBind_Mock = null;
  });

  it('should attempt to override data properties with _overrideProps()', function() {
    VBind_Mock.prototype._override = stubbed_noop;
    VBind_Mock.prototype._get_template = stubbed_noop;
    VBind_Mock.prototype._populateContainer = stubbed_noop;

    var expected = {
      data: {
        test: true,
        property: "lol"
      },
      container: {},
      _override: function(prop) {}
    };

    spyOn(expected, '_override');

    VBind_Mock.prototype._overrideProps.call(expected);

    expect(expected._override).toHaveBeenCalled();
    expect(expected._override.calls.allArgs()).toContain(['property']);
    expect(expected._override.calls.allArgs()).toContain(['test']);
  });

  it('should call over-write getters and setters for data object', function() {
    VBind_Mock.prototype._get_template = stubbed_noop;
    var expected = {
      data: {
        test: true
      },
      model: 'event_id',
      propertySetter: VBind_Mock.prototype.propertySetter,
      propertyGetter: VBind_Mock.prototype.propertyGetter
    };

    VBind_Mock.prototype._override.call(expected, 'test');

    var getSpy = spyOnProperty(expected.data, 'test', 'get');
    var setSpy = spyOnProperty(expected.data, 'test', 'set');

    expected.data.test = false;
    expect(setSpy).toHaveBeenCalled();
    var tmp = expected.data.test;
    expect(getSpy).toHaveBeenCalled();
  });

  it('should return correct value for overridden data property', function() {
    VBind_Mock.prototype._get_template = stubbed_noop;
    var expected = {
      data: {
        test: true
      },
      model: 'event_id',
      propertySetter: VBind_Mock.prototype.propertySetter,
      propertyGetter: VBind_Mock.prototype.propertyGetter
    };

    VBind_Mock.prototype._override.call(expected, 'test');

    var tmp = expected.data.test;
    expect(tmp).toBe(true);
  });

  it('should set correct value for overridden data property', function() {
    VBind_Mock.prototype._get_template = stubbed_noop;
    var expected = {
      data: {
        test: true
      },
      model: 'event_id',
      propertySetter: VBind_Mock.prototype.propertySetter,
      propertyGetter: VBind_Mock.prototype.propertyGetter
    };

    VBind_Mock.prototype._override.call(expected, 'test');

    expected.data.test = false;
    expect(expected.data.test).toBe(false);
    expected.data.test = true;
    expect(expected.data.test).toBe(true);
  });

  describe('getExpressionVariables', function() {
    it('should return null if called with null', function() {
      var attribute_mock = null;
      var actual = VBind_Mock.prototype._getExpressionVariables(attribute_mock);
      var expected = null;

      expect(actual).toBe(expected);
    });

    it('should return null if called with undefined', function() {
      var attribute_mock = undefined;
      var actual = VBind_Mock.prototype._getExpressionVariables(attribute_mock);
      var expected = null;

      expect(actual).toBe(expected);
    });

    it('should return null if called with { value: null }', function() {
      var attribute_mock = {
        value: null
      };
      var actual = VBind_Mock.prototype._getExpressionVariables(attribute_mock);
      var expected = null;

      expect(actual).toBe(expected);
    });

    it('should return null if called with { value: undefined }', function() {
      var attribute_mock = {
        value: undefined
      };
      var actual = VBind_Mock.prototype._getExpressionVariables(attribute_mock);
      var expected = null;
      expect(actual).toBe(expected);
    });

    it('should return null if attribute.value is \'\'', function() {
      var attribute_mock = {
        value: ''
      };
      var actual = VBind_Mock.prototype._getExpressionVariables(attribute_mock);
      var expected = null;

      expect(actual).toBe(expected);
    });

    it('should return [\'variable\'] if attribute.value is \'${variable}\'', function() {
      var attribute_mock = {
        value: '${variable}'
      };
      var actual = VBind_Mock.prototype._getExpressionVariables(attribute_mock);
      var expected = ['variable'];

      expect(actual).toEqual(expected);
    });

    it('should return [\'variable\', \'variable2\'] if attribute.value is \'${variable}${variable2}\'', function() {
      var attribute_mock = {
        value: '${variable}${variable2}'
      };
      var actual = VBind_Mock.prototype._getExpressionVariables(attribute_mock);
      var expected = ['variable', 'variable2'];

      expect(actual).toEqual(expected);
    });
  });

  describe('getElementAttributes', function() {
    it('should return an array of objects if element has attributes set', function() {
      var mock_element = {
        attributes: [{
          name: "value",
          value: "any val"
        }]
      };
      var actual = VBind_Mock.prototype._getElementAttributes(mock_element);
      var expected = [{
        name: "value",
        value: "any val"
      }];

      expect(actual).toEqual(expected);
    });

    it('should return an empty array if element has no attributes', function() {
      var mock_element = {
        attributes: []
      };
      var actual = VBind_Mock.prototype._getElementAttributes(mock_element);
      var expected = [];

      expect(actual).toEqual(expected);
    });
  });

  describe('populateChildrenProperty', function() {
    it('should loop over child elements in VBind container and add them to VBind children', function() {
      var actual = [];
      var container = {
        children: [{
          innerHTML: "<label>hello</label>"
        }, {
          innerHTML: "<label>world</label>"
        }]
      };
      var state = {
        children: actual,
        container: container
      };
      var expected = [{
        innerHTML: "<label>hello</label>"
      }, {
        innerHTML: "<label>world</label>"
      }];

      VBind_Mock.prototype._populateChildrenProperty.call(state);
      expect(actual).toEqual(expected);
    })
  });

  describe('populateContainer', function() {
    it('should set VBind container.innerHTML with provided markup value', function() {
      var actual = {
        container: {
          innerHTML: ''
        },
        _populateChildrenProperty: stubbed_noop,
        _bindToData: stubbed_noop
      };
      var markup = '<h1>hello world</h1>';
      var expected = {
        innerHTML: '<h1>hello world</h1>'
      };
      VBind_Mock.prototype.populateContainer.call(actual, markup);
      expect(actual.container.innerHTML).toBe(expected.innerHTML);
    });
  });

  describe('get_template', function() {
    var mock = require('xhr-mock');

    it('should call success callback if readystate === 4', function() {
      mock.setup();
      mock.get('./templates/template1.html', function(req, res) {
        return res
          .status(200)
          .header('Content-Type', 'application/json')
          .body('<h1>dummy data</h1>');
      });

      VBind.prototype._get_template.call(null, './templates/template1.html', function() {
        expect(expected.callback).toHaveBeenCalled();
        mock.teardown();
        done();
      }, function() {});
    });
  });
});