import os
import io
import json
import urllib.request
import urllib.parse
import sys
import wave
sys.path.append("/Home/pi/AIY-projects-python/src")

import aiy
import aiy.voicehat
from google.cloud import speech
from google.cloud.speech import enums
from google.cloud.speech import types

VOICE_FILE = 'voice.wav'


def recordVoice(filename):
    print('Begin recording')
    os.system('python3 ./record-voice.py {0} {1}'.format(filename, 10))
    print('End recording')


def recognize(filename):
    # Instantiates a client
    client = speech.SpeechClient()

    # The name of the audio file to transcribe
    file_path = os.path.join(os.path.dirname(__file__), '', filename)

    # Loads the audio into memory
    with io.open(file_path, 'rb') as audio_file:
        content = audio_file.read()
        audio = types.RecognitionAudio(content=content)

        config = types.RecognitionConfig(
            encoding=enums.RecognitionConfig.AudioEncoding.LINEAR16,
            sample_rate_hertz=16000,
            language_code='ja-JP')

        # Detects speech in the audio file
        response = client.recognize(config, audio)

        for results in response.results:
            alternatives = results.alternatives

            for alternative in alternatives:
                print('Transcript: {}'.format(alternative.transcript))
                return alternative.transcript


def postMessage(from_id, to_id, message):
    '''Post message to server.'''
    print('Post "{}" to server...'.format(message))
    json_obj = {'from': from_id, 'to': to_id, 'message':message}
    json_data = json.dumps(json_obj).encode("utf-8")
    url = 'https://voice.kzsoft.work/api/message'
    method = 'POST'
    headers = {'Content-Type' : 'application/json'}

    request = urllib.request.Request(url, data=json_data, method=method, headers=headers)

    with urllib.request.urlopen(request) as response:
        print('Code    : {}'.format(response.getcode()))
        html = response.read().decode('utf-8')
        print('Response: {}'.format(html))


def main():
    '''Start voice recognition when motion is detected.'''
    print('Start KzVoiceApp...')
    btn = aiy.voicehat.get_button()
    while True:
        print('Push button to send a voice message.')
        btn.wait_for_press()
        recordVoice(VOICE_FILE)
        text = recognize(VOICE_FILE)
        if text != "":
            postMessage(3, 1, text)


if __name__ == '__main__':
    main()