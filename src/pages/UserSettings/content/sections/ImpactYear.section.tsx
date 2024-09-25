import { useEffect, useRef, useState } from 'react'
import { Form } from 'react-final-form'
import { useLocation } from '@remix-run/react'
import { observer } from 'mobx-react'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { UserContactError } from 'src/pages/User/contact'
import { form } from 'src/pages/UserSettings/labels'
import { Box, Heading } from 'theme-ui'

import {
  sortImpactYearDisplayFields,
  transformImpactData,
  transformImpactInputs,
} from '../../utils'
import { ImpactYearField } from '../fields/ImpactYear.field'
import { ImpactYearDisplayField } from '../fields/ImpactYearDisplay.field'

import type { IImpactYearFieldList } from 'oa-shared'
import type { IImpactYear } from 'src/models'
import type { SubmitResults } from 'src/pages/User/contact/UserContactError'

interface Props {
  year: IImpactYear
}

export const ImpactYearSection = observer(({ year }: Props) => {
  const [impact, setImpact] = useState<IImpactYearFieldList | undefined>(
    undefined,
  )
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [submitResults, setSubmitResults] = useState<SubmitResults | null>(null)

  const impactDivRef = useRef<HTMLInputElement>(null)
  const { hash } = useLocation()
  const { userStore } = useCommonStores().stores

  const formId = `impactForm-${year}`
  const sx = {
    backgroundColor: 'background',
    borderRadius: 2,
    marginBottom: 2,
    padding: 2,
  }

  useEffect(() => {
    const fetchImpact = () => {
      const impact = userStore.activeUser?.impact
      if (impact && impact[year]) {
        setImpact(impact[year])
      }
    }

    fetchImpact()
  }, [])

  useEffect(() => {
    const anchor = `#year_${year}`

    const openEditMode = () => {
      if (hash === anchor) {
        setTimeout(() => {
          const section = document.querySelector(anchor)
          // the delay is needed, otherwise the scroll is not happening in Firefox
          section?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 500)

        return setIsEditMode(true)
      }
      return setIsEditMode(false)
    }

    openEditMode()
  }, [hash])

  const onSubmit = async (values) => {
    setSubmitResults(null)
    try {
      const fields = transformImpactInputs(values)
      const sortedFields = sortImpactYearDisplayFields(fields)
      await userStore.updateUserImpact(fields, year)
      setSubmitResults({ type: 'success', message: form.saveSuccess })
      setIsEditMode(false)
      setImpact(sortedFields)
    } catch (error) {
      setSubmitResults({ type: 'error', message: error.message })
    }
  }

  return (
    <Box sx={sx} id={`year_${year}`}>
      <Heading as="h3" variant="small" ref={impactDivRef}>
        {year}
      </Heading>
      <UserContactError submitResults={submitResults} />
      <Form
        id={formId}
        initialValues={impact ? transformImpactData(impact) : undefined}
        onSubmit={onSubmit}
        render={({ handleSubmit, values, submitting }) => {
          return isEditMode ? (
            <ImpactYearField
              formId={formId}
              handleSubmit={handleSubmit}
              submitting={submitting}
            />
          ) : (
            <ImpactYearDisplayField
              fields={sortImpactYearDisplayFields(
                transformImpactInputs(values),
              )}
              formId={formId}
              setIsEditMode={setIsEditMode}
            />
          )
        }}
      />
    </Box>
  )
})
