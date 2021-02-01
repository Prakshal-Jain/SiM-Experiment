jsPsych.plugins['audio-slider-response'] = (function () {
  var plugin = {};

  jsPsych.pluginAPI.registerPreload('audio-slider-response', 'stimulus', 'audio');

  plugin.info = {
    name: 'audio-slider-response',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.AUDIO,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The image to be displayed'
      },
      replay: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Replay',
        default: true,
        description: 'If true, the participant will be able to replay.'
      },
      autoplay: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Autoplay',
        default: true,
        description: 'If true, the audio will autoplay.'
      },
      min: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Min slider',
        default: 0,
        description: 'Sets the minimum value of the slider.'
      },
      max: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Max slider',
        default: 100,
        description: 'Sets the maximum value of the slider',
      },
      start: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Slider starting value',
        default: 50,
        description: 'Sets the starting value of the slider',
      },
      step: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Step',
        default: 1,
        description: 'Sets the step of the slider'
      },
      labels: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Labels',
        default: [],
        array: true,
        description: 'Labels of the slider.',
      },
      slider_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Slider width',
        default: null,
        description: 'Width of the slider in pixels.'
      },
      slider_name: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Slider Name',
        default: null,
        description: 'Slider name in results.'
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default: 'Continue',
        array: false,
        description: 'Label of the button to advance.'
      },
      require_movement: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Require movement',
        default: false,
        description: 'If true, the participant will have to move the slider before continuing.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the slider.'
      },
      preamble: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Preamble',
        default: null,
        description: 'HTML formatted string to display at the top of the page above all the questions.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show the trial.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, trial will end when user makes a response.'
      },
    }
  }

  plugin.trial = function (display_element, trial) {

    // setup stimulus
    var context = jsPsych.pluginAPI.audioContext();
    if (context !== null) {
      var source = context.createBufferSource();
      source.buffer = jsPsych.pluginAPI.getAudioBuffer(trial.stimulus);
      source.connect(context.destination);
    } else {
      var audio = jsPsych.pluginAPI.getAudioBuffer(trial.stimulus);
      audio.currentTime = 0;
    }

    //var html = '';

    

    var html = '<div id="jspsych-audio-slider-response-wrapper" style="margin: 100px 0px;">';

    html += '</div>';
    //html += '</div>';

    if (trial.preamble !== null) {
      html += '<div id="jspsych-audio-slider-preamble" class="jspsych-audio-slider-preamble">' + trial.preamble + '<br><br></div>';
    }


    html += '<div class="jspsych-audio-slider-response-container" style="position:relative; margin: 0 auto 3em auto; ';

    if (trial.slider_width !== null) {
      html += 'width:' + trial.slider_width + 'px;';
    }
    html += '">';

    if (trial.prompt !== null) {
      html += trial.prompt;
    };
    html += '<input type="range" value="' + trial.start + '" min="' + trial.min + '" max="' + trial.max + '" step="' + trial.step + '" style="width: 100%;" id="jspsych-audio-slider-response-response"></input>';
    html += '<div>'
    for (var j = 0; j < trial.labels.length; j++) {
      var width = 100 / (trial.labels.length - 1);
      var left_offset = (j * (100 / (trial.labels.length - 1))) - (width / 2);
      html += '<div style="display: inline-block; position: absolute; left:' + left_offset + '%; text-align: center; width: ' + width + '%;">';
      html += '<span style="text-align: center; font-size: 80%;">' + trial.labels[j] + '</span>';
      html += '</div>'
    }
    html += '</div>';
    html += '</div>';
    html += '</div>';


    var replay_time = 0;
    if (trial.replay == true) {
      html += '<button id="jspsych-audio-slider-response-replay" class="jspsych-btn">' + '&nbsp' + '&nbsp' + 'Replay' + '&nbsp' + '&nbsp' + '</button>';
      html += '&nbsp';
      html += '&nbsp';
      html += '&nbsp';
      html += '&nbsp';
      html += '&nbsp';
    };
    // add submit button
    //html += '<button id="jspsych-audio-slider-response-next" class="jspsych-btn" ' + (trial.require_movement ? "disabled" : "") + '>' + trial.button_label + '</button>';
    html += '<button id="jspsych-audio-slider-response-next" class="jspsych-btn" disabled >' + trial.button_label + '</button>';
    html += '<br><br><br><br>'
    display_element.innerHTML = html;



    var response = {
      rt: null,
      replay: null
    };

    /*if (trial.require_movement) {
      display_element.querySelector('#jspsych-audio-slider-response-response').addEventListener('change', function () {
        display_element.querySelector('#jspsych-audio-slider-response-next').disabled = false;
      })
    }*/

    if (trial.replay == true) {
      display_element.querySelector('#jspsych-audio-slider-response-replay').addEventListener('click', function () {
        display_element.querySelector('#jspsych-audio-slider-response-replay').disabled = true;
        display_element.querySelector('#jspsych-audio-slider-response-next').disabled = true;
        var current_value = display_element.querySelector('#jspsych-audio-slider-response-response').value;
        if (context !== null) {
          source = context.createBufferSource();
          source.buffer = jsPsych.pluginAPI.getAudioBuffer(trial.stimulus);
          source.connect(context.destination);
          source.start();
          source.onended = function () {
            display_element.querySelector('#jspsych-audio-slider-response-replay').disabled = false;
            if (trial.require_movement && current_value == trial.start) {
              display_element.querySelector('#jspsych-audio-slider-response-response').addEventListener('change', function () {
                display_element.querySelector('#jspsych-audio-slider-response-next').disabled = false;
              })
            } else {
              display_element.querySelector('#jspsych-audio-slider-response-next').disabled = false;
            }
          }
        }
        else {
          audio.currentTime = 0;
          audio.play();
          audio.addEventListener('ended', function () {
            display_element.querySelector('#jspsych-audio-slider-response-replay').disabled = false;
            if (trial.require_movement && current_value == trial.start) {
              display_element.querySelector('#jspsych-audio-slider-response-response').addEventListener('change', function () {
                display_element.querySelector('#jspsych-audio-slider-response-next').disabled = false;
              })
            } else {
              display_element.querySelector('#jspsych-audio-slider-response-next').disabled = false;
            }
          })
        }
        replay_time += 1;
      })
    };

    if (trial.trial_ends_after_audio) {
      if (context !== null) {
        source.onended = function () {
          end_trial();
        }
      } else {
        audio.addEventListener('ended', end_trial);
      }
    } else {
      if (context !== null) {
        source.onended = function () {
          if (trial.replay == true) {
            display_element.querySelector('#jspsych-audio-slider-response-replay').disabled = false;
          }
          if (trial.require_movement) {
            display_element.querySelector('#jspsych-audio-slider-response-response').addEventListener('change', function () {
              display_element.querySelector('#jspsych-audio-slider-response-next').disabled = false;
            })
          } else {
            display_element.querySelector('#jspsych-audio-slider-response-next').disabled = false;
          }
        }
      } else {
        audio.addEventListener('ended', function () {
          if (trial.replay == true) {
            display_element.querySelector('#jspsych-audio-slider-response-replay').disabled = false;
          }
          if (trial.require_movement) {
            display_element.querySelector('#jspsych-audio-slider-response-response').addEventListener('change', function () {
              display_element.querySelector('#jspsych-audio-slider-response-next').disabled = false;
            })
          } else {
            display_element.querySelector('#jspsych-audio-slider-response-next').disabled = false;
          }
        })
      }
    }



    display_element.querySelector('#jspsych-audio-slider-response-next').addEventListener('click', function () {
      // measure response time
      var endTime = performance.now();
      var rt = endTime - startTime;
      if (context !== null) {
        endTime = context.currentTime;
        rt = Math.round((endTime - startTime) * 1000);
      }
      response.rt = rt;
      response.response = display_element.querySelector('#jspsych-audio-slider-response-response').value;
      response.replay = replay_time;
      if (trial.response_ends_trial) {
        end_trial();
      } else {
        display_element.querySelector('#jspsych-audio-slider-response-next').disabled = true;
      }

    });

    function end_trial() {

      jsPsych.pluginAPI.clearAllTimeouts();

      if (trial.autoplay == true) {
        if (context !== null) {
          source.stop();
          source.onended = function () { };
        } else {
          audio.pause();
          audio.removeEventListener('ended', end_trial);
        }
      } else {
        if (context !== null) {
          source.onended = function () { };
        } else {
          audio.pause();
          audio.removeEventListener('ended', end_trial);
        }

      }

      // save data
      var trialdata = {
        "rt": response.rt,
        "stimulus": trial.stimulus,
        "replay": response.replay
      };

      trialdata[trial.slider_name] = response.response;

      display_element.innerHTML = '';

      // next trial
      jsPsych.finishTrial(trialdata);
    }

    var startTime = performance.now();
    // start audio
    if (trial.autoplay == true) {
      if (trial.replay == true) {
        display_element.querySelector('#jspsych-audio-slider-response-replay').disabled = true;
      }
      if (context !== null) {
        startTime = context.currentTime;
        source.start(startTime);
      }
      else {
        audio.play();
      }
    } else {
      if (context !== null) {
        startTime = context.currentTime;
      }
      display_element.querySelector('#jspsych-audio-slider-response-next').disabled = false;
    }

    // end trial if trial_duration is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function () {
        end_trial();
      }, trial.trial_duration);
    }


  };

  return plugin;
})();
