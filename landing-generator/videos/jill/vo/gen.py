import soundfile as sf
from kokoro_onnx import Kokoro
M="/root/.cache/hyperframes/tts/models/kokoro-v1.0.onnx"
V="/root/.cache/hyperframes/tts/voices/voices-v1.0.bin"
k=Kokoro(M,V)
lines=[l.rstrip("\n") for l in open("vo/lines.txt") if l.strip()]
for i,line in enumerate(lines,1):
    s,sr=k.create(line, voice="af_heart", speed=1.0, lang="en-us")
    sf.write(f"vo/s{i}.wav", s, sr)
    print(f"s{i}: {len(s)/sr:.3f}s")
