import { AnimatePresence, motion } from 'framer-motion'
import { Box, Flex } from 'theme-ui'

export interface Props {
  isOpen: boolean
  children: React.ReactNode
}

export const NotificationsModal = (props: Props) => {
  const { children, isOpen } = props

  const visible = { y: '0', transition: { type: 'linear' } }
  const hidden = { y: '-100%', transition: { type: 'linear' } }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={hidden}
          animate={visible}
          exit={hidden}
          style={{
            backgroundColor: 'white',
            position: 'fixed',
            bottom: 0,
            left: 0,
            display: 'fixed',
            width: '100%',
            height: '92%',
            zIndex: 5000,
          }}
        >
          <Flex
            sx={{
              padding: 2,
              flexDirection: 'column',
              justifyContent: 'space-between',
              width: '800px',
              maxWidth: '100vw',
              height: '91%',
              maxHeight: '100%',
              left: '50%',
              top: '50%',
              zIndex: 2,
              overflow: 'scroll',
              scrollbarWidth: 'none',
              margin: '0 auto',
            }}
          >
            <Box sx={{ background: 'white' }}>{children}</Box>
          </Flex>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
