# Python Code to generate a list of all the stimuli (sound filenames) and save in stimuli.json

# input --> path: path of the directory in which all the sound files are stored.

from os import listdir
from os.path import isfile, join
import json

def generateJSON(path, output):
    onlyfiles = sorted([{"playlist_directory": f, "path": path+"/"+f, "playlist": int(f.split("_")[1]), "recordings": [{"stimulus": (path+"/"+f+"/"+rec)} for rec in listdir(path+"/"+f)]} for f in listdir(path)], key=lambda k: k['playlist'])
    with open(output, 'w') as outfile:
        json.dump(onlyfiles, outfile, indent=2)

generateJSON("./audio/mask-recordings", 'stimuli.json')