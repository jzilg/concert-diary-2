import { type FC, useId } from 'react'
import { ArrowLeft, Save } from 'react-bootstrap-icons'
import { Form, type SubmitFunction } from 'react-router'
import Button from '~/components/Button'
import Input from '~/components/Input'
import NavLink from '~/components/NavLink'
import type { Concert } from '~/entities/Concert'

type Props = {
  concert: Concert
  saveConcert: SubmitFunction
  method: 'post' | 'put'
  allBands: string[]
  allCompanions: string[]
  allLocations: string[]
}

const ConcertForm: FC<Props> = (props) => {
  const {
    concert,
    saveConcert,
    method,
    allBands,
    allCompanions,
    allLocations,
  } = props
  const { id, band, supportBands, location, date, companions } = concert
  const bandDatalistId = useId()
  const companionsDataListId = useId()
  const locationsDataListId = useId()

  return (
    <Form
      method={method}
      onSubmit={(event) => {
        void saveConcert(event.currentTarget)
      }}
    >
      <input name="id" type="hidden" value={id} />
      <label className="block mt-3">
        <span className="block mb-2 font-bold">Band</span>
        <Input
          type="text"
          name="band"
          defaultValue={band}
          placeholder="Pink Floyd"
          list={bandDatalistId}
          required
        />
      </label>
      <label className="block mt-3">
        <span className="block mb-2 font-bold">Support</span>
        <Input
          name="supportBands"
          defaultValue={supportBands.join(', ')}
          placeholder="The Cure, Talking Heads,..."
          list={bandDatalistId}
        />
      </label>
      <label className="block mt-3">
        <span className="block mb-2 font-bold">Location</span>
        <Input
          type="text"
          name="location"
          defaultValue={location}
          placeholder="Wuhlheide"
          list={locationsDataListId}
          required
        />
      </label>
      <label className="block mt-3">
        <span className="block mb-2 font-bold">Date</span>
        <Input type="date" name="date" defaultValue={date} required />
      </label>
      <label className="block mt-3">
        <span className="block mb-2 font-bold">Companions</span>
        <Input
          name="companions"
          defaultValue={companions.join(', ')}
          placeholder="Leo, Max, Peter,..."
          list={companionsDataListId}
        />
      </label>
      <ul className="flex justify-between mt-6">
        <li>
          <Button type="submit">
            Save
            <Save aria-hidden />
          </Button>
        </li>
        <li>
          <NavLink to="/concerts">
            <ArrowLeft aria-hidden />
            Back to Concerts
          </NavLink>
        </li>
      </ul>
      <datalist id={locationsDataListId}>
        {allLocations.map((location) => (
          <option key={location} value={location} />
        ))}
      </datalist>
      <datalist id={companionsDataListId}>
        {allCompanions.map((companion) => (
          <option key={companion} value={companion} />
        ))}
      </datalist>
      <datalist id={bandDatalistId}>
        {allBands.map((band) => (
          <option key={band} value={band} />
        ))}
      </datalist>
    </Form>
  )
}

export default ConcertForm
