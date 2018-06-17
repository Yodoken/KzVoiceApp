# =========================================
# 
import sys
import time
import wave
sys.path.append("/Home/pi/AIY-projects-python/src")

import aiy
import aiy.audio
import aiy.voicehat


class _WaveDump(object):
    """A processor that saves recorded audio to a wave file."""

    def __init__(self, filepath, max_duration):
        self._wave = wave.open(filepath, 'wb')
        self._wave.setnchannels(1)
        self._wave.setsampwidth(2)
        self._wave.setframerate(16000)
        self._bytes = 0
        self._bytes_limit = int(max_duration * 16000) * 1 * 2
        self._btn = aiy.voicehat.get_button()
        self._done = False

        self._btn.on_press(self.on_button_press)

    def on_button_press(self):
        self._done = True

    def add_data(self, data):
        max_bytes = self._bytes_limit - self._bytes
        data = data[:max_bytes]
        self._bytes += len(data)
        if data:
            self._wave.writeframes(data)

    def is_done(self):
        return (self._bytes >= self._bytes_limit) or self._done

    def __enter__(self):
        return self

    def __exit__(self, *args):
        self._wave.close()


# レコーディング
def record(filepath, max_duration):
    recorder = aiy.audio.get_recorder()
    dumper = _WaveDump(filepath, max_duration)
    with recorder, dumper:
        recorder.add_processor(dumper)
        while not dumper.is_done():
            time.sleep(0.1)


# エントリポイント
def main():
    args = sys.argv
    record(args[1], args[2])


if __name__ == '__main__':
    main()