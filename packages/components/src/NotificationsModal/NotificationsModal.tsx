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
            position: 'fixed',
            top: 0,
            left: 0,
            display: 'fixed',
            width: '100%',
            height: '100%',
            background: 'white',
            zIndex: 4000,
          }}
        >
          <Flex
            sx={{
              background: 'white',
              padding: 2,
              flexDirection: 'column',
              justifyContent: 'space-between',
              width: '800px',
              maxWidth: '100vw',
              height: '100%',
              maxHeight: '100%',
              position: 'fixed',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 4001,
              overflow: 'scroll',
              scrollbarWidth: 'none',
            }}
          >
            <Box sx={{ marginTop: 15 }}>{children}</Box>
          </Flex>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
