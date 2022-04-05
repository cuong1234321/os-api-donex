
import axios from 'axios';
import FormData from 'form-data';
import Settings from '@configs/settings';

class ImageUploaderService {
  public static async singleUpload (file: any, folder?: any) {
    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);
    const path = folder ? `${Settings.imageUploaderEndpoint}?path=/${folder}` : Settings.imageUploaderEndpoint;
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

export default ImageUploaderService;
