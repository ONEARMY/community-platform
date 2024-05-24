import { useEffect, useRef, useState } from 'react'
import { Form } from 'react-final-form'
import { useLocation } from 'react-router-dom'
import { observer } from 'mobx-react'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { UserContactError } from 'src/pages/User/contact'
import { form } from 'src/pages/UserSettings/labels'
import { Box, Heading } from 'theme-ui'

import { ImpactYearField } from './ImpactYear.field'
import { ImpactYearDisplayField } from './ImpactYearDisplay.field'
import {
  sortImpactYearDisplayFields,
  transformImpactData,
  transformImpactInputs,
} from './utils'

import type { IImpactYear, IImpactYearFieldList } from 'src/models'
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

  useEffect(() => {
    const fetchImpact = () => {
      const impact = userStore.user?.impact
      if (impact && impact[year]) {
        setImpact(impact[year])
      }
    }

    fetchImpact()
  }, [])

  const { userStore } = useCommonStores().stores
  const formId = `impactForm-${year}`

  const sx = {
    backgroundColor: 'background',
    borderRadius: 2,
    marginBottom: 2,
    padding: 2,
  }

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

  useEffect(() => {
    const scrollToElement = () => {
      const divRef = impactDivRef.current
      if (divRef !== null) {
        divRef.scrollIntoView({ behavior: 'smooth' })
      }
    }
    if (hash === `#impact_${year}`) {
      scrollToElement()
    }
  }, [hash])

  return (
    <Box sx={sx}>
      <Heading
        as="h3"
        variant="small"
        ref={impactDivRef}
        id={`/settings#impact_${year}`}
      >
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
