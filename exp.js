/* Experiment */

// TOGGLE PILOT OPTIONS
var isPilot = "false"

// if (isPilot == "true") {
//
// }

/* If you want to restrict participation to certain devices, you can indicate that only Desktop, Mobile, or Tablet is allowed in the 'Audience' step of study creation.
 We will then communicate this to our participants before they take part in your study.
 However, this is not enforced automatically, they could still access the study via the non-compatible devices.
 As such, this is different from our prescreening options.
 If you indicate specific device compatibility for your study on Prolific (e.g. desktop-only) and state this requirement in your Study Description,
 participants who ignore these warnings and take part using an unsupported device do not require approval.*/

/* This is to check the new iPad Pros. */
var checkiPad = "undefined"
if (navigator.userAgent.match(/Mac/) && navigator.maxTouchPoints > 2) {
    checkiPad = "iPad"
}

if (checkiPad == "iPad" || String(browser.tablet) !== "undefined" || String(browser.mobile) !== "undefined") {
    alert("The current experiment is not compatible with tablets or mobile devices. Please switch to a laptop or desktop to do the experiment.");
    close();
}

/* Get stimuli from stimuli.json created by files_to_json.py */
var stimuli_list = [];
$.ajax({
    url: "stimuli.json",
    async: false,
    dataType: 'json',
    success: function (data) {
        stimuli_list = data;
    }
});
stimuli_list = jsPsych.randomization.repeat(stimuli_list, 1);

/* Javascript runs on the client side, and using javascript alone cannot access folders / files on the server side.
Also, pavlovia does not allow PHP, jQuery or xmlhttprequest() to access server side folders / files for security reasons.
Thus, stimuli has to be defined and listed in advance. */
/*var stimuli_list = [
    { stimulus: "audio/kamp_cv_max_1.mp3", reliability: 0, test: true, project: "kamp", deviceID: "cv", audioID: "max", sentenceID: "1" },
    { stimulus: "audio/kamp_cv_max_2.mp3", reliability: 0, test: true, project: "kamp", deviceID: "cv", audioID: "max", sentenceID: "2" },
    { stimulus: "audio/kamp_cv_max_3.mp3", reliability: 0, test: true, project: "kamp", deviceID: "cv", audioID: "max", sentenceID: "3" },
    { stimulus: "audio/kamp_mb_max_1.mp3", reliability: 0, test: true, project: "kamp", deviceID: "mb", audioID: "max", sentenceID: "1" },
    { stimulus: "audio/kamp_mb_max_2.mp3", reliability: 0, test: true, project: "kamp", deviceID: "mb", audioID: "max", sentenceID: "2" },
    { stimulus: "audio/kamp_mb_max_3.mp3", reliability: 0, test: true, project: "kamp", deviceID: "mb", audioID: "max", sentenceID: "3" },
    { stimulus: "audio/kamp_vb_max_1.mp3", reliability: 0, test: true, project: "kamp", deviceID: "vb", audioID: "max", sentenceID: "1" },
    { stimulus: "audio/kamp_vb_max_2.mp3", reliability: 0, test: true, project: "kamp", deviceID: "vb", audioID: "max", sentenceID: "2" },
    { stimulus: "audio/kamp_vb_max_3.mp3", reliability: 0, test: true, project: "kamp", deviceID: "vb", audioID: "max", sentenceID: "3" },
    { stimulus: "audio/kamp_wa_max_2.mp3", reliability: 0, test: true, project: "kamp", deviceID: "wa", audioID: "max", sentenceID: "2" },
    { stimulus: "audio/kamp_wa_max_3.mp3", reliability: 0, test: true, project: "kamp", deviceID: "wa", audioID: "max", sentenceID: "3" }];*/



/* To get the number of 20% of the stimuli. */
var percent20 = Math.round(stimuli_list.length * 0.2);

/* Select 20% of the stimuli for reliability;
assign non-zero numbers to reliability trials;
add to reliability list */
var reliability_list = [];
for (let i = 0; i < percent20; i++) {
    stimuli_list[i].reliability = i + 1;
    reliability_list.push(stimuli_list[i]);
}

/* Re-randomize stimuli list;
without this re-randomization, the reliability trials will be the first 20% of the stimuli. */
stimuli_list = jsPsych.randomization.repeat(stimuli_list, 1);

/* Function to get a random number between min and max.
The maximum is inclusive and the minimum is inclusive. */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* To insert the reliability trials back to stimuli list;
the distance between the same reliability trials > the number of 20% of the stimuli.
Do not randomize the list again, otherwise, distance between the same reliability trials won't be guaranteed. */
for (let i = 0; i < percent20; i++) {
    var s_index = stimuli_list.findIndex(x => x.reliability === i + 1);
    var s_right = stimuli_list.length - s_index;

    if (s_right >= s_index) {
        var insert_index = getRandomInt(s_index + percent20 + 1, stimuli_list.length);
        stimuli_list.splice(insert_index, 0, reliability_list[i]);

    } else {
        var insert_index = getRandomInt(0, s_index - percent20 - 1);
        stimuli_list.splice(insert_index, 0, reliability_list[i]);

    }
}

var attention_list = [
    { stimulus: "audio/attention/attention1_70.wav", test: false, choices: ['Who did you meet there?', 'When did you buy it?', 'What do you want?', 'Will she come?', "What's that?"], correct: 4 },
    { stimulus: "audio/attention/attention2_70.wav", test: false, choices: ["That's a good idea.", "He's a good person.", 'I have no idea what you mean.', "It's a good question.", 'Is that true?'], correct: 0 },
    { stimulus: "audio/attention/attention3_70.wav", test: false, choices: ['Take care of yourselves!', "I don't have any children.", 'She took care of the children.', 'We should be very careful.', 'She bought a toy for her child.'], correct: 2 }];

var stimuli_w_attention_list = [...stimuli_list];
for (let i = 0; i < attention_list.length; i++) {
    var insert_index = getRandomInt(0, stimuli_w_attention_list.length);
    stimuli_w_attention_list.splice(insert_index, 0, attention_list[i]);
}
//var stimuli_w_attention_list = stimuli_list.concat(attention_list);
//stimuli_w_attention_list = jsPsych.randomization.repeat(stimuli_w_attention_list, 1);

var check_list = [
    { stimulus: "audio/attention/check1_70.wav", choices: ['Tell me the truth.', 'I agree with you.', 'Show me an example.', 'Tell me a joke.', 'Please come in.'], correct: 3 },
    { stimulus: "audio/attention/check2_70.wav", choices: ['I gave him a book.', 'She borrowed the book from him.', 'May I borrow your car?', 'Give me another example.', 'She sold him her car.'], correct: 1 }];


/* Used to check if a subject has given consent to participate. */
var check_consent = function (elem) {
    if (document.getElementById('consent_checkbox').checked) {
        return true;
    }
    else {
        alert("If you wish to participate, you must check the box next to the statement 'I agree to participate in this study.'");
        return false;
    }
    return false;
};




/* create timeline */
var timeline = [];

/* init connection with pavlovia.org */
var pavlovia_init = {
    type: "pavlovia",
    command: "init"
};
timeline.push(pavlovia_init);

/* generate a random subject ID with 16 characters */
//var participant_id = jsPsych.randomization.randomID(16);

/* add the subject ID to my experiment  making it a property*/
/*jsPsych.data.addProperties({
    participant: participant_id
});*/

jsPsych.data.addProperties({
    browser_name: browser.name, browser_version: browser.version,
    os_name: browser.osname, os_version: browser.osversion,
    screen_resolution: screen.width + ' x ' + screen.height,
    //tablet: String(browser.tablet), mobile: String(browser.mobile),
    // convert explicitly to string so that "undefined" (no response) does not lead to empty cells in the datafile
    //window_resolution: window.innerWidth + ' x ' + window.innerHeight,
});

/* check consent */
var consent_form = {
    type: 'external-html',
    url: "consent_2020-05-12.html",
    cont_btn: "start",
    check_fn: check_consent
};
timeline.push(consent_form);

/* define welcome message trial */
var welcome_block = {
    type: "html-button-response",
    stimulus: "<h2>Welcome to the perception experiment. </h2> <p>In this experiment, you will be asked to listen to audio recordings of amplified speech samples. You will rate the speech along a scale with anchors. Feel free to use as much or as little of the scale as you feel is appropriate. Once the experiment has started, you will be asked not to further adjust your volume or your screen until it has finished.</p>",
    choices: ['Continue']
};
timeline.push(welcome_block);



/* background info, e.g., prolific ID */
var background1 = {
    type: 'survey-text',
    /*preamble: '<h2>A few questions about you</strong></h2>' +
        "<p>Before we can start, we need some information.</p>" +
        "<p>Please answer the following questions.</p>",*/
    questions: [
        {
            name: 'participant',
            prompt: '<p><strong>1.</strong>Please enter your Prolific ID / Participant ID:</p>',
            placeholder: "enter your Prolific ID here",
            required: true
        },
        {
            name: 'age',
            prompt: '<p><strong>2.</strong> What is your age?</p>',
            placeholder: "enter your age here",
            required: true
        },
        {
            name: 'disorder',
            prompt: '<p><strong>3.</strong> To your knowledge, do you have any history of a hearing, speech, language, or neurological disorder?</p>',
            placeholder: "respond with yes or no",
            required: true
        },
        {
            name: 'language',
            prompt: '<p><strong>4.</strong> Did you grow up speaking North American English?</p>',
            placeholder: "respond with yes or no",
            required: true
        },

    ],
    button_label: "Continue",
    on_finish: function (data) {
        jsPsych.data.addProperties({
            participant: data.participant,
            age: data.age,
            disorder: data.disorder,
            language: data.language,
        });
    },
}
timeline.push(background1);

/*check audio*/
var soundcheck = {
    type: "html-button-response",
    stimulus: " <p>Thanks! Now let's check if the sound works properly and is set at a comfortable volume.</p>",
    choices: ['Continue']
};
timeline.push(soundcheck);

var soundcheck1 = {
    type: 'audio-button-response',
    stimulus: check_list[0].stimulus,
    prompt: '<p> Does your sound work properly and is your volume adjusted? You may replay this sound as many times as you like in order to adjust your volume, since you will be asked to NOT adjust your volume once you begin the experiment.</p> <p>When you are ready, click the "Continue" button. If not, adjust the volume and then click "Replay" to listen to the audio again. </p>',
    choices: ['Continue'],
    replay: true
}
timeline.push(soundcheck1)


var soundcheck1_response = {
    type: 'html-button-response',
    stimulus: "<p>Please select the sentence you just heard:</p>" + "<p></p>",
    choices: check_list[0].choices,
    on_finish: function (data) {
        if (data.button_pressed == check_list[0].correct) {
            data.soundcheck = true;
        } else {
            data.soundcheck = false;
        }
    }
};
timeline.push(soundcheck1_response);

var soundcheck2 = {
    type: 'audio-button-response',
    stimulus: check_list[1].stimulus,
    prompt: "<p>Let's try again! Does your sound work properly? </p>" + '<p>If yes, click the "Continue" button. If not, adjust the volume and then click "Replay" to listen to the audio again. </p>',
    choices: ['Continue'],
    replay: true
}

var soundcheck2_response = {
    type: 'html-button-response',
    stimulus: "<p>Please select the sentence you just heard:</p>" + "<p></p>",
    choices: check_list[1].choices,
    on_finish: function (data) {
        if (data.button_pressed == check_list[1].correct) {
            data.soundcheck = true;
        } else {
            data.soundcheck = false;
        }
    }
};

/* if passing soundcheck1, proceed to experiment; else, proceed to soundcheck2 */
var check_if_node = {
    timeline: [soundcheck2, soundcheck2_response],
    conditional_function: function () {
        var last_trial_correct = jsPsych.data.get().last(1).values()[0].soundcheck;
        if (last_trial_correct) {
            return false;
        } else {
            return true;
        }
    }
}
timeline.push(check_if_node)

/* loop soundcheck2 until it's passed */
var check_loop_node = {
    timeline: [check_if_node],
    loop_function: function (data) {
        if (jsPsych.data.get().last(1).values()[0].soundcheck) {
            return false;
        } else {

            return true;
        }
    },
}
timeline.push(check_loop_node)

/*switch to full screen*/
var fullscreen_trial = {
    type: 'fullscreen',
    message: '<p>Great! Now the experiment will switch to full screen mode.</p> <p>Please press the button to continue.</p>',
    fullscreen_mode: true
};
timeline.push(fullscreen_trial);

/*instructions*/
var instruction = {
    type: 'instructions',
    pages: [
        'Welcome to the experiment. Please listen to the speech presented to you in the following task. You will be asked to provide <br> 1) the <strong>Transcription</strong> of the speech: When entering the transcription of what you heard in the audio, pay attention to how loud, strong, or forceful the sound is. <br> 2) ratings of the <strong>Effort</strong> required to understand the audio: When rating the effort to understand the audio, pay attention to how much of the speech you can understand. <br><br> You will be asked to indicate your judgment using text input for the <strong>Transcription</strong> and a sliding scale with anchors (for the <strong>Effort</strong>). You are encouraged to re-input the text and use as much of the scale as you feel is appropriate. <br><br>Once you have begun the experiment, please <strong>DO NOT ADJUST YOUR VOLUME FURTHER.</strong>',
        'For each new utterance, please provide your rating after it finishes playing. <br> While you do have the option to replay each sentence, we ask that you <strong>DO NOT PRESS REPLAY</strong> unless something happens that has made it difficult for you to hear the item (for example, if there is a loud, unexpected sound in your environment).',
        "The experiment is self-paced. Please complete it in one sitting. It is expected to take approximately thirty minutes. Click 'Continue' to start the experiment."
    ],
    button_label_next: 'Continue',
    show_clickable_nav: true
}
timeline.push(instruction);

// ################################################################################
// # Version 1 ####################################################################
// ################################################################################
/* Version 1: simple, one slider, no attention check, force listening */
// var version1 = {
//     type: "html-button-response",
//     stimulus: " <p> Version 1: simple, one slider, no attention check, force listening </p>",
//     choices: ['Continue']
// };
// timeline.push(version1);
//
// for (let i = 0; i < stimuli_list.length; i++) {
//     var j = i + 1;
//     var audio_trial = {
//         type: 'audio-slider-response',
//         stimulus: stimuli_list[i].stimulus,
//         replay: true,
//         autoplay: true,
//         //require_movement: true,
//         labels: ['Not Intelligible', 'Intelligible'],
//         slider_width: 500,
//         prompt: '<p>Intelligibility</p>',
//         preamble: '<p>Instruction: ...............................</p>' + '<p><b>Trial #:' + j + '</b></p>',
//         slider_name: 'intelligibility',
//         data: {//append reliability, order, version and other information to data
//             reliability: stimuli_list[i].reliability, order: j, version: 1,
//             project: stimuli_list[i].project, deviceID: stimuli_list[i].deviceID, audioID: stimuli_list[i].audioID, sentenceID: stimuli_list[i].sentenceID
//         },
//         on_finish: function (data) {
//             data.window_resolution = window.innerWidth + ' x ' + window.innerHeight;
//             if (data.reliability !== "0") { //calculate distance between reliability trials and difference in intelligibility ratings
//                 var reliability_trials = jsPsych.data.get().filter({ reliability: stimuli_list[i].reliability, version: 1 }).values();
//                 if (reliability_trials.length == 2) {
//                     data.reliability_distance = reliability_trials[1].order - reliability_trials[0].order;
//                     data.intelligibility_diff = reliability_trials[1].intelligibility - reliability_trials[0].intelligibility;
//                 }
//             }
//
//         }
//     };
//     timeline.push(audio_trial);
// };

// ################################################################################
// # Version 2 ####################################################################
// ################################################################################
/* Version 2: one slider per page, several pages per stimulus, no attention check, force listening */
// var version2 = {
//     type: "html-button-response",
//     stimulus: " <p> Experiment ID: KAmp IE. Press Continue when you are ready to begin the experiment. </p>",
//     // stimulus: " <p> Version 2: one slider per page, several pages per stimulus, no attention check, force listening </p>",
//     choices: ['Continue']
// };
// timeline.push(version2);

/* Set up number of sliders, and labels, prompt, and name (to be reported in results) for each slider.
Number of sliders and number of slider names must match. */
var scount = 2;
var slabels = [['Very easy to understand', 'Very difficult to understand']];
var sprompts = ['the speech and transcribe what you hear', 'the Effort required to understand the speech'];
var snames = ['Transcription', 'Effort'];

if (isPilot == "true") {
  length = 2;
} else {
  length = stimuli_list.length;
}

for (let i = 0; i < length; i++) {//loop through the silmuli list
//for (let i = 0; i < 5; i++) {//loop through the silmuli list
    var j = i + 1;
    var trial_start = {
        type: "html-keyboard-response",
        // stimulus: "<h1>Sound #: " + j + "</h1>",
        stimulus: "Next clip (of " + stimuli_list.length + " in total)",
        trial_duration: 1000,
        choices: jsPsych.NO_KEYS,
    };
    timeline.push(trial_start);

    for (let n = 0; n < scount; n++) {//loop through the silders

        var focus = {
            type: "html-keyboard-response",
            // stimulus: "<h2>Sound #: " + j + "</h2>" + '<p><font size="6">Please focus on <b>' + sprompts[n] + "</b> . </font></p>",
            stimulus: "<h2> </h2>" + '<p><font size="6">Please focus on <b></p><p>' + sprompts[n] + ".</p><p></b> </font></p>",
            trial_duration: 1800,
            choices: jsPsych.NO_KEYS,
        }
        timeline.push(focus);

        if(n % 2 == 1){
            var audio_trial = {
                type: 'audio-slider-response',
                stimulus: stimuli_list[i].stimulus,
                replay: true,
                autoplay: true,
                //require_movement: true,
                labels: slabels[0],
                slider_width: 500,
                prompt: snames[n],
                preamble: '<p>Please use the scale below to indicate <b>' + sprompts[n] + '.</b></p>' + '<p>Remember: <br>- Please do NOT adjust your volume <br>- Please only use the Replay button if there was a distraction or loud noise that made it impossible to hear the audio clip.</p><p>Trial #: ' + j + ' of ' + length + '</p>',
                slider_name: snames[n],
                on_finish: function (data) {
                    data.window_resolution = window.innerWidth + ' x ' + window.innerHeight;
                }
            };
            timeline.push(audio_trial);
        }
        // For Odd counts (Transcription), we display survey-text.
        else if(n % 2 == 0){
            // var text_response = {
            //     type: 'survey-text',
            //     replay: true,
            //     autoplay: true,
            //     //require_movement: true,
            //       questions: [
            //             {
            //                 prompt: "", 
            //                 name: snames[n],
            //                 placeholder: "Transcribe the audio file here",
            //                 required: true,
            //                 rows: 5, 
            //                 columns: 40
            //             }, 
            //         ],
            //     preamble: '<p>Please enter the transcription of the text you just heard</p>' + '<p>Remember: <br>- Please do NOT adjust your volume <br>- Please only use the Replay button if there was a distraction or loud noise that made it impossible to hear the audio clip.</p><p>Trial #: ' + j + ' of ' + length + '</p>',
            //     // slider_name: snames[n],
            //     on_finish: function (data) {
            //         data.window_resolution = window.innerWidth + ' x ' + window.innerHeight;
            //     }
            // };

            // Psudo Audio-Slider to add audio to the page
            var trial = {
                type: 'audio-button-response',
                stimulus: stimuli_list[i].stimulus,
                choices: ['Low', 'High'],
                prompt: "<p>Is the pitch high or low?</p>"
            };
            timeline.push(text_response);
        }

    }

    /* This timeline is to merge the different slider responses for the same stimulus into one row. */
    var trial_end = {
        type: "html-keyboard-response",
        // stimulus: "<h1>Sound #: " + j + " finished </h1>",
        stimulus: '<h1>Clip ' + j + ' finished. </h1>',
        trial_duration: 500,
        choices: jsPsych.NO_KEYS,
        data: {
            all: true, reliability: stimuli_list[i].reliability, order: j, version: 2,
            project: stimuli_list[i].project, deviceID: stimuli_list[i].deviceID, audioID: stimuli_list[i].audioID, sentenceID: stimuli_list[i].sentenceID
        },
        on_finish: function (data) {
            data.stimulus = stimuli_list[i].stimulus;
            
            // Simplified the filtering process to filter multiple trial_type (OR logic)
            var audio_trials = jsPsych.data.get().last(2 * scount).filter(x => x.trial_type == 'audio-slider-response' || x.trial_type == 'survey-text' ).values();
            for (let x = 0; x < scount; x++) {
                data[snames[x]] = audio_trials[x][snames[x]];
            }

            if (data.reliability !== "0") {//calculate distance between reliability trials and difference in intelligibility ratings
                var reliability_trials = jsPsych.data.get().filter({ reliability: stimuli_list[i].reliability, version: 2, all: true }).values();
                if (reliability_trials.length == 2) {
                    data.reliability_distance = reliability_trials[1].order - reliability_trials[0].order;
                    for (let y = 0; y < scount; y++) {
                        var name_diff = snames[y] + '_diff';
                        data[name_diff] = reliability_trials[1][snames[y]] - reliability_trials[0][snames[y]];
                    }
                }
            }
        }
    };
    timeline.push(trial_end);


}

// ################################################################################
// # Version 1 ####################################################################
// ################################################################################
/* Version 3: multiple sliders, with attention check, force listening, respond after listening */
/*var version3 = {
    type: "html-button-response",
    stimulus: " <p> Version 3: multiple sliders, with attention check, force listening, respond after listening </p>",
    choices: ['Continue']
};
timeline.push(version3);

for (let i = 0; i < stimuli_w_attention_list.length; i++) {
    var audio_play = {
        type: 'audio-keyboard-response',
        stimulus: stimuli_w_attention_list[i].stimulus,
        choices: jsPsych.NO_KEYS,
        trial_ends_after_audio: true
    };
    timeline.push(audio_play);
    if (stimuli_w_attention_list[i].test == true) {
        var audio_trial = {
            type: 'audio-sliders-response',
            stimulus: stimuli_w_attention_list[i].stimulus,
            replay: true,
            autoplay: false,
            slider_count: 5,
            //require_movement: [true, false, false, false, false],
            labels: [['Not Intelligible', 'Intelligible'], ['Not Natural', 'Natural'], ['0', '100'], ['0', '100'], ['0', '100']],
            slider_width: 500,
            prompt: ['<p>How <b>Intelligible</b> is the speech sound?</p>', '<p>Naturalness</p>', '<p>Perception 3</p>', '<p>Perception 4</p>', '<p>Perception 5</p>'],
            slider_name: ['Intelligibility', 'Naturalness', 'Perception3', 'Perception4', 'Perception5'],
            data: {
                reliability: stimuli_w_attention_list[i].reliability, order: i + 1, version: 3,
                project: stimuli_w_attention_list[i].project, deviceID: stimuli_w_attention_list[i].deviceID,
                audioID: stimuli_w_attention_list[i].audioID, sentenceID: stimuli_w_attention_list[i].sentenceID
            },
            on_finish: function (data) {
                data.window_resolution = window.innerWidth + ' x ' + window.innerHeight;
                if (data.reliability !== 0) {
                    var reliability_trials = jsPsych.data.get().filter({ reliability: stimuli_w_attention_list[i].reliability, version: 3 }).values();
                    if (reliability_trials.length == 2) {
                        data.reliability_distance = reliability_trials[1].order - reliability_trials[0].order;

                        var names = ['Intelligibility', 'Naturalness', 'Perception3', 'Perception4', 'Perception5'];
                        for (let j = 0; j < names.length; j++) {
                            data[names[j] + '_diff'] = reliability_trials[1][names[j]] - reliability_trials[0][names[j]];
                        }
                    }
                }

            }

        };
        timeline.push(audio_trial);
    }
    else {
        var attention_trial = {
            type: 'html-button-response',
            stimulus: "<p>Please select the sentence you just heard:</p>" + "<p></p>",
            choices: stimuli_w_attention_list[i].choices,
            data: { stimulus: stimuli_w_attention_list[i].stimulus, order: i + 1, version: 3 },
            on_finish: function (data) {
                data.window_resolution = window.innerWidth + ' x ' + window.innerHeight;
                if (data.button_pressed == stimuli_w_attention_list[i].correct) {
                    data.attention = true;
                } else {
                    data.attention = false;
                }
            }
        }
        timeline.push(attention_trial);
        var attention_feedback = {
            type: 'html-keyboard-response',
            stimulus: function feedbackfunction() {
                var last_trial_correct = jsPsych.data.get().last(1).values()[0].attention;
                if (last_trial_correct) {
                    return '<p> Correct! </p>'
                } else {
                    return '<p> Wrong! </p>'
                }
            },
            trial_duration: 2000,
            choices: jsPsych.NO_KEYS,
        }
        timeline.push(attention_feedback);
    }
};*/

var fullscreen_trial_exit = {
    type: 'fullscreen',
    fullscreen_mode: false
}
timeline.push(fullscreen_trial_exit);

/* finish connection with pavlovia.org */
var pavlovia_finish = {
    type: "pavlovia",
    command: "finish"
};
timeline.push(pavlovia_finish);



/* start the experiment */
jsPsych.init({
    timeline: timeline,
    use_webaudio: true,
    show_progress_bar: true,
    auto_update_progress_bar: true,
    //preload_audio: stimuli_list.stimulus,
    exclusions: {
        min_width: 800,
        min_height: 600,
        audio: true
    },
    on_finish: function () {
        //jsPsych.data.displayData();

        // TOGGLE OUT FOR ACTUAL RUNNING by setting isPilot at beginning of script
        if (isPilot == "true") {
          var participant_id = jsPsych.data.get().values()[0].participant;
          jsPsych.data.get().ignore('internal_node_id').localSave('csv', 'participant_' + participant_id + '.csv');
        }

        document.body.innerHTML = '<p> Please wait. You will be redirected back to Prolific in a few moments.</p>'
        setTimeout(function () { location.href = 'thanks.html' }, 5000)
    }


});
