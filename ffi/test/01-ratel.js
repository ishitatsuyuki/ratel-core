const acorn = require('acorn');

describe('Ratel ffi', () => {
  it('is an object, has transform and parse methods', () => {
    assert.equal(typeof Ratel, 'object');
    assert.equal(typeof Ratel.transform, 'function');
    assert.equal(typeof Ratel.parse, 'function');
  });

  describe('transform', () => {
    it('throws an error without a string as first argument', () => {
      assert.throws(() => {
        Ratel.transform();
      });
    });

    it('throws an error without a boolean as second argument', () => {
      assert.throws(() => {
        Ratel.transform('');
      });
    });

    it('transforms', () => {
      // const result = Ratel.transform('2**2', true);
      const result = Ratel.transform('Math.pow(2, 2)', true);
      assert.equal(typeof result, 'string');
      assert.equal(result, 'Math.pow(2,2);');
    });
  });

  describe('parse', () => {
    it('throws an error without a string as first argument', () => {
      assert.throws(() => {
        Ratel.parse();
      });
    });

    it('throws syntax errors', () => {
      assert.throws(() => {
        Ratel.parse('function function () {}');
      }, /Unexpected token/);
    });

    it('parses', () => {
      const result = Ratel.parse('2');
      assert.equal(typeof result, 'string');
      const expected = `[Loc { start: 0, end: 1, item: Expression(Loc { start: 0, end: 1, item: Literal(Number("2")) }) }]`;
      assert.equal(result, expected);
    });
  });

  describe('ast', () => {
    it('returns an AST', () => {
      const result = Ratel.ast('this;', false);
      const json = JSON.parse(result);
      assert.deepEqual(json, {
          "type": "Program",
          "body": [
              {
                  "type": "ExpressionStatement",
                  "expression": {
                      "type": "ThisExpression",
                      "start": 0,
                      "end": 4,
                  },
                  "start": 0,
                  "end": 4
              }
            ],
            "start": 0,
            "end": 4
      });
    });

    it('generates AST comparable with acorn', () => {
      const source = `const foo = 2; let bar=4; foo**bar === 16`;
      const ast = Ratel.ast(source, true);
      const tree = JSON.parse(ast);
      const acornAST = acorn.parse(source);
      delete acornAST['sourceType'];
      assert.deepEqual(tree, acornAST);
    });
  });
});
