import { observer } from 'mobx-react'
import { Form } from 'react-final-form'
import { FlexSectionContainer } from 'src/pages/Settings/content/formSections/elements'
import { Box, Button, Card, Flex, Heading, Text } from 'theme-ui'
import CommunitySelector from '../components/userDetails/CommunitySelector'
import InfoSection from '../components/userDetails/InfoSection'
import arrayMutators from 'final-form-arrays'
import { useEffect, useState } from 'react'
import { useCommonStores } from 'src'
import { useParams } from 'react-router'
import type { IUserPP } from 'src/models'
import INITIAL_VALUES from '../../../pages/Settings/Template'
import { toJS } from 'mobx'
import { WorkspaceMapPinSection } from 'src/pages/Settings/content/formSections/WorkspaceMapPin.section'
import theme from 'src/themes/styled.theme'
import { Icon } from 'oa-components'
import { Link } from 'react-router-dom'

const AdminUserDetail = observer(() => {
  const [userData, setuserData] = useState<IUserPP>(INITIAL_VALUES);
  const { stores } = useCommonStores();
  const location = useParams<{id:string}>();

  useEffect(() => {
    if (location.id) {      
      mount()  // get user data from userid on first mount
    }
  }, [])

  const mount = async () => {
    const userData = await stores.userStore.getUserProfile(location.id);
    if(userData?._id){
      const baseValues: IUserPP = {
        ...INITIAL_VALUES,
        // use toJS to avoid mobx monitoring of modified fields (e.g. out of bound arrays on link push)
        ...toJS(userData),
      }
      const { coverImages, openingHours, links } = baseValues
      // replace empty arrays with placeholders for filling forms
      const formValues: IUserPP = {
        ...baseValues,
        coverImages: new Array(4)
          .fill(null)
          .map((v, i) => (coverImages[i] ? coverImages[i] : v)),
        links: links.length > 0 ? links : [{} as any],
        openingHours: openingHours!.length > 0 ? openingHours : [{} as any],
      }
      setuserData(formValues)
    }
  }

  return (
    <>
      <Box sx={{mt:8, ml:2, mb:1}}>
        <Link to={'/admin_v2/users'} style={{fontSize:'16px', display:'flex', alignItems:'center', color:'#0898CB'}}><Icon glyph='arrow-back'/> Back to Users</Link>
      </Box>
      <Form
        initialValues={userData}
        onSubmit={(v) => {
          console.log('values',v)
        }}
        mutators={{ ...arrayMutators }}
        render={({
          form,
          submitting,
          values,
          handleSubmit,
          submitError,
          valid,
          errors,
          ...rest
        }) => (
          <Flex bg={'inherit'} sx={{ flexWrap: 'wrap', my:4 }}>
              <Flex
                sx={{
                  width: ['100%', '100%', `${(2 / 3) * 100}%`],
                  px: 2,
                  flexDirection:'column'
                }}
              >
              <form id="myForm" onSubmit={handleSubmit}>
                <Card bg={theme.colors.softblue}>
                  <Flex px={3} py={2} sx={{justifyContent:'space-between',alignItems:'center',flexWrap:'wrap'}}>
                    <Heading>Edit User {values?.userName}</Heading>
                    <Text sx={{opacity:0.5, fontSize:'15px'}}>ID: {values?._authID}</Text>
                  </Flex>
                </Card>
                <FlexSectionContainer >
                  <Flex sx={{ justifyContent: 'space-between' ,mb:5}}>
                      <Heading variant="small">Info</Heading>
                  </Flex>
                  <Box sx={{display:'block'}}>
                    <CommunitySelector />
                    <InfoSection userData={values} /> 
                  </Box>
                </FlexSectionContainer>
                <Box sx={{display:'block'}}>
                  <WorkspaceMapPinSection />
                </Box>
              </form>
              </Flex>
            {/* desktop guidelines container */}
            <Flex
              sx={{
                width: ['100%', '100%', `${100 * 0.333}%`],
                flexDirection: 'column',
                bg: 'inherit',
                px: 2,
                mt:[2,2,0],
                height: '100%',
              }}
            >
              <Box>
                <Button
                    data-cy="save"
                    title={'submit'}
                    sx={{ width: '100%' }}
                    variant={'primary'}
                    type="submit"
                    onClick={() => {
                      // workaround for issues described:
                      // https://github.com/final-form/react-final-form/blob/master/docs/faq.md#how-can-i-trigger-a-submit-from-outside-my-form
                      const formEl = document.getElementById('myForm');
                      if (typeof formEl !== 'undefined' && formEl !== null) {
                        formEl.dispatchEvent(
                          new Event('submit', {
                            cancelable: true,
                            bubbles: true,
                          }),
                        )
                      }
                    }}
                  >
                  Save profile
                </Button>
              </Box>
            </Flex>
          </Flex>
        )}
      />
    </>
  )
})
export default AdminUserDetail
