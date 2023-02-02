type CountDuplicates = (array: string[]) => Record<string, number>

const countDuplicates: CountDuplicates = (array) => array.reduce((map, entry) => ({
    ...map,
    [entry]: map[entry] === undefined ? 1 : map[entry] + 1,
}), {} as Record<string, number>)

export default countDuplicates
