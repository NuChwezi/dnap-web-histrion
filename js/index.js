/*
WELCOME TO THE WEB VERSION OF THE HISTRION - that amazing, general-purpose app from from the future!
Yes, like its native cousin (on Android atm), this web histrion can take on any function and looks that
a compatible persona can specify. With the implementation of a histrion for the web, it means, Project-O
has finally achieved one of its magnificent goals - which is to ensure incredibly useful and beautiful apps
can be built in a mtter of seconds, and can then be immediately deployed globally, cross-platform, just a few minutes 
later!

This is all work done originally by the NuChwezi (https://nuchwezi.com) - yes, those amazing, mysterious hackers that are the heirs of
the most ancient, most mystic, most sublime Chwezi. And yeah, we are operating from the same area code - 256, Africa ;-)
Ok. Enuf of the funny talk... let's get hacking!

-- Nemesis Fixx

*/

var DB_KEYS = {
   UUID_LIST: "PERSONA_UUIDS",
   PERSONA_DICTIONARY: "PERSONA_DICTIONARY",
   ACTIVE_PERSONA_UUID: "ACTIVE_PERSONA_UUID",
   SAVED_ACTS: "SAVED_ACTS"
}

// some default persona brand images to light things up for those persona with none defined...
var DEFAULT_PERSONA_BRAND_IMAGE_URI = [
   'https://orig04.deviantart.net/4a12/f/2016/195/9/a/theloudhouse_and_the_mask___lisa_masked_by_lueduartvartworks-da9z6d1.png',
   'http://cliparts.co/cliparts/pio/A7M/pioA7MMaT.jpg',
   'https://img13.deviantart.net/261e/i/2016/177/f/9/lisa_loud_is_the_mask__by_cartoonmaster01-da7sk2c.png',
   'http://www.clker.com/cliparts/W/9/n/j/B/L/mask-tornado-hi.png',
   'http://worldartsme.com/images/cartoon-masks-clipart-1.jpg',
   'http://worldartsme.com/images/theatre-summer-camp-clipart-1.jpg',
   'http://worldartsme.com/images/brazilian-carnival-mask-clipart-1.jpg',
   'http://worldartsme.com/images/face-mask-clipart-1.jpg',
   'http://cliparts.co/cliparts/6Ty/ooR/6TyooRyac.jpg'
];

function success(msg, showAlert) {
   $('#status').attr({
      'class': 'alert alert-success'
   }).html(msg)

   if (showAlert) {
      alert(msg)
   }
}

function warning(msg, showAlert) {
   $('#status').attr({
      'class': 'alert alert-warning'
   }).html(msg)
   if (showAlert) {
      alert(msg)
   }
}

function info(msg, showAlert) {
   $('#status').attr({
      'class': 'alert alert-info'
   }).html(msg)
   if (showAlert) {
      alert(msg)
   }
}

function error(msg, showAlert) {
   $('#status').attr({
      'class': 'alert alert-danger'
   }).html(msg)
   if (showAlert) {
      alert(msg)
   }
}

function Persona(persona) {
   this.persona = persona;
   this.getAppName = function() {
      return this.persona.app.name;
   }
   this.getThemeColor = function(defaultColor) {
      return tinycolor(this.persona.app.color || defaultColor);
   }
   this.getFields = function() {
      return this.persona.fields;
   }
   this.getAppTheatreAddress = function() {
      return this.persona.app.theatre_address;
   }
   this.getAppTransportMode = function() {
      return this.persona.app.transport_mode;
   }
   this.KEYS = {
      CACHE_THEATRE_ADDRESS: "CACHE_THEATRE_ADDRESS",
      CACHE_TRANSPORT_MODE: "CACHE_TRANSPORT_MODE",
      CACHE_APP_NAME: "CACHE_APP_NAME",
      CACHE_PERSONA: "PERSONA",
      /* please, for historical reasons, keep this key as is, as the official Theatre implementation relies on it */
      CACHE_UUID: "UUID",
      CACHE_TIMESTAMP: "CACHE_TIMESTAMP"
   }
   this.FieldTypes = {
      TEXT: "text",
      PARAGRAPH: "paragraph",
      EMAIL: "email",
      WEBSITE: "website",
      FILE: "file",
      RADIO: "radio",
      SHOW_IMAGE: "show_image",
      SHOW_INFO: "show_info",
      TIME: "time",
      DATE: "date",
      DROPDOWN: "dropdown",
      CAMERA: "camera",
      CHECK_BOXES: "checkboxes",
      NUMBER: "number",
      BARCODE: "barcode"
   }
   this.TRANSPORT_MODES = {
      POST: "POST",
      GET: "GET",
      SMS: "SMS",
      EMAIL: "EMAIL"
   }
   this.isInputField = function(field) {
      switch (field.field_type) {
         case this.FieldTypes.PARAGRAPH:
         case this.FieldTypes.PARAGRAPH:
         case this.FieldTypes.EMAIL:
         case this.FieldTypes.WEBSITE:
         case this.FieldTypes.RADIO:
         case this.FieldTypes.FILE:
         case this.FieldTypes.DROPDOWN:
         case this.FieldTypes.TIME:
         case this.FieldTypes.DATE:
         case this.FieldTypes.CAMERA:
         case this.FieldTypes.CHECK_BOXES:
         case this.FieldTypes.NUMBER:
         case this.FieldTypes.BARCODE:
         case this.FieldTypes.TEXT:
            {
               return true;
            }
      }
      return false;
   }
   this.canTransportActs = function() {

      if (this.persona.app.theatre_address == undefined) {
         return false;
      }

      if (this.persona.app.theatre_address.trim().length == 0)
         return false;

      switch (this.persona.app.transport_mode) {
         case this.TRANSPORT_MODES.POST:
         case this.TRANSPORT_MODES.GET:
            // for this Web Histrion, we can't readily support SMS and EMAIL transport at the moment
            //case this.TRANSPORT_MODES.SMS:
            //case this.TRANSPORT_MODES.EMAIL:
            return true;
         default:
            return false;
      }
   }
}

function loadNewPersona(persona) {
   if (persona == null) {
      error("The loaded persona is invalid (NULL). Can't proceed...", true);
      return;
   }
   // set title to app's...
   var activePersona = new Persona(persona);
   $('#app-title').text(activePersona.getAppName()).fitText();
   $(document).prop('title', activePersona.getAppName());
   // get some some color pallete based off the app's theme color
   var defaultColor = tinycolor('#490A3D')
   var color1 = activePersona.getThemeColor(defaultColor);
   var theme = color1.monochromatic(7);
   var themePallette = {
         color1: color1,
         color2: theme[1],
         color3: theme[2],
         color4: theme[3],
         color5: theme[4],
         color6: theme[5],
         color7: theme[6]
      }
      // apply our theme to the various elements
   var appContainer = $('#app-base');
   appContainer.css({
      'background-color': themePallette.color2.toHexString()
   });
   appContainer.find('.panel').css({
      'background-color': themePallette.color3.toHexString()
   });
   appContainer.find('.panel-heading').css({
      'background-color': "#f5f5f5",
      'color': '#333',
      'text-shadow': 'gray' + ' 3px 3px 3px'
   });
   $('body').css({
      'background-color': "#f5f5f5"
   });
   appContainer.find('.panel').css({
      'border-color': themePallette.color5.toHexString()
   });
   var appCanvas = $('#app-body');
   appCanvas.css({
      'color': themePallette.color6.toHexString()
   });
   // ok, let the REAL magick begin...
   renderPersona(activePersona, appCanvas, themePallette);
   // let's hook up events...
   var btnSave = $('#btnSave');
   var btnSubmit = $('#btnSubmit');
   if (!activePersona.canTransportActs()) {
      btnSubmit.hide();
      // hide it, since we won't need it...
      btnSave.hide();
      // hide it, since we won't need it...
   } else {
      btnSubmit.show();
      // might have hidden it previously...
      btnSave.show();
      // might have hidden it previously...
      var isPosting = false;
      btnSubmit.unbind().click(function() {
         if (isPosting)
            return;
         isPosting = true;
         var act = parseAct(activePersona);
         if (act != null) {
            submitActToTheatre(act, activePersona, function() {
               // success
               isPosting = false;
               init();
            }, function() {
               // failed...
               isPosting = false;
            });
         } else
            isPosting = false;
      });
      btnSave.unbind().click(function() {
         if (isPosting)
            return;
         isPosting = true;
         var act = parseAct(activePersona);
         if (act != null) {
            saveAct(act, activePersona, function() {
               // success
               isPosting = false;
               init();
            }, function() {
               // failed...
               isPosting = false;
            });
         } else
            isPosting = false;

      });
   }

   // also, we want to cache this persona, so it can be used next time...
   cacheActivePersona(persona, true);
}

function cacheActivePersona(persona, setActive) {
   var uuid = persona.app.uuid;
   if (uuid == null) {
      // complain...
      error("<b>Persona Caching Failed</b><br/>Unfortunately, this person lacks a UUID, and so it can't be cached for later reuse.");
      return
   }

   var knownPersonas = localStorage.getItem(DB_KEYS.PERSONA_DICTIONARY);
   if (knownPersonas != null) {
      knownPersonas = JSON.parse(knownPersonas);
   } else
      knownPersonas = {};

   knownPersonas[uuid] = persona;
   localStorage.setItem(DB_KEYS.PERSONA_DICTIONARY, JSON.stringify(knownPersonas));
   if (setActive) {
      setActivePersonaUUID(uuid);
   }
}

function setActivePersonaUUID(personaUUID) {
   // the set the active persona...
   localStorage.setItem(DB_KEYS.ACTIVE_PERSONA_UUID, personaUUID);
}

function submitActToTheatre(act, persona, successCallback, failCallback) {
   info("Wait as the act is being submitted...", true);

   persona = persona.KEYS == undefined ? new Persona(persona) : persona; // we might need to decorate

   delete act[persona.KEYS.CACHE_UUID];
   delete act[persona.KEYS.CACHE_THEATRE_ADDRESS];
   delete act[persona.KEYS.CACHE_TRANSPORT_MODE];
   delete act[persona.KEYS.CACHE_APP_NAME];

   switch (persona.persona.app.transport_mode) {
      case persona.TRANSPORT_MODES.POST:
      case persona.TRANSPORT_MODES.GET:
         {
            $.ajax({
               url: persona.persona.app.theatre_address,
               method: persona.persona.app.transport_mode,
               data: JSON.stringify(act)
            }).done(function(response) {
               successCallback();
               success("<b>ACT SUBMITTED, via HTTP" + persona.persona.app.transport_mode + "</b><br/> STATUS: " + response, true);
            }).fail(function() {
               failCallback();
               error("ACT NOT SENT. HTTP ERROR", true);
            });

         }
   }

}

function saveAct(act, persona, successCallback, failCallback) {
   act[persona.KEYS.CACHE_UUID] = persona.persona.app.uuid;
   act[persona.KEYS.CACHE_THEATRE_ADDRESS] = persona.persona.app.theatre_address;
   act[persona.KEYS.CACHE_TRANSPORT_MODE] = persona.persona.app.appTransportMode;
   act[persona.KEYS.CACHE_APP_NAME] = persona.persona.app.name;

   var savedActs = localStorage.getItem(DB_KEYS.SAVED_ACTS);
   if (savedActs != null) {
      savedActs = JSON.parse(savedActs);
   } else
      savedActs = {};

   // savedActs is { UUID1 : [Act1, Act2,... ], UUID2: [...], ... }
   var personaUUID = act[persona.KEYS.CACHE_UUID];

   if (personaUUID == null) {
      error("<b>CAN'T SAVE ACT!</b><br/> The Persona this act is based on, has no UUID or setting the UUID has failed. Contact the designers of this current persona for help.", true);
      failCallback();
      return;
   } else {

      var actsForUUID = savedActs[personaUUID];
      if (actsForUUID == undefined) {
         actsForUUID = [];
      }

      actsForUUID.push(act);

      savedActs[personaUUID] = actsForUUID;

      localStorage.setItem(DB_KEYS.SAVED_ACTS, JSON.stringify(savedActs));

      success("Act has been successfully saved. You may continue to capture a new one...", true);
      successCallback();
      init();
   }
}

function parseAct(activePersona) {
   var act = {};
   var fails = false;
   $.each(activePersona.getFields(), function(index, field) {
      if (fails)
         return;

      if (!activePersona.isInputField(field))
         return;
      var value = readFieldValue(activePersona.FieldTypes, field);
      if (value == null && field.required) {
         error('<b>Validation Error!</b> <br/>' + field.label + ' is required!', true);
         fails = true;
      }
      act[field.cid] = value;
   });
   if (fails)
      return null;

   // we'll need this...
   act[activePersona.KEYS.CACHE_TIMESTAMP] = (new Date()).toISOString();
   // we want to include the persona, so the act can later be validated against it...       
   act[activePersona.KEYS.CACHE_PERSONA] = JSON.stringify(activePersona.persona);
   return act;
}

function readFieldValue(FieldTypes, field) {
   switch (field.field_type) {
      case FieldTypes.TEXT:
      case FieldTypes.PARAGRAPH:
      case FieldTypes.EMAIL:
      case FieldTypes.WEBSITE:
      case FieldTypes.DROPDOWN:
      case FieldTypes.TIME:
      case FieldTypes.DATE:
      case FieldTypes.NUMBER:
         {
            var val = $('#' + field.cid).val();

            if (val == undefined)
               return null;

            val = val.trim(); // user input...

            if (field.required) {
               if (val.length == 0)
                  return null;
            }
            return val;
         }
      case FieldTypes.RADIO:
         {
            var val = $("input:radio[name ='" + field.cid + "']:checked").val()
            if (val == undefined)
               return null;

            if (field.required) {
               if (val.length == 0)
                  return null;
            }
            return val;
         }
      case FieldTypes.CHECK_BOXES:
         {
            var checkBoxes = $("input:checkbox[name='" + field.cid + "']:checked");
            var val = checkBoxes.map(function(c) {
               return $(this).val();
            });

            val = val.toArray().join(',');

            if (field.required) {
               if (val.length == 0)
                  return null;
            }

            return val;
         }
      case FieldTypes.CAMERA:
         {
            var val = $('#cam-data-uri-' + field.cid).val();
            if (val == undefined)
               return null;

            if (field.required) {
               if (val.length == 0)
                  return null;
            }
            return val;
         }
      case FieldTypes.BARCODE:
         {
            var val = $('#barcode-data-uri-' + field.cid).val();
            if (val == undefined)
               return null;

            if (field.required) {
               if (val.length == 0)
                  return null;
            }
            return val;
         }
      case FieldTypes.FILE:
         {
            var val = $('#file-data-uri-' + field.cid).val();

            if (val == undefined)
               return null;

            if (field.required) {
               if (val.length == 0)
                  return null;
            }
            return val;
         }
   }
   return null;
}

function renderPersona(activePersona, appCanvas, colorTheme) {
   appCanvas.empty();
   $.each(activePersona.getFields(), function(index, field) {
      renderField(activePersona.FieldTypes, appCanvas, index, field, colorTheme);
   });
   info("The persona has been fully rendered. You may now proceed...")
}

function renderField(FieldTypes, canvas, index, field, colorTheme) {
   switch (field.field_type) {
      case FieldTypes.CAMERA:
         {
            info('Loading field: ' + field.label);
            var wrapper = $('<div/>', {
               'class': 'panel form-group field-panel'
            });
            var label = $('<label/>', {
               'class': 'control-label'
            }).text(field.label);

            wrapper.append(label);

            var wrapper2 = $('<div/>', {
               'class': 'row'
            });
            var camContainer = $('<div/>', {
               'class': 'col-sm-5'
            });

            var input = $('<button/>', {
               'class': 'btn',
               'type': 'text',
               'id': field.cid
            }).prepend($('<div/>', {
               'id': 'cam-' + field.cid,
               'class': 'cam-preview',
               'title': 'Click to take a photo'
            })).css({
               'background-color': colorTheme.color4.toHexString()
            })

            camContainer.append(input)
            wrapper2.append(camContainer)

            var previewContainer = $('<div/>', {
               'class': 'col-sm-5 col-sm-offset-2'
            });

            var preview = $('<div/>', {
               'id': 'cam-snap-' + field.cid,
               'class': 'cam-preview snap',
               'style': 'border:2px dashed ' + colorTheme.color4.toHexString()
            })
            previewContainer.append(preview)
            wrapper2.append(previewContainer)
            wrapper.append(wrapper2);

            var camHiddenVal = $('<input/>', {
               'type': 'hidden',
               'id': 'cam-data-uri-' + field.cid
            })

            canvas.append(camHiddenVal);

            if (field.field_options.description) {
               // help text perhaps?
               wrapper.append($('<small/>', {
                  'class': 'text-muted'
               }).text(field.field_options.description).prepend('<hr/>'))
            }

            canvas.append(wrapper);

            Webcam.attach('#cam-' + field.cid);
            input.click(function() {
               Webcam.snap(function(data_uri) {
                  camHiddenVal.val(data_uri);
                  $('#cam-snap-' + field.cid).html('<img class="img img-responsive" src="' + data_uri + '"/>');
               });
            })

            break;
         }
      case FieldTypes.TEXT:
         {
            info('Loading field: ' + field.label)
            var wrapper = $('<div/>', {
               'class': 'panel form-group field-panel'
            })
            var label = $('<label/>', {
               'class': 'control-label'
            }).text(field.label);
            var input = $('<input/>', {
               'class': 'form-control',
               'type': 'text',
               'id': field.cid
            }).css({
               'color': colorTheme.color4
            })
            wrapper.append(label);
            wrapper.append(input);

            if (field.field_options.description) {
               // help text perhaps?
               wrapper.append($('<small/>', {
                  'class': 'text-muted'
               }).text(field.field_options.description).prepend('<hr/>'))
            }

            canvas.append(wrapper);
            break;
         }
      case FieldTypes.WEBSITE:
         {
            info('Loading field: ' + field.label)
            var wrapper = $('<div/>', {
               'class': 'panel form-group field-panel'
            })
            var label = $('<label/>', {
               'class': 'control-label'
            }).text(field.label);

            var input = $('<div/>', {
                  'class': 'input-group'
               })
               .append(
                  $('<span/>', {
                     'class': 'input-group-addon'
                  }).append($('<i/>', {
                     'class': 'fa fa-globe'
                  })),
                  $('<input/>', {
                     'id': field.cid,
                     'type': 'url',
                     'placeholder': "URL",
                     'class': 'form-control'
                  }).css({
                     'color': colorTheme.color4
                  }));

            wrapper.append(label);
            wrapper.append(input);

            if (field.field_options.description) {
               // help text perhaps?
               wrapper.append($('<small/>', {
                  'class': 'text-muted'
               }).text(field.field_options.description).prepend('<hr/>'))
            }

            canvas.append(wrapper);
            break;
         }
      case FieldTypes.EMAIL:
         {
            info('Loading field: ' + field.label)
            var wrapper = $('<div/>', {
               'class': 'panel form-group field-panel'
            })
            var label = $('<label/>', {
               'class': 'control-label'
            }).text(field.label);

            var input = $('<div/>', {
                  'class': 'input-group'
               })
               .append(
                  $('<span/>', {
                     'class': 'input-group-addon'
                  }).append($('<i/>', {
                     'class': 'fa fa-envelope'
                  })),
                  $('<input/>', {
                     'id': field.cid,
                     'type': 'email',
                     'placeholder': "EMAIL Address",
                     'class': 'form-control'
                  }).css({
                     'color': colorTheme.color4
                  }));

            wrapper.append(label);
            wrapper.append(input);

            if (field.field_options.description) {
               // help text perhaps?
               wrapper.append($('<small/>', {
                  'class': 'text-muted'
               }).text(field.field_options.description).prepend('<hr/>'))
            }

            canvas.append(wrapper);
            break;
         }
      case FieldTypes.NUMBER:
         {
            info('Loading field: ' + field.label)
            var wrapper = $('<div/>', {
               'class': 'panel form-group field-panel'
            })
            var label = $('<label/>', {
               'class': 'control-label'
            }).text(field.label);
            var input = $('<input/>', {
               'class': 'form-control',
               'type': 'number',
               'id': field.cid
            }).css({
               'color': colorTheme.color4
            })
            wrapper.append(label);
            wrapper.append(input);

            if (field.field_options.min) {
               input.attr({
                  'min': field.field_options.min
               })
            }
            if (field.field_options.max) {
               input.attr({
                  'max': field.field_options.max
               })
            }
            if (field.field_options.units) {
               input.attr({
                  'placeholder': field.field_options.units
               })
            }

            if (field.field_options.description) {
               // help text perhaps?
               wrapper.append($('<small/>', {
                  'class': 'text-muted'
               }).text(field.field_options.description).prepend('<hr/>'))
            }

            canvas.append(wrapper);
            break;
         }
      case FieldTypes.DATE:
         {
            info('Loading field: ' + field.label)
            var wrapper = $('<div/>', {
               'class': 'panel form-group field-panel'
            })
            var label = $('<label/>', {
               'class': 'control-label'
            }).text(field.label);
            var input = $('<input/>', {
               'class': 'form-control',
               'type': 'date',
               'id': field.cid
            }).css({
               'color': colorTheme.color4
            })
            wrapper.append(label);
            wrapper.append(input);

            if (field.field_options.description) {
               // help text perhaps?
               wrapper.append($('<small/>', {
                  'class': 'text-muted'
               }).text(field.field_options.description).prepend('<hr/>'))
            }

            canvas.append(wrapper);
            break;
         }
      case FieldTypes.FILE:
         {
            info('Loading field: ' + field.label)
            var wrapper = $('<div/>', {
               'class': 'panel form-group field-panel'
            })
            var label = $('<label/>', {
               'class': 'control-label'
            }).text(field.label);
            var input = $('<input/>', {
               'class': 'form-control',
               'type': 'file',
               'id': field.cid
            })

            var fileHiddenVal = $('<input/>', {
               'type': 'hidden',
               'id': 'file-data-uri-' + field.cid
            })

            canvas.append(fileHiddenVal);

            input.on('change', function(evt) {
               var files = evt.target.files;
               var file = files[0];
               var reader = new FileReader();
               reader.onload = function() {
                  console.log(this.result);
                  fileHiddenVal.val(this.result);
               }
               if (file) {
                  reader.readAsDataURL(file);
               }
            });

            wrapper.append(label);
            wrapper.append(input);

            if (field.field_options.description) {
               // help text perhaps?
               wrapper.append($('<small/>', {
                  'class': 'text-muted'
               }).text(field.field_options.description).prepend('<hr/>'))
            }

            canvas.append(wrapper);
            break;
         }
      case FieldTypes.BARCODE:
         {
            info('Loading field: ' + field.label)
            var wrapper = $('<div/>', {
               'class': 'panel form-group field-panel'
            })
            var label = $('<label/>', {
               'class': 'control-label'
            }).text(field.label);
            var input = $('<input/>', {
               'class': 'form-control',
               'type': 'file',
               'accept': "image/*",
               'id': field.cid
            }).css({
               'display': 'none'
            })

            var fileHiddenVal = $('<input/>', {
               'type': 'hidden',
               'id': 'barcode-data-uri-' + field.cid
            })

            canvas.append(fileHiddenVal);
            wrapper.append(label);
            wrapper.append(input);

            var wrapper2 = $('<div/>', {
               'class': 'row'
            });
            var camContainer = $('<div/>', {
               'class': 'col-sm-5'
            });

            var trigger = $('<button/>', {
               'class': 'btn',
               'type': 'text',
               'id': field.cid,
               'title': 'Click to Read a QRCODE Image'
            }).append($('<i/>', {
               'class': 'fa fa-4x fa-qrcode',

            })).css({
               'font-size': 'large',
               'background-color': colorTheme.color4.toHexString(),
               'color': colorTheme.color2.toHexString()
            }).click(function() {
               input.click(); // let's trigger file picker on hidden input
            })

            var result = $('<small/>', {
               'class': 'text-success'
            });

            camContainer.append(trigger)
            wrapper2.append(camContainer)

            var previewContainer = $('<div/>', {
               'class': 'col-sm-5 col-sm-offset-2'
            });

            var preview = $('<div/>', {
               'id': 'qr-snap-' + field.cid,
               'class': 'cam-preview snap',
               'style': 'border:2px dashed ' + colorTheme.color4.toHexString()
            })

            input.on('change onpropertychange', function(evt) {
               var files = evt.target.files;
               var file = files[0];
               var reader = new FileReader();
               reader.onload = function() {
                  console.log(this.result);
                  var img = $('<img class="img img-responsive" src="' + this.result + '"/>');
                  $('#qr-snap-' + field.cid).empty();
                  $('#qr-snap-' + field.cid).append(img);
                  QCodeDecoder()
                     .decodeFromImage(img[0], function(er, res) {
                        if (er) {
                           error('There was an error while trying to parse the code<br/>' + er);
                           result.text(er).attr({
                              'class': 'text-danger'
                           });
                           fileHiddenVal.val('');
                           return;
                        }
                        console.log(res);
                        fileHiddenVal.val(res);
                        result.text(res).attr({
                           'class': 'text-success'
                        });
                     });
               }
               if (file) {
                  reader.readAsDataURL(file);
               }
            });

            previewContainer.append(preview)
            wrapper2.append(previewContainer)
            wrapper.append(wrapper2);

            wrapper.append(result);

            if (field.field_options.description) {
               // help text perhaps?
               wrapper.append($('<small/>', {
                  'class': 'text-muted'
               }).text(field.field_options.description).prepend('<hr/>'))
            }

            canvas.append(wrapper);
            break;
         }
      case FieldTypes.TIME:
         {
            info('Loading field: ' + field.label)
            var wrapper = $('<div/>', {
               'class': 'panel form-group field-panel'
            })
            var label = $('<label/>', {
               'class': 'control-label'
            }).text(field.label);

            var input = $('<div/>', {
                  'class': 'input-group'
               })
               .append(
                  $('<span/>', {
                     'class': 'input-group-addon'
                  }).append($('<i/>', {
                     'class': 'fa fa-clock-o'
                  })),
                  $('<input/>', {
                     'id': field.cid,
                     'type': 'time',
                     'placeholder': "TIME",
                     'class': 'form-control'
                  }).css({
                     'color': colorTheme.color4
                  }));

            wrapper.append(label);
            wrapper.append(input);

            if (field.field_options.description) {
               // help text perhaps?
               wrapper.append($('<small/>', {
                  'class': 'text-muted'
               }).text(field.field_options.description).prepend('<hr/>'))
            }

            canvas.append(wrapper);
            break;
         }
      case FieldTypes.DROPDOWN:
         {
            info('Loading field: ' + field.label)
            var wrapper = $('<div/>', {
               'class': 'panel form-group field-panel'
            })
            var label = $('<label/>', {
               'class': 'control-label'
            }).text(field.label);
            var input = $('<select/>', {
               'class': 'form-control',
               'id': field.cid
            }).css({
               'color': colorTheme.color4
            })
            $.each(field.field_options.options, function(i, option) {
               input.append($('<option/>').text(option.label).attr({
                  'selected': option.checked ? 'selected' : 'false'
               }));
            });
            wrapper.append(label);
            wrapper.append(input);

            if (field.field_options.description) {
               // help text perhaps?
               wrapper.append($('<small/>', {
                  'class': 'text-muted'
               }).text(field.field_options.description).prepend('<hr/>'))
            }

            canvas.append(wrapper);
            break;
         }
      case FieldTypes.CHECK_BOXES:
         {
            info('Loading field: ' + field.label)
            var wrapper = $('<div/>', {
               'class': 'panel form-group field-panel'
            })
            var label = $('<label/>', {
               'class': 'control-label'
            }).text(field.label);
            wrapper.append(label);

            $.each(field.field_options.options, function(i, option) {
               var input = $('<div/>', {
                     'class': 'checkbox'
                  })
                  .append(
                     $('<label/>').text(option.label).prepend(
                        $('<input/>', {
                           'name': field.cid,
                           'id': field.cid + '' + i,
                           'type': 'checkbox',
                           'value': option.label
                        }).prop('checked', option.checked)
                     ));
               wrapper.append(input);
            });

            if (field.field_options.include_other_option) {
               var input = $('<div/>', {
                     'class': 'input-group'
                  })
                  .append(
                     $('<span/>', {
                        'class': 'input-group-addon'
                     }).append($('<input/>', {
                        'name': field.cid,
                        'id': "other_" + field.cid,
                        'type': 'checkbox'
                     })),
                     $('<input/>', {
                        'name': "other_val_" + field.cid,
                        'id': "other_val_" + field.cid + '',
                        'type': 'text',
                        'placeholder': "Other...",
                        'class': 'form-control'
                     }).on('change', function() {
                        $("#other_" + field.cid).val($(this).val().trim())
                     }));

               wrapper.append(input);
            }

            if (field.field_options.description) {
               // help text perhaps?
               wrapper.append($('<small/>', {
                  'class': 'text-muted'
               }).text(field.field_options.description).prepend('<hr/>'))
            }

            canvas.append(wrapper);
            break;
         }
      case FieldTypes.RADIO:
         {
            info('Loading field: ' + field.label)
            var wrapper = $('<div/>', {
               'class': 'panel form-group field-panel'
            })
            var label = $('<label/>', {
               'class': 'control-label'
            }).text(field.label);
            wrapper.append(label);

            $.each(field.field_options.options, function(i, option) {
               var input = $('<div/>', {
                     'class': 'radio'
                  })
                  .append(
                     $('<label/>').text(option.label).prepend(
                        $('<input/>', {
                           'name': field.cid,
                           'id': field.cid + '' + i,
                           'type': 'radio',
                           'value': option.label
                        }).prop('checked', option.checked)
                     ));
               wrapper.append(input);
            });

            if (field.field_options.include_other_option) {
               var input = $('<div/>', {
                     'class': 'input-group'
                  })
                  .append(
                     $('<span/>', {
                        'class': 'input-group-addon'
                     }).append($('<input/>', {
                        'name': field.cid,
                        'id': "other_" + field.cid,
                        'type': 'radio'
                     })),
                     $('<input/>', {
                        'name': "other_val_" + field.cid,
                        'id': "other_val_" + field.cid + '',
                        'type': 'text',
                        'placeholder': "Other...",
                        'class': 'form-control'
                     }).on('change', function() {
                        $("#other_" + field.cid).val($(this).val().trim())
                     }));

               wrapper.append(input);
            }

            if (field.field_options.description) {
               // help text perhaps?
               wrapper.append($('<small/>', {
                  'class': 'text-muted'
               }).text(field.field_options.description).prepend('<hr/>'))
            }

            canvas.append(wrapper);
            break;
         }
      case FieldTypes.PARAGRAPH:
         {
            info('Loading field: ' + field.label)
            var wrapper = $('<div/>', {
               'class': 'panel form-group field-panel'
            })
            var label = $('<label/>', {
               'class': 'control-label'
            }).text(field.label);
            var input = $('<textarea/>', {
               'class': 'form-control',
               'id': field.cid
            }).css({
               'color': colorTheme.color4
            })
            wrapper.append(label);
            wrapper.append(input);

            if (field.field_options.description) {
               // help text perhaps?
               wrapper.append($('<small/>', {
                  'class': 'text-muted'
               }).text(field.field_options.description).prepend('<hr/>'))
            }

            canvas.append(wrapper);
            break;
         }
      case FieldTypes.SHOW_IMAGE:
         {
            info('Loading field: ' + field.label)
            var wrapper = $('<div/>', {
               'class': 'panel form-group field-panel'
            })
            var label = $('<label/>', {
               'class': 'control-label'
            }).text(field.label);
            var input = $('<img/>', {
               'class': 'img img-responsive img-rounded',
               'src': field.field_options.description
            });

            wrapper.append(label);
            wrapper.append(input);

            canvas.append(wrapper);
            break;
         }
      case FieldTypes.SHOW_INFO:
         {
            info('Loading field: ' + field.label)
            var wrapper = $('<div/>', {
               'class': 'panel form-group field-panel'
            })
            var label = $('<label/>', {
               'class': 'control-label'
            }).css({
               'font-weight': 'bold'
            }).text(field.label);

            var input = $('<p/>').text(field.field_options.description);

            wrapper.append(label);
            wrapper.append(input);

            canvas.append(wrapper);
            break;
         }
   }
}

function bootstrapHistorionFromURL(personaURL) {
   $.ajax({
      url: personaURL,
      method: 'get'
   }).done(function(data) {
      success("A persona has been loaded successfully. Wait as it gets rendered...");
      if (typeof data === 'string' || data instanceof String) {
         loadNewPersona(JSON.parse(data));
      } else {
         loadNewPersona(data);
      }
   }).fail(function() {
      error("Fetching the persona from the URL has failed! Can't bootstrap this Histrion. Try Reseting...");
   })
}

function getActivePersona() {

   var activePersonaUUID = localStorage.getItem(DB_KEYS.ACTIVE_PERSONA_UUID);
   var knownPersonas = localStorage.getItem(DB_KEYS.PERSONA_DICTIONARY);
   if ((activePersonaUUID == null) || (knownPersonas == null)) {
      error("Failed to load the active persona from the local cache...");
      return null;
   }

   knownPersonas = JSON.parse(knownPersonas);
   return knownPersonas[activePersonaUUID];
}

function init() {
   //var personaURL = "https://api.myjson.com/bins/438v2";
   //bootstrapHistorionFromURL(personaURL);
   var activePersonaUUID = localStorage.getItem(DB_KEYS.ACTIVE_PERSONA_UUID);
   if ((activePersonaUUID != null) && (activePersonaUUID != "null")) {
      loadNewPersona(getActivePersona());
   } else {
      showGettingStarted();
   }
}

function showGettingStarted() {
   $('#app-title').text("The (Web) Histrion").fitText();
   $(document).prop('title', "The (Web) Histrion");

   var appContainer = $('#app-base');
   var appCanvas = $('#app-body');

   // apply our theme to the various elements

   appContainer.css({
      'background-color': '#fff'
   });
   appContainer.find('.panel').css({
      'background-color': '#fff'
   });
   appContainer.find('.panel-heading').css({
      'background-color': "#f5f5f5",
      'color': '#333',
      'text-shadow': 'gray' + ' 3px 3px 3px'
   });
   $('body').css({
      'background-color': "#f5f5f5"
   });
   appContainer.find('.panel').css({
      'border-color': '#f5f5f5'
   });

   appCanvas.css({
      'color': 'inherit'
   });

   appCanvas.empty();
   $('#btnSave,#btnSubmit').hide(); // we won't use them here  

   info("It's too lonely here ;-) <br/>Perhaps, go to the <b>PERSONAS</b> section and import an app...<hr/>Alternatively, read more about the Histrion, and all of <b><a href='https://nuscribes.com/scribes_app/book/40/read/?#chapter-500' target='_blank'>Project-Okot, on NuScribes.</a></b>");
}

function acts() {
   var savedActs = localStorage.getItem(DB_KEYS.SAVED_ACTS);
   if (savedActs == null) {
      info("There are no acts (saved data) in the local cache.");
   } else
      savedActs = JSON.parse(savedActs);

   renderActsManagement(savedActs);
}

function renderActsManagement(savedActs) {
   // set title to app's...
   $('#app-title').text("Saved Acts").fitText();
   $(document).prop('title', "Saved Acts");
   // get some some color pallete based off the app's theme color
   var color1 = tinycolor('#490A3D')
   var theme = color1.monochromatic(8);
   var themePallette = {
      color1: color1,
      color2: theme[1],
      color3: theme[2],
      color4: theme[3],
      color5: theme[4],
      color6: theme[5],
      color7: theme[6],
      color8: theme[7]
   }

   var appContainer = $('#app-base');
   var appCanvas = $('#app-body');

   // apply our theme to the various elements

   appContainer.css({
      'background-color': themePallette.color2.toHexString()
   });
   appContainer.find('.panel').css({
      'background-color': themePallette.color3.toHexString()
   });
   appContainer.find('.panel-heading').css({
      'background-color': "#f5f5f5",
      'color': '#333',
      'text-shadow': 'gray' + ' 3px 3px 3px'
   });
   $('body').css({
      'background-color': "#f5f5f5"
   });
   appContainer.find('.panel').css({
      'border-color': themePallette.color5.toHexString()
   });

   appCanvas.css({
      'color': themePallette.color6.toHexString()
   });

   appCanvas.empty();
   $('#btnSave,#btnSubmit').hide(); // we won't use them here     

   if (savedActs != null) {
      var count = 0;
      for (personaUUID in savedActs) {
         var personaActs = savedActs[personaUUID];
         renderPersonaActsPanel(appCanvas, personaActs, themePallette);
         count += personaActs.length;
      }

      if (count > 0)
         success(count + " acts have been loaded for management. You may now proceed to preview, submit or delete them.");
      else
         info("Yippie!! There were no acts available in the cache.");
   } else
      info("Yippie!! There were no acts available in the cache.");

}

function renderPersonaActsPanel(canvas, personaActs, colorTheme) {
   if (personaActs == null)
      return;
   if (personaActs.length == 0)
      return;

   var panelHeading = $('<div/>', {
      'class': 'panel-heading'
   }).css({
      'color': colorTheme.color1.toHexString()
   });
   var panel = $('<div/>', {
      'class': 'panel panel-default persona-panel',
   }).append(panelHeading);

   var panelBody = $('<div/>', {
      'class': 'panel-body',
   }).css({
      'color': colorTheme.color1.toHexString()
   });

   panel.append(panelBody);
   canvas.append(panel);

   $.each(personaActs, function(i, act) {

      console.log(act);

      var persona = JSON.parse(act.PERSONA);
      var fieldMap = null;

      if (persona != null) {
         if (persona.persona != undefined)
            persona = persona.persona;
         panelHeading.text(persona.app.name);
         fieldMap = {}
         for (var i = 0; i < persona.fields.length; i++) {
            var field = persona.fields[i];
            fieldMap[field.cid] = field;
         }

         if (persona != null) {
            if (persona.app.color) {
               var color1 = tinycolor(persona.app.color);
               panelBody.css({
                  'background-color': color1.toHexString()
               });
            }
         }
      } else {
         panelHeading.text(act.CACHE_APP_NAME || act.UUID || "Unknown Persona");
      }

      var details = $('<ul/>', {
         'class': 'list-group'
      });

      var skip = ['PERSONA', 'UUID', 'CACHE_THEATRE_ADDRESS', 'CACHE_APP_NAME', 'CACHE_TIMESTAMP'];
      for (var k in act) {
         if (skip.indexOf(k) >= 0)
            continue;
         console.log(k);
         var val = act[k];

         var label = fieldMap != null ? fieldMap[k].label : k;

         if (val.startsWith('data:')) {
            details.append($('<li/>', {
               'class': 'list-group-item'
            }).append($('<b>' + label + '</b>'),
               $('<iframe/>', {
                  'frameborder': 0,
                  'src': val
               }).css({
                  'width': '100%',
                  'height': '200px'
               })));
         } else {
            details.append($('<li/>', {
               'class': 'list-group-item'
            }).html(
               '<b>' + label + '</b><br/><i>' + val + '</i>'
            ));
         }

      }

      var toolbar = $('<div/>', {
         'class': "btn-group",
         'role': "group"
      });

      if (persona != null) {
         var submitBtn = $('<button/>', {
            'class': 'btn btn-success'
         }).text('SUBMIT');

         toolbar.append(submitBtn);

         var isPosting = false;
         submitBtn.click(function() {
            if (isPosting)
               return;
            isPosting = true;
            submitActToTheatre(act, persona, function() {
               // success
               isPosting = false;
               success("Posted the Act successfully...");
               deleteAct(act, persona.app.uuid, function() {
                  // success
                  success("Act has been deleted.")
                  isPosting = false;
                  acts();
               }, function() {
                  // fail
                  success("Act has been deleted.")
                  isPosting = false;
                  acts();
               });
            }, function() {
               // failed...
               isPosting = false;
               error("Failed to post the Act!");

            });
         });
      }

      var deleteBtn = $('<button/>', {
         'class': 'btn btn-danger'
      }).text('DELETE');

      deleteBtn.click(function() {
         deleteAct(act, persona.app.uuid, function() {
            // success
            success("Act has been deleted.")
            isPosting = false;
         }, function() {
            // fail
            success("Act has been deleted.")
            isPosting = false;
         });
         acts(); // we'd better just reload the management console...
      })

      toolbar.append(deleteBtn);

      details.append($('<li/>', {
         'class': 'list-group-item'
      }).append(toolbar));

      panelBody.append(details);

   });

}

function deleteFromArray(obj, array, comparator) {
   return array.filter(function(e) {
      return comparator(obj) != comparator(e);
   })
}

function deleteAct(act, UUID, successCallback, failCallback) {
   var savedActs = localStorage.getItem(DB_KEYS.SAVED_ACTS);
   if (savedActs != null) {
      savedActs = JSON.parse(savedActs);
   } else {
      error("Failed to delete this Act! The cache is null.");
      failCallback();
      return;
   }

   // savedActs is { UUID1 : [Act1, Act2,... ], UUID2: [...], ... }

   if (UUID == null) {
      error("UUID for this act wasn't set. Can't proceed.");
      failCallback();
      return;
   } else {

      var actsForUUID = savedActs[UUID];
      if (actsForUUID == undefined) {
         error("The persona referenced has no acts in the cache! Can't proceed.");
         failCallback();
         return;
      }

      actsForUUID = deleteFromArray(act, actsForUUID, function(e) {
         return e['CACHE_TIMESTAMP'];
      });
      savedActs[UUID] = actsForUUID;

      localStorage.setItem(DB_KEYS.SAVED_ACTS, JSON.stringify(savedActs));

      success("Act has been successfully deleted. You may continue to manage...", true);
      successCallback();
      acts();
   }
}

function manage() {
   var knownPersonas = localStorage.getItem(DB_KEYS.PERSONA_DICTIONARY);
   if (knownPersonas == null) {
      error("There are no personas in the local cache. You might want to first import a persona from a theatre, persona repository or design and import one from a persona studio.");
   } else
      knownPersonas = JSON.parse(knownPersonas);

   renderPersonaManagement(knownPersonas);
}

function renderPersonaManagement(knownPersonas) {
   // set title to app's...
   $('#app-title').text("Manage Personas").fitText();
   $(document).prop('title', "Manage Personas");
   // get some some color pallete based off the app's theme color
   var color1 = tinycolor('#490A3D')
   var theme = color1.monochromatic(8);
   var themePallette = {
      color1: color1,
      color2: theme[1],
      color3: theme[2],
      color4: theme[3],
      color5: theme[4],
      color6: theme[5],
      color7: theme[6],
      color8: theme[7]
   }

   // apply our theme to the various elements
   var appCanvas = $('#app-body');
   var appContainer = $('#app-base');

   appContainer.css({
      'background-color': themePallette.color2.toHexString()
   });
   appContainer.find('.panel').css({
      'background-color': themePallette.color3.toHexString()
   });
   appContainer.find('.panel-heading').css({
      'background-color': "#f5f5f5",
      'color': '#333',
      'text-shadow': 'gray' + ' 3px 3px 3px'
   });
   $('body').css({
      'background-color': "#f5f5f5"
   });
   appContainer.find('.panel').css({
      'border-color': themePallette.color5.toHexString()
   });

   appCanvas.css({
      'color': themePallette.color6.toHexString()
   });

   appCanvas.empty();
   $('#btnSave,#btnSubmit').hide(); // we won't use them here     
   renderPersonaImportPanel(appCanvas, themePallette);

   if (knownPersonas != null) {
      var count = 0;
      for (personaUUID in knownPersonas) {
         var persona = knownPersonas[personaUUID];
         renderPersonaManagementPanel(appCanvas, persona, themePallette);
         count++;
      }

      if (count > 0)
         info(count + " personas have been loaded for management. You may now proceed to activate, delete or import new personas...");
      else
         warning("There were no personas available in the cache. You may want to import some, to get started.<hr/><b>EXAMPLE</b> Try loading the official demo persona by importing from this URL:<br/><br/> <cite>https://theatre.nuchwezi.com/api/persona/49d1463a-d977-4ceb-9dac-e5c70b521444/</cite>");
   } else
      warning("There were no personas available in the cache. You may want to import some, to get started.<hr/><b>EXAMPLE</b> Try loading the official demo persona by importing from this URL:<br/><br/> <cite>https://theatre.nuchwezi.com/api/persona/49d1463a-d977-4ceb-9dac-e5c70b521444/</cite>");

}

function renderPersonaImportPanel(canvas, colorTheme) {

   var container = $('<div/>', {
      'class': 'row'
   });
   var panel = $('<div/>', {
      'class': 'panel panel-warning'
   }).append(
      $('<div/>', {
         'class': 'panel-heading'
      }).append($('<h1 class="panel-title">IMPORT New Personas</h1>')),
      $('<div/>', {
         'class': 'panel-body'
      }).append(container));

   var panel1 = $('<div/>', {
      'class': 'col-md-6'
   });
   var panel2 = $('<div/>', {
      'class': 'col-md-6'
   });

   container.append(panel1);
   container.append(panel2);
   canvas.append(panel);

   var uriImportBtn = $('<button/>', {
      'class': 'btn btn-default'
   }).text('From URL');
   var uriImportField = $('<input/>', {
      'class': 'form-control',
      'type': 'url',
      'placeholder': 'Paste/Enter URL pointing to a persona to import'
   });
   var div = $('<div/>', {
      'class': 'input-group'
   }).append(
      uriImportField,
      $('<span/>', {
         'class': 'input-group-btn'
      }).append(uriImportBtn))
   panel1.append(div);
   uriImportBtn.click(function() {
      var url = uriImportField.val().trim();
      if (url.length == 0) {
         error("Can't import from a blank URL!", true);
         return;
      }
      info("Please wait as I try to fetch a persona from the specified URL...");
      bootstrapHistorionFromURL(url);
   });

   var fileImportField = $('<input/>', {
      'class': 'form-control input-lg',
      'type': 'file',
      'title': 'Pick a *.persona file or other, from which to import from'
   });
   var div2 = $('<div/>', {
      'class': 'form-group'
   }).append(
      fileImportField)
   panel1.append(div2);

   fileImportField.on('change', function(evt) {
      var files = evt.target.files;
      var file = files[0];
      var reader = new FileReader();
      reader.onload = function() {
         console.log(this.result);
         loadNewPersona(JSON.parse(this.result));
      }
      reader.readAsText(file)
   });

   var jsonImportField = $('<textarea/>', {
      'class': 'form-control',
      'type': 'file',
      'rows': 5,
      'placeholder': 'You can either paste or type valid Persona JSON here, and then attempt to import from that. But, the best recommendation is to use JSON generated from a supported Persona Studio.'
   });
   var jsonImportBtn = $('<button/>', {
      'class': 'btn btn-default'
   }).text('From JSON');
   var div3 = $('<div/>', {
      'class': 'form-group'
   }).append(
      jsonImportField, jsonImportBtn)
   panel2.append(div3);
   jsonImportBtn.click(function() {
      var personaJSON = jsonImportField.val().trim();
      if (personaJSON.length == 0) {
         error("Please enter valid Persona JSON!", true);
         return;
      }
      loadNewPersona(JSON.parse(personaJSON));
   })

}

function renderPersonaManagementPanel(canvas, persona, colorTheme) {
   info("Found persona: " + persona.app.name);

   var panel = $('<div/>', {
      'class': 'panel panel-default persona-panel',
   }).append($('<div/>', {
      'class': 'panel-heading'
   }).text(persona.app.name).css({
      'color': colorTheme.color1
   }));

   var panelBody = $('<div/>', {
      'class': 'panel-body',
   }).css({
      'color': colorTheme.color1
   });

   var media = $('<div/>', {
      'class': 'row'
   });
   var img = $('<img/>', {
      'class': 'img img-responsive img-rounded',
      'src': persona.app.brand_image || DEFAULT_PERSONA_BRAND_IMAGE_URI[Math.floor(Math.random() * DEFAULT_PERSONA_BRAND_IMAGE_URI.length)]
   });
   media.append($('<div/>', {
      'class': 'col-md-6'
   }).append(img));

   var details = $('<ul/>', {
      'class': 'list-group'
   });
   details.append($('<li/>', {
      'class': 'list-group-item'
   }).text(persona.app.description));

   details.append($('<li/>', {
      'class': 'list-group-item'
   }).html('<b>' + persona.app.transport_mode + " </b>: <i>" + persona.app.theatre_address + "</i>"));
   details.append($('<li/>', {
      'class': 'list-group-item'
   }).html('<b>UUID</b>: <i>' + persona.app.uuid + "</i>"));

   var activateBtn = $('<button/>', {
      'id': 'btn-activate-' + persona.app.uuid,
      'class': 'btn btn-success'
   }).text('ACTIVATE');
   var deleteBtn = $('<button/>', {
      'id': 'btn-deletee-' + persona.app.uuid,
      'class': 'btn btn-danger'
   }).text('DELETE');

   activateBtn.click(function() {
      cacheActivePersona(persona, true);
      info(persona.app.name + " has been saved as the active persona.", true);
   });
   deleteBtn.click(function() {
      deletePersona(persona);
      info(persona.app.name + " has been deleted from the cache.");
      manage(); // we'd better just reload the management console...
   })

   var toolbar = $('<div/>', {
      'class': "btn-group",
      'role': "group"
   }).append(activateBtn, deleteBtn);

   details.append($('<li/>', {
      'class': 'list-group-item'
   }).append(toolbar));
   media.append($('<div/>', {
      'class': 'col-md-6'
   }).append(details));
   panelBody.append(media);
   panel.append(panelBody);
   canvas.append(panel);
}

function deletePersona(persona) {
   var uuid = persona.app.uuid;
   if (uuid == null) {
      // complain...
      error("<b>Persona Deletion Failed</b><br/>Unfortunately, this person lacks a UUID, and so it can't be located in the cache.");
      return
   }

   var knownPersonas = localStorage.getItem(DB_KEYS.PERSONA_DICTIONARY);
   if (knownPersonas != null) {
      knownPersonas = JSON.parse(knownPersonas);
      delete knownPersonas[uuid];
      localStorage.setItem(DB_KEYS.PERSONA_DICTIONARY, JSON.stringify(knownPersonas));
   }

   // just in case this was the active persona...
   var activePersonaUUID = localStorage.getItem(DB_KEYS.ACTIVE_PERSONA_UUID);
   if (activePersonaUUID == persona.app.uuid) {
      localStorage.setItem(DB_KEYS.ACTIVE_PERSONA_UUID, null); // removeItem and delete o[key] don't see to work for some strange reason...
      warning("The active persona has been deactivated.", true);
   }
}

$(function() {

   // user wants to manually init histrion...
   $('#refresh').click(function() {
      warning("You have requested that I reload the Histrion. Please wait as I load the active persona... ")
      init();
   })

   // load saved acts management interface...
   $('#cache').click(function() {
      info("Wait as I load the saved acts interface...")
      acts();
   })

   // load persona management interface...
   $('#manage').click(function() {
      info("Wait as I load the persona management interface...")
      manage();
   })

   init(); // initialize the histrion the first time...
});

String.prototype.replaceAll = function(search, replacement) {
   var target = this;
   return target.replace(new RegExp(search, 'g'), replacement);
};

/* a replacement of the default alert dialog... */
$(document).ready(function() {
   window._alert = window.alert;
   window.alertStack = [];
   window.alert = function(message, title, timeOut) {

      if (window.alertStack.indexOf(message) >= 0)
         return;

      window.alertStack.push(message);

      var modalTemplate = $('#modalTemplate').html();

      modalTemplate = modalTemplate.replaceAll("{message}", message);
      modalTemplate = modalTemplate.replaceAll("{title}", title || "Attention");
      var alertId = "alertModal_" + (new Date()).getTime();
      modalTemplate = modalTemplate.replaceAll("{id}", alertId);

      $('#modalContainer').empty();
      var modalEl = $('#modalContainer').append($(modalTemplate));

      $('#' + alertId).modal({
         show: false
      })
      $('#' + alertId).modal('show');

      if (timeOut) {
         setTimeout(function() {
            $('#' + alertId).modal('hide');
         }, timeOut);
      }

      $('#' + alertId).on('hidden.bs.modal', function() {
         delete window.alertStack[window.alertStack.indexOf(message)];
      })

   }
});

function closeModal(modalID) {
   $('#' + modalID).trigger('hidden.bs.modal');
   $('#' + modalID).modal('toggle');
   $('#' + modalID).detach();
   $('body').removeClass('modal-open');
   $('.modal-backdrop:first').remove();
}
