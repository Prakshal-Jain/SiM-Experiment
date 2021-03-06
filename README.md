# kamp_qc

## Changes
### First priorities:
1. jspsych-audio-text-response plugin: (Source- https://github.com/khiajohnson/jsPsych/blob/master/plugins/jspsych-audio-text-response.js)
Added synchronous replay and continue buttons (as audio plays, the buttons becomes temporarily diabled and activated when audio-play completes). The plugin helps participants to transcribe *while the audio is playing*.<br>
Relative address in project: ./jsPsych/jspsych-audio-text-response.js

2. index.html: added script for jspsych-audio-text-response plugin (line: 20)

3. exp.js: Replaced "Loudness" with "Effort" throughout the experiment with anchors "Very easy to understand" to "Very difficult to understand". Rating scale occurs after the transcription.
(code commented accordingly).