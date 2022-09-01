import whereBuilder from './index'

whereBuilder(
  {
    test: 1
  },
  [['test', { test: 2 }]]
)
