// Programming languages with badge labels and brand colors
// Badges are short abbreviations suitable for display

export const PROGRAMMING_LANGUAGES = [
  { name: 'TypeScript', badge: 'TS', color: '#3178c6',icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg"  },
  { name: 'JavaScript', badge: 'JS', color: '#f7df1e',icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" },
  { name: 'Python', badge: 'Py', color: '#3776ab',icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" },
  { name: 'Java', badge: 'Ja', color: '#007396',icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg" },
  { name: 'C++', badge: 'C++', color: '#00599c',icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg" },
  { name: 'C#', badge: 'C#', color: '#239120',icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg" },
  { name: 'Go', badge: 'Go', color: '#00add8',icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original.svg" },
  { name: 'Rust', badge: 'Ru', color: '#ce422b',icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rust/rust-original.svg" },
  { name: 'Ruby', badge: 'Rb', color: '#cc342d',icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ruby/ruby-original.svg" },
  { name: 'PHP', badge: 'PHP', color: '#777bb4',icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg" },
  { name: 'Swift', badge: 'Sw', color: '#fa7343',icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/swift/swift-original.svg" },
  { name: 'Kotlin', badge: 'Kt', color: '#7f52ff',icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kotlin/kotlin-original.svg" },
  { name: 'SQL', badge: 'SQL', color: '#cc2927',icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sqlserver/sqlserver-original.svg" },
  { name: 'HTML', badge: 'HT', color: '#e34c26',icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" },
  { name: 'CSS', badge: 'CSS', color: '#563d7c',icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg" },
  { name: 'React', badge: 'Rx', color: '#61dafb',icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" },
  { name: 'Vue', badge: 'Vue', color: '#4fc08d',icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg" },
  { name: 'Angular', badge: 'Ng', color: '#dd0031',icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/angularjs/angularjs-original.svg" },
  { name: 'Node.js', badge: 'No', color: '#68a063',icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" },
  { name: 'Docker', badge: 'Dk', color: '#2496ed',icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg" },
  { name: 'Kubernetes', badge: 'K8s', color: '#326ce5',icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kubernetes/kubernetes-original.svg" },
  { name: 'AWS', badge: 'AWS', color: '#ff9900',icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/aws/aws-original.svg" },
  { name: 'Azure', badge: 'Az', color: '#0078d4',icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azure/azure-original.svg" },
  { name: 'GraphQL', badge: 'GQL', color: '#e10098',icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/graphql/graphql-original.svg" },
  { name: 'MongoDB', badge: 'MDB', color: '#13aa52',icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg" },
  { name: 'PostgreSQL', badge: 'PG', color: '#336791',icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg" },
  { name: 'MySQL', badge: 'MY', color: '#00758f',icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg" },
  { name: 'Redis', badge: 'Rd', color: '#dc382d',icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg" },
  { name: 'Elasticsearch', badge: 'ES', color: '#005571',icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/elasticsearch/elasticsearch-original.svg" },
  { name: 'Git', badge: 'Git', color: '#f1502f',icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" },
]

export const getLanguageByName = (name: string) => {
  return PROGRAMMING_LANGUAGES.find((lang) => lang.name.toLowerCase() === name.toLowerCase())
}
