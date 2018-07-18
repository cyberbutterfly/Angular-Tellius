export let StringActions = [
  {
    name: 'Equals',
    template: (column, param) => {
      return `${column} = '${param}'`;
    },
  },
  {
    name: 'Does not equals',
    template: (column, param) => {
      return `${column} != '${param}'`;
    },
  },
  {
    name: 'Contains',
    template: (column, param) => {
      return `${column} like '%${param}%'`;
    },
  },
  {
    name: 'Does not contain',
    template: (column, param) => {
      return `${column} not like '%${param}%'`;
    },
  },
  {
    name: 'Matches regex',
    template: (column, param) => {
      return `${column} regexp '${param}'`;
    },
  },
  {
    name: 'Starts with',
    template: (column, param) => {
      return `${column} like '${param}%'`;
    },
  },
  {
    name: 'Not starts with',
    template: (column, param) => {
      return `${column} not like '${param}%'`;
    },
  },
  {
    name: 'Ends with',
    template: (column, param) => {
      return `${column} like '%${param}'`;
    },
  },
  {
    name: 'Not ends with',
    template: (column, param) => {
      return `${column} not like '%${param}'`;
    },
  },
  {
    name: 'Blank',
    template: (column) => {
      return `${column} = ''`;
    },
  },
  {
    name: 'Not blank',
    template: (column) => {
      return `${column} != ''`;
    },
  },
];
export let NumberActions = [
  {
    name: 'Equals',
    template: (column, param) => {
      return `${column} = '${param}'`;
    },
  },
  {
    name: 'Greater than',
    template: (column, param) => {
      return `${column} > '${param}'`;
    },
  },
  {
    name: 'Greater than or equal to',
    template: (column, param) => {
      return `${column} >= '${param}'`;
    },
  },
  {
    name: 'Less than',
    template: (column, param) => {
      return `${column} < '${param}'`;
    },
  },
  {
    name: 'Less than or equal to',
    template: (column, param) => {
      return `${column} <= '${param}'`;
    },
  },
  {
    name: 'Inbetween',
    template: (column, param1, param2) => {
      return `${column}>=${param1} and ${column}<=${param2}`;
    },
  },
];

export let MathActions = [
  {
    name: 'Add',
    template: (column, number) => {
      return `${column}+${number}`;
    },
  },
  {
    name: 'Multiple',
    template: (column, number) => {
      return `${column}*${number}`;
    },
  },
  {
    name: 'Divide by number',
    template: (column, number) => {
      return `${column}/${number}`;
    },
  },
  {
    name: 'Round up',
    template: (column) => {
      return `ceil(${column})`;
    },
  },
  {
    name: 'Round down',
    template: (column) => {
      return `floor(${column})`;
    },
  },
];
