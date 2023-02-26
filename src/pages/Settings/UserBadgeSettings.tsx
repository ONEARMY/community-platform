import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { Form, Field } from 'react-final-form'
import { useCommonStores } from 'src'
import { CheckboxInput } from 'src/common/Form/Checkbox'
import { Card, Heading, Box, Button } from 'theme-ui'

export const UserBadgeSettings = observer((props: { userId: string }) => {
  const { userStore } = useCommonStores().stores
  const [badges, setBadges] = useState({
    verified: false,
    supporter: false,
  })
  const [isLoading, setLoading] = useState(true)
  const [isSaving, setSaving] = useState(false)

  async function fetchUser() {
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
                  <div>
                    <Field
                      id="verified"
                      name="verified"
                      data-cy="verified"
                      onClick={(v) => {
                        if (badges) {
                          badges.verified = !!v.target.checked
                        }
                      }}
                      type="checkbox"
                      labelText={'Verified'}
                      checked={!!badges?.verified}
                      component={CheckboxInput}
                    />
                  </div>
                  <div>
                    <Field
                      id="supporter"
                      name="supporter"
                      onClick={(v) => {
                        if (badges) {
                          badges.supporter = !!v.target.checked
                        }
                      }}
                      data-cy="supporter"
                      labelText="Supporter"
                      type="checkbox"
                      checked={!!badges?.supporter}
                      component={CheckboxInput}
                    />
                  </div>
                </Box>
                <Button sx={{ mt: 4 }} type="submit" disabled={isSaving}>
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
