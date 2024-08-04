
### request server template

```js
const tableData = useState('tableData', (): EyeData[] => [])
const tableColumn = [
    { label: 'name', prop: 'n' },
    { label: 'ATLAS Market Sell', prop: 's' },
    { label: 'ATLAS Market Buy', prop: 'b' },
    { label: 'Cratf Fee', prop: 'fee' },
    { label: 'Group', prop: 'gp' },
]

const { data, pending, error, refresh } = await useAsyncData<EyeApi>(
    'resources', // useAsyncData primary key name
    () => $fetch('/api/staratlas/resources') // server api
)

if (data.value) {
    // console.info('get Data done', data.value)
    // do samething
} else {
    console.error(error.value)
}
```