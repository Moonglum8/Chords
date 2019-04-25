import { Template} from 'meteor/templating';
import {  ReactiveVar} from 'meteor/reactive-var';
import './main.html';
import {Fretboard} from  './guitar.js';
import  './guitar.css';

var Tunings = {
  bass4: {
    standard: ["e1", "a1", "d2", "g2", "b2", "e3"]
  },
  guitar6: {
    standard: ["e2", "a2", "d3", "g3", "b3", "e4"],
    E_4ths: ["e2", "a2", "d3", "g3", "c4", "f4"],
    Drop_D: ["d2", "a2", "d3", "g3", "b3", "e4"],
    G_open: ["d2", "g2", "d3", "g3", "b3", "d4"],
    DADGAD: ["d2", "a2", "d3", "g3", "a3", "d4"]
  },
  guitar7: {
    standard: ["b2", "e2", "a2", "d3", "g3", "b3", "e4"],
    E_4ths: ["b2", "e2", "a2", "d3", "g3", "c3", "f4"]
  }
};

var dictionary = {
  strings:
  {
    "Guitar 6 string":
      {
        name: "guitar6",
        num: 6,
        tunings: {
          "Standard": "standard",
          "E 4ths": "E_4ths",
          "Drop D": "Drop_D",
          "Open G": "G_open",
          "DADGAD" : "DADGAD"
        }
      },
    "Guitar 7 string":
      {
        name: "guitar7",
        num: 7,
        tunings: {
          "Standard": "standard",
          "E 4ths": "E_4ths",
        }
      },
    "Bass 4 string":
      {
        name: "bass4",
        num: 4,
        tunings:
          {"Standard":"standard"}
      },
    },
  scales : {
    "Lydian":"lydian",
    "Major": "major",
    "Mixolydian": "mixolydian",
    "Dorian": "dorian",
    "Aeolian": "aeolian",
    "Phrygian": "phrygian",
    "Locrian": "locrian",
    "Harmonic minor": "harmonic-minor",
    "Melodic minor": "melodic-minor",
    "Minor pentatonic": "minor-pentatonic",
    "Minor blues": "minor-blues",
    "Major pentatonic": "major-pentatonic",
    "Major blues": "major-blues",
    "Composite blues": "composite-blues",
    "Dominent pentatonic": "dom-pentatonic",
    "Japanese": "japanese"
  },
  keys: ["c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b"]
};

Session.setDefault("stringsFull","Guitar 6 string");
Session.setDefault("tuningsFull","Standard");
Session.setDefault("scalesFull","Major");
Session.setDefault("strings","guitar6");
Session.setDefault("tunings","standard");
Session.setDefault("keys","c");
Session.setDefault("scales","major");

Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function() {
  this.layout('ApplicationLayout');
  this.render('navbar_section', { to: 'navbar' });
  this.render('body_section_home', { to: 'mainbody'  });
  this.render('footer_section', { to: 'footer'  });
});

Router.route('/chords/', function() {
  this.layout('ApplicationLayout');
  this.render('navbar_section', { to: 'navbar' });
  this.render('body_section_chords', { to: 'mainbody'  });
  this.render('footer_section', { to: 'footer'  });
});

Router.route('/scales/', function() {
  this.layout('ApplicationLayout');
  this.render('navbar_section', { to: 'navbar' });
  this.render('body_section_scales', { to: 'mainbody'  });
  this.render('footer_section', { to: 'footer'  });
});

Router.route('/about/', function() {
  this.layout('ApplicationLayout');
  this.render('navbar_section', { to: 'navbar' });
  this.render('body_section_about', { to: 'mainbody'  });
  this.render('footer_section', { to: 'footer'  });
});


Template.fretboard.onRendered(
  function(){
    makeFrets()
  }
);

Template.body_section_scales.helpers({
  getStrings: function() {
      var strings = dictionary.strings;
      //console.log(Object.keys(strings));
      return Object.keys(strings);
  },
  getTunings: function() {
      var stringsFull = Session.get("stringsFull")
      //console.log(stringsFull);
      var tunings = dictionary.strings[stringsFull].tunings;
      //console.log(Object.keys(tunings));
      return Object.keys(tunings);
  },
  getKeys: function() {
      var keys = dictionary.keys;
      //console.log(keys);
      return keys;
  },
  getScales: function() {
      var scales = dictionary.scales;
      //console.log(Object.keys(scales));
      return Object.keys(scales);
  },
  getTitle: function() {
      var title = Session.get("keys").toUpperCase() + ' ' + Session.get("scalesFull");
      //console.log(title);
      return title;
  },
});

Template.body_section_scales.events({
  'click .js-strings-dropdown':function(event){
    event.preventDefault();
    var stringsFull = $(event.target).text();
    var strings = dictionary.strings[stringsFull].name;
    //console.log(strings);
    Session.set("strings", strings);
    Session.set("stringsFull", stringsFull);
    makeFrets();
  },
  'click .js-tunings-dropdown':function(event){
    event.preventDefault();
    var stringsFull = Session.get("stringsFull")
    var tuningsFull = $(event.target).text();
    var tunings = dictionary.strings[stringsFull].tunings[tuningsFull];
    //console.log(tunings);
    Session.set("tunings", tunings);
    Session.set("tuningsFull", tuningsFull);
    makeFrets();
  },
  'click .js-keys-dropdown':function(event){
    event.preventDefault();
    var keysFull = $(event.target).text();
    //console.log(keysFull);
    Session.set("keys", keysFull);
    makeFrets();
  },
  'click .js-scales-dropdown':function(event){
    event.preventDefault();
    var scalesFull = $(event.target).text();
    var scales = dictionary.scales[scalesFull];
    //console.log(scales);
    Session.set("scales", scales);
    Session.set("scalesFull", scalesFull);
    makeFrets();
  },
})

function makeFrets() {
  var strings = dictionary.strings[Session.get("stringsFull")].num;
  var tunings = Tunings[Session.get("strings")][Session.get("tunings")];
  var keys = Session.get("keys");
  var scales = Session.get("scales");
  var keyScale = keys + ' ' + scales;
  //console.log(strings, tunings, keyScale);
  var id = '#' + Session.get("id");
  //console.log(id);
  $(id).remove();
  var fb = Fretboard({where: '#scales-div', strings: strings, tuning: tunings});
  Session.set("id", fb._id);
  return fb.draw(keyScale);
}
