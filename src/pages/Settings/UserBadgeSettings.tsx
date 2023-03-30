import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { Form, Field } from 'react-final-form'
import { useCommonStores } from 'src'
import { CheckboxInput } from 'src/common/Form/Checkbox'
import { capitalizeFirstLetter } from 'src/utils/helpers'
import { Card, Heading, Box, Button } from 'theme-ui'

const availableBadges = ['supporter', 'verified']

export const UserBadgeSettings = observer((props: { userId: string }) => {
  const { userStore } = useCommonStores().stores
  const [badges, setBadges] = useState({
    verified: false,
    supporter: false,
  })
  const [isLoading, setLoading] = useState(true)
  const [isSaving, setSaving] = useState(false)

  const fetchUser = async () => {
    const user = await userStore.getUserProfile(props.userId)
    if (user && user.badges) {
      setBadges(user.badges)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchUser()

    return () => {}
  }, [])

  return isLoading ? null : (
    <Card
      sx={{
        background: 'red2',
        width: ['100%', '100%', `calc(${(2 / 3) * 100}% - 5px)`],
        p: 4,
      }}
    >
      <Heading variant="small">Admin settings</Heading>
      <Form
        onSubmit={async () => {
          setSaving(true)
          await userStore.updateUserBadge(props.userId, badges)
          setSaving(false)
        }}
        render={(props) => {
          return (
            <Box mt={4}>
              Badge settings
              <form onSubmit={props.handleSubmit}>
                <Box mt={1}>
                  {availableBadges.map((badge, key) => (
                    <div key={key}>
                      <Field
                        id={badge}
                        name={badge}
                        data-cy={badge}
                        onClick={(v) => {
                          if (badges) {
                            badges[badge] = !!v.target.checked
                          }
                        }}
                        type="checkbox"
                        labelText={capitalizeFirstLetter(badge)}
                        checked={!!badges?.[badge]}
                        component={CheckboxInput}
                      />
                    </div>
                  ))}
                </Box>
                <Button
                  sx={{ mt: 4 }}
                  type="submit"
                  variant="outline"
                  disabled={isSaving}
                >
                  Update badges
                </Button>
              </form>
            </Box>
          )
        }}
      />
    </Card>
  )
})
