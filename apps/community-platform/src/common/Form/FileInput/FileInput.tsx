import React from 'react'
import { useEffect, useState } from 'react'
import { Button, DownloadStaticFile } from '@onearmy.apps/components'
import Compressor from '@uppy/compressor'
import Uppy from '@uppy/core'
import { DashboardModal } from '@uppy/react'
import { Flex } from 'theme-ui'

import { UPPY_CONFIG } from './UppyConfig'

import type { UppyFile } from '@uppy/core'

import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'

interface IUppyFiles {
  [key: string]: UppyFile
}
interface IProps {
  onFilesChange?: (files: (Blob | File)[]) => void
  'data-cy'?: string
}
interface IState {
  open: boolean
}
export const FileInput = (props: IProps) => {
  const [state, setState] = useState<IState>({ open: false })
  const [uppy] = useState(() =>
    new Uppy({ ...UPPY_CONFIG, onBeforeUpload: () => uploadTriggered() }).use(
      Compressor,
    ),
  )

  useEffect(() => {
    return () => {
      uppy.close()
    }
  }, [])

  const files = () => {
    const files = uppy.getState().files as IUppyFiles
    return files
  }
  const filesArray = () => {
    return Object.values(files()).map((meta) => meta.data) as File[]
  }

  // when upload button clicked just want to clise modal and reflect files
  const uploadTriggered = () => {
    toggleModal()
    return files()
  }

  const toggleModal = () => {
    setState((state) => ({ open: !state.open }))
    triggerCallback()
  }
  // reflect changes to current files whenever modal open or closed
  const triggerCallback = () => {
    if (props.onFilesChange) {
      props.onFilesChange(filesArray())
    }
  }

  const showFileList = filesArray().length > 0

  return (
    <Flex sx={{ flexDirection: 'column', justifyContent: 'center' }}>
      {showFileList ? (
        <>
          <Button
            onClick={() => toggleModal()}
            icon="upload"
            variant="outline"
            mb={1}
            data-cy={props['data-cy']}
          >
            Add Files
          </Button>
          {filesArray().map((file) => (
            <DownloadStaticFile
              key={file.name}
              file={file}
              allowDownload={false}
            />
          ))}
        </>
      ) : (
        <Button
          icon="upload"
          onClick={() => toggleModal()}
          type="button"
          variant="outline"
          data-cy={props['data-cy']}
        >
          Upload Files
        </Button>
      )}
      <DashboardModal
        proudlyDisplayPoweredByUppy={false}
        uppy={uppy}
        open={state.open}
        data-cy="uppy-dashboard"
        closeModalOnClickOutside
        onRequestClose={() => toggleModal()}
      />
    </Flex>
  )
}
