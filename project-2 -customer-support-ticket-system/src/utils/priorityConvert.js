import React from 'react'

export const priorityConvert = (value) => {
  return (
   value === 1 ? "Low" : value === 2 ? "Medium" : "High"
  )
}
