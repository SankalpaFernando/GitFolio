// Programming languages with badge labels and brand colors
// Badges are short abbreviations suitable for display

export const PROGRAMMING_LANGUAGES = [
  { name: 'TypeScript', badge: 'TS', color: '#3178c6' },
  { name: 'JavaScript', badge: 'JS', color: '#f7df1e' },
  { name: 'Python', badge: 'Py', color: '#3776ab' },
  { name: 'Java', badge: 'Ja', color: '#007396' },
  { name: 'C++', badge: 'C++', color: '#00599c' },
  { name: 'C#', badge: 'C#', color: '#239120' },
  { name: 'Go', badge: 'Go', color: '#00add8' },
  { name: 'Rust', badge: 'Ru', color: '#ce422b' },
  { name: 'Ruby', badge: 'Rb', color: '#cc342d' },
  { name: 'PHP', badge: 'PHP', color: '#777bb4' },
  { name: 'Swift', badge: 'Sw', color: '#fa7343' },
  { name: 'Kotlin', badge: 'Kt', color: '#7f52ff' },
  { name: 'SQL', badge: 'SQL', color: '#cc2927' },
  { name: 'HTML', badge: 'HT', color: '#e34c26' },
  { name: 'CSS', badge: 'CSS', color: '#563d7c' },
  { name: 'React', badge: 'Rx', color: '#61dafb' },
  { name: 'Vue', badge: 'Vue', color: '#4fc08d' },
  { name: 'Angular', badge: 'Ng', color: '#dd0031' },
  { name: 'Node.js', badge: 'No', color: '#68a063' },
  { name: 'Docker', badge: 'Dk', color: '#2496ed' },
  { name: 'Kubernetes', badge: 'K8s', color: '#326ce5' },
  { name: 'AWS', badge: 'AWS', color: '#ff9900' },
  { name: 'Azure', badge: 'Az', color: '#0078d4' },
  { name: 'GraphQL', badge: 'GQL', color: '#e10098' },
  { name: 'MongoDB', badge: 'MDB', color: '#13aa52' },
  { name: 'PostgreSQL', badge: 'PG', color: '#336791' },
  { name: 'MySQL', badge: 'MY', color: '#00758f' },
  { name: 'Redis', badge: 'Rd', color: '#dc382d' },
  { name: 'Elasticsearch', badge: 'ES', color: '#005571' },
  { name: 'Git', badge: 'Git', color: '#f1502f' },
]

export const getLanguageByName = (name: string) => {
  return PROGRAMMING_LANGUAGES.find((lang) => lang.name.toLowerCase() === name.toLowerCase())
}
