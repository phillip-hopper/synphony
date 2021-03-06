// Generated by CoffeeScript 1.3.3
(function() {

  define(['model/named', 'collection/named'], function(NamedModel, NamedCollection) {
    return describe("NamedModel", function() {
      var model;
      model = null;
      beforeEach(function() {
        return model = new NamedModel;
      });
      it("should valid only with a name", function() {
        (expect(model.isValid())).not.toBeTruthy();
        model.set({
          name: "one"
        });
        return (expect(model.isValid())).toBeTruthy();
      });
      it("should not allow two models with the same name", function() {
        var coll, item1, item2;
        coll = new NamedCollection;
        item1 = new NamedModel({
          name: "one"
        });
        item2 = new NamedModel({
          name: "one"
        });
        coll.add(item1);
        coll.add(item2);
        return (expect(item2.isValid())).toBeFalsy();
      });
      return it("should allow setting attributes", function() {
        model.set({
          name: "one"
        });
        return (expect(model.set({
          something: ["two", "three", "four"]
        }))).toBeTruthy();
      });
    });
  });

}).call(this);
