import aiofiles
import os

async def save_temp_audio(audio):
    path = f"temp_{audio.filename}"
    async with aiofiles.open(path, 'wb') as out_file:
        content = await audio.read()
        await out_file.write(content)
    return path

def delete_temp_audio(path):
    if os.path.exists(path):
        os.remove(path)
