import React, { useState } from 'react'

import './BreadcrumbsTooltip.css'

export const BreadcrumbsTooltip = ({ children, text }) => {
  const [visible, setVisible] = useState(false)

  const showTooltip = () => setVisible(true)
  const hideTooltip = () => setVisible(false)

  return (
    <div
      className="breadcrumbstooltip-container"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      {visible && <div className="breadcrumbstooltip-box">{text}</div>}
    </div>
  )
}
