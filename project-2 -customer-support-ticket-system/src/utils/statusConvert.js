import React from 'react'

export const statusConvert = (value) => {
  return value === "open"
            ? "Open"
            : value === "closed"
              ? "Closed"
              : "In Progress"
}
