
import axios from 'axios';
import FormData from 'form-data';
import Settings from '@configs/settings';

class VideoUploaderService {
  public static async singleUpload (file: any, folder?: any) {
    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);
    const path = folder ? `${Settings.videoUploaderEndpoint}?path=/${folder}` : Settings.videoUploaderEndpoint;
    const result = await axios.post(path, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });
    return result.data.data.url.src;
  }
}

export default VideoUploaderService;
