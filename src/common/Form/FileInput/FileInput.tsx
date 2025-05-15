import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Uppy from '@uppy/core'
import { DashboardModal } from '@uppy/react'
import { Button } from 'oa-components'
import { Flex } from 'theme-ui'

import { FileDisplay } from './FileDisplay'
import { UPPY_CONFIG } from './UppyConfig'
import { UPPY_CONFIG_ADMIN } from './UppyConfigAdmin'

import type { UppyFile } from '@uppy/core'

import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'

interface IProps {
  onFilesChange?: (files: (Blob | File)[]) => void
  'data-cy'?: string
  admin: boolean
}

export const FileInput = (props: IProps) => {
  const [open, setOpen] = useState(false)
  const [fileState, setFileState] = useState<Record<string, UppyFile>>({}) // Add this state
  const uploadConfig = props.admin ? UPPY_CONFIG_ADMIN : UPPY_CONFIG

  const uppyRef = useRef<Uppy | null>(null)

  if (!uppyRef.current) {
    uppyRef.current = new Uppy({
      ...uploadConfig,
      onBeforeUpload: () => uploadTriggered(),
    })

    // Add event listener for file removal
    uppyRef.current.on('file-removed', () => {
      const newState = uppyRef.current!.getState().files
      setFileState(newState)
      // Trigger callback when files are removed
      props.onFilesChange?.(
        Object.values(newState).map((file) => file.data) as File[],
      )
    })
    uppyRef.current.on('file-added', () => {
      const newState = uppyRef.current!.getState().files
      setFileState(newState)
      // Trigger callback when a file is added
      props.onFilesChange?.(
        Object.values(newState).map((file) => file.data) as File[],
      )
    })
    uppyRef.current.on('files-added', () => {
      const newState = uppyRef.current!.getState().files
      setFileState(newState)
      // Trigger callback when multiple files are added
      props.onFilesChange?.(
        Object.values(newState).map((file) => file.data) as File[],
      )
    })
  }
  useEffect(() => {
    return () => {
      uppyRef.current?.close()
    }
  }, [])

  const remove = (id: string) => {
    uppyRef.current!.removeFile(id)
  }

  const files = useMemo(() => {
    return Object.values(fileState) as UppyFile[]
  }, [fileState])

  // Memoize callback trigger function
  const triggerCallback = useCallback(() => {
    // Ensure we're passing the actual File objects from the data property
    const fileObjects = files.map((meta) => meta.data) as File[]
    props.onFilesChange?.(fileObjects)
  }, [props.onFilesChange, files])

  const uploadTriggered = () => {
    setOpen(false)
    return uppyRef.current!.getState().files
  }

  return (
    <Flex sx={{ flexDirection: 'column', justifyContent: 'center', gap: 1 }}>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        icon="upload"
        variant="outline"
        sx={{ mb: 1, width: 'fit-content ' }}
        data-cy={props['data-cy']}
      >
        Add Files
      </Button>
      {files.map((file) => (
        <FileDisplay
          key={file.id}
          file={{
            id: file.id,
            name: file.name,
            size: file.size,
          }}
          onRemove={() => remove(file.id)}
        />
      ))}

      <DashboardModal
        proudlyDisplayPoweredByUppy={false}
        uppy={uppyRef.current}
        open={open}
        data-cy="uppy-dashboard"
        closeModalOnClickOutside
        onRequestClose={() => {
          setOpen(false)
          triggerCallback()
        }}
      />
    </Flex>
  )
}
