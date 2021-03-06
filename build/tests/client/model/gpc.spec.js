// Generated by CoffeeScript 1.3.3
(function() {

  define(['model/gpc', 'model/phoneme', 'model/grapheme'], function(GPC, Phoneme, Grapheme) {
    return describe("GPC", function() {
      var gpc, graph, phone;
      gpc = null;
      graph = null;
      phone = null;
      beforeEach(function() {
        graph = new Grapheme({
          name: 'a'
        });
        phone = new Phoneme({
          name: 'b'
        });
        return gpc = new GPC({
          grapheme: graph,
          phoneme: phone
        });
      });
      return it("should have graphemeName to get grapheme name", function() {
        return (expect(gpc.graphemeName())).toEqual('a');
      });
    });
  });

}).call(this);
