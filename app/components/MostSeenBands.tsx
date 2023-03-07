import type { FC } from 'react'
import type MostSeenBand from '../entities/MostSeenBand'

type Props = {
    mostSeenBands: MostSeenBand[]
}

const MostSeenBands: FC<Props> = (props) => {
  const { mostSeenBands } = props

  const rowElements = mostSeenBands.map((mostSeenBand) => {
    const {
      name,
      mainCount,
      supportCount,
      festivalCount,
      totalCount,
    } = mostSeenBand

    return (
      <tr key={name} className="hover:bg-gray-100">
        <td className="px-6 py-4 border-b">{name}</td>
        <td className="px-6 py-4 text-center border-b">{totalCount}</td>
        <td className="px-6 py-4 text-center border-b">{mainCount}</td>
        <td className="px-6 py-4 text-center border-b">{festivalCount}</td>
        <td className="px-6 py-4 text-center border-b">{supportCount}</td>
      </tr>
    )
  })

  return (
    <table className="w-full bg-white table-fixed border-separate border-spacing-0">
      <caption>
        <h3 className="font-bold text-xl mb-3">Most Seen Bands</h3>
      </caption>
      <thead>
        <tr>
          <th className="px-6 py-4 border-b text-left">Band</th>
          <th className="px-6 py-4 border-b">Sum</th>
          <th className="px-6 py-4 border-b">Main Act</th>
          <th className="px-6 py-4 border-b">Festival Act</th>
          <th className="px-6 py-4 border-b">Support Act</th>
        </tr>
      </thead>
      <tbody>
        {rowElements}
      </tbody>
    </table>
  )
}

export default MostSeenBands
