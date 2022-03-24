const whereBuilder = require('./index')

const query = {
  companyId: '1',
  createdAt: ['24.02.2022', '24.03.2022'],
  search: '',
  ids: [],
  company: '2',
  login: 'amenov',
  cityId: '9'
}

const abstractions = [
  'companyId',
  'createdAt',
  'search',
  'ids',
  ['companyId', 'company'],
  ['ids', { id: query.ids }],
  ['createdAt', ([dateStart, dateEnd]) => [dateStart, dateEnd]],
  ['email', 'login', { email: query.login }],
  ['email', 'login', (email) => ({ email })],
  [null, 'cityId', { city: query.cityId }],
  [null, 'cityId', (city) => ({ city })],
  {
    field1: 'abc',
    field2: 123
  }
]

const where = whereBuilder(query, abstractions)

console.log(where)
