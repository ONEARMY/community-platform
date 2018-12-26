import * as admin from 'firebase-admin';
import { spawn } from 'child-process-promise';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';

const saveFileToTmpDir = async ({ bucket, name }) => {
  const tmpFile = path.join(os.tmpdir(), name);

  await bucket.file(name).download({destination: tmpFile});
  return tmpFile;
}

const saveFile = async ({ bucket, filePath, name }) => {
  await bucket.upload(filePath, { destination: name });
  return;
}

const optimiseImage = async ({ filePath }) => {
  const fileExt = path.extname(filePath);
  const fileName = path.basename(filePath, fileExt);
  const fileDir = path.dirname(filePath);

  const newFileName = path.normalize(path.format({ dir: fileDir, name: fileName + '_resized', ext: fileExt }));

  await spawn('convert', [ filePath, '-resize 540x360', newFileName ]);

  return newFileName;
}

export const resizeImage = async (obj) => {
  const { name, contentType, bucketName } = obj;

  if (!contentType.startsWith('image/')) {
    console.log('This is not an image.');
    return null;
  }

  const bucket = admin.storage().bucket(bucketName);

  const tmpFile = await saveFileToTmpDir({ bucket, name });

  await saveFile({ bucket, filePath: tmpFile, name: name + '.orig'});

  const convertedFile = await optimiseImage({ filePath: tmpFile });

  await saveFile({ bucket, filePath: convertedFile, name });
  
  fs.unlinkSync(tmpFile);
  fs.unlinkSync(convertedFile);
  return;
}
