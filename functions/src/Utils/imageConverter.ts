import * as admin from 'firebase-admin';
import { spawn } from 'child-process-promise';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';

const saveFileToTmpDir = async ({ bucket, name }) => {
  const tmpFileName = name.replace(/\//g, '_');
  const tmpFile = path.join(os.tmpdir(), tmpFileName);

  await bucket.file(name).download({destination: tmpFile});
  return tmpFile;
}

const saveFile = async ({ bucket, filePath, name, metadata }) => {
  const options = {
    destination: name,
    metadata: { metadata }
  };
  await bucket.upload(filePath, options);
  return;
}

const optimiseImage = async ({ filePath }) => {
  const fileExt = path.extname(filePath);
  const fileName = path.basename(filePath, fileExt);
  const fileDir = path.dirname(filePath);

  const newFileName = path.normalize(path.format({ dir: fileDir, name: fileName + '_resized', ext: fileExt }));

  const process = await spawn('convert', [ filePath, '-quiet', '-resize', '540x360', newFileName ]);

  process.childProcess.stderr.on('data', data => { console.error(data); });

  return newFileName;
}

export const resizeImage = async (obj) => {
  const { name, contentType, bucketName } = obj;

  if (!contentType.startsWith('image/')) {
    console.log('This is not an image.');
    return null;
  }

  try {
    const bucket = admin.storage().bucket(bucketName);

    const tmpFile = await saveFileToTmpDir({ bucket, name });

    await saveFile({ bucket, filePath: tmpFile, name: name + '.orig', metadata: { original: true }});

    const convertedFile = await optimiseImage({ filePath: tmpFile });

    await saveFile({ bucket, filePath: convertedFile, name, metadata: { resized: true } });

    fs.unlinkSync(tmpFile);
    fs.unlinkSync(convertedFile);
  } catch(e) {
    console.error(e);
  }
  return;
}
