const makePair = (value: string, label?: string) => {
  return { value, label: label || value }
}

export const TIME_OPTIONS = [
  makePair('< 1 hour', '< 1 hour'),
  makePair('< 5 hours', '< 5 hours'),
  makePair('< 10 hours', '< 10 hours'),
  makePair('< 1 day', '< 1 day'),
  makePair('< 1 week', '< 1 week'),
  makePair('1-2 weeks', '1-2 weeks'),
  makePair('3-4 weeks', '3-4 weeks'),
  makePair('1+ months', '1+ months'),
]

export const DIFFICULTY_OPTIONS = [
  makePair('Easy', 'Easy'),
  makePair('Medium', 'Medium'),
  makePair('Hard', 'Hard'),
  makePair('Very Hard', 'Very Hard'),
]
