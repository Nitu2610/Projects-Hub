
const priorityMap={
  1:"Low", 2:"Medium", 3:"High"
}

export const formatPriority = (key) => {
  return priorityMap[key]
}
