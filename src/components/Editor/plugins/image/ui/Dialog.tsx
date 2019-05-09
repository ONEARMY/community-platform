import { insertOrUpdateImage } from '../core/ImageSelection'
import React, { useState } from 'react'
import * as ReactDOM from 'react-dom'
import { FormDialog } from '../../../ui/Dialog'
import { FirebaseFileUploader } from 'src/components/FirebaseFileUploader/FirebaseFileUploader'
import { UploadedFile } from 'src/pages/common/UploadedFile/UploadedFile'
import {
  NewAppNode,
  deleteUpload,
  storagePath,
  TEXT,
  toImageData,
} from '../../../common'

const ACCEPT = 'image/png, image/jpeg'

const addImage = (editor, file) => {
  editor.undoManager.transact(() => {
    insertOrUpdateImage(editor, toImageData(file.downloadUrl))
  })
}

const UploadDialog = ({ editor }) => {
  // `undefined as any` surpresses weird compiler error
  // I assume that ts-loader isn't ready for react@next
  // FIXME : 'object' possibly null
  const [uploaded, setUploaded] = useState(undefined as any)

  const clear = () => {
    // tslint:disable-next-line:no-unused-expression
    uploaded && deleteUpload(uploaded.fullPath)
    setUploaded(null)
  }

  return (
    <FormDialog
      onCancel={clear}
      onOk={() => addImage(editor, uploaded)}
      title={TEXT.INSERT}
      valid={uploaded != null}
    >
      {uploaded && (
        <UploadedFile
          onFileDeleted={clear}
          file={uploaded}
          imagePreview={true}
          showDelete={true}
        />
      )}
      <FirebaseFileUploader
        accept={ACCEPT}
        buttonText={TEXT.UPLOAD_BUTTON}
        storagePath={storagePath()}
        onUploadSuccess={setUploaded}
      />
    </FormDialog>
  )
}

export default function(editor) {
  function open() {
    ReactDOM.render(<UploadDialog editor={editor} />, NewAppNode())
  }
  return {
    open,
  }
}
