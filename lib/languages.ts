// Programming languages with badge labels and brand colors
// Badges are short abbreviations suitable for display

export const PROGRAMMING_LANGUAGES = [
  { name: 'TypeScript', badge: 'TS', color: '#3178c6',icon: 'devicon-typescript-plain' },
  { name: 'JavaScript', badge: 'JS', color: '#f7df1e',icon: 'devicon-javascript-plain' },
  { name: 'Python', badge: 'Py', color: '#3776ab',icon: 'devicon-python-plain' },
  { name: 'Java', badge: 'Ja', color: '#007396',icon: 'devicon-java-plain' },
  { name: 'C++', badge: 'C++', color: '#00599c',icon: 'devicon-cplusplus-plain' },
  { name: 'C#', badge: 'C#', color: '#239120',icon: 'devicon-csharp-plain' },
  { name: 'Go', badge: 'Go', color: '#00add8',icon: 'devicon-go-plain' },
  { name: 'Rust', badge: 'Ru', color: '#ce422b',icon: 'devicon-rust-plain' },
  { name: 'Ruby', badge: 'Rb', color: '#cc342d',icon: 'devicon-ruby-plain' },
  { name: 'PHP', badge: 'PHP', color: '#777bb4',icon: 'devicon-php-plain' },
  { name: 'Swift', badge: 'Sw', color: '#fa7343',icon: 'devicon-swift-plain' },
  { name: 'Kotlin', badge: 'Kt', color: '#7f52ff',icon: 'devicon-kotlin-plain' },
  { name: 'SQL', badge: 'SQL', color: '#cc2927',icon: 'devicon-sqlserver-plain' },
  { name: 'HTML', badge: 'HT', color: '#e34c26',icon: 'devicon-html5-plain' },
  { name: 'CSS', badge: 'CSS', color: '#563d7c',icon: 'devicon-css3-plain' },
  { name: 'React', badge: 'Rx', color: '#61dafb',icon: 'devicon-react-plain' },
  { name: 'Vue', badge: 'Vue', color: '#4fc08d',icon: 'devicon-vuejs-plain' },
  { name: 'Angular', badge: 'Ng', color: '#dd0031',icon: 'devicon-angularjs-plain' },
  { name: 'Node.js', badge: 'No', color: '#68a063',icon: 'devicon-nodejs-plain' },
  { name: 'Docker', badge: 'Dk', color: '#2496ed',icon: 'devicon-docker-plain' },
  { name: 'Kubernetes', badge: 'K8s', color: '#326ce5',icon: 'devicon-kubernetes-plain' },
  { name: 'AWS', badge: 'AWS', color: '#ff9900',icon: 'devicon-aws-plain' },
  { name: 'Azure', badge: 'Az', color: '#0078d4',icon: 'devicon-azure-plain' },
  { name: 'GraphQL', badge: 'GQL', color: '#e10098',icon: 'devicon-graphql-plain' },
  { name: 'MongoDB', badge: 'MDB', color: '#13aa52',icon: 'devicon-mongodb-plain' },
  { name: 'PostgreSQL', badge: 'PG', color: '#336791',icon: 'devicon-postgresql-plain' },
  { name: 'MySQL', badge: 'MY', color: '#00758f',icon: 'devicon-mysql-plain' },
  { name: 'Redis', badge: 'Rd', color: '#dc382d',icon: 'devicon-redis-plain' },
  { name: 'Elasticsearch', badge: 'ES', color: '#005571',icon: 'devicon-elasticsearch-plain' },
  { name: 'Git', badge: 'Git', color: '#f1502f',icon: 'devicon-git-plain' },
]

export const getLanguageByName = (name: string) => {
  return PROGRAMMING_LANGUAGES.find((lang) => lang.name.toLowerCase() === name.toLowerCase())
}
