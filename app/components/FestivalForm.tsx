import { type FC, useId } from 'react'
import { ArrowLeft, Save } from 'react-bootstrap-icons'
import { Form, type SubmitFunction } from 'react-router'
import Button from '~/components/Button'
import Input from '~/components/Input'
import NavLink from '~/components/NavLink'
import type { Festival } from '~/entities/Festival'

type Props = {
  festival: Festival
  saveFestival: SubmitFunction
  method: 'post' | 'put'
  allBands: string[]
  allCompanions: string[]
}

const FestivalForm: FC<Props> = (props) => {
  const { festival, saveFestival, method, allBands, allCompanions } = props
  const { id, name, bands, date, companions } = festival
  const bandDatalistId = useId()
  const companionsDataListId = useId()

  return (
    <Form
      method={method}
      onSubmit={(event) => {
        void saveFestival(event.currentTarget)
      }}
    >
      <input name="id" type="hidden" value={id} />
      <label className="block mt-3">
        <span className="block mb-2 font-bold">Name</span>
        <Input
          type="text"
          name="name"
          defaultValue={name}
          placeholder="Melt 2010"
          required
        />
      </label>
      <label className="block mt-3">
        <span className="block mb-2 font-bold">Bands</span>
        <Input
          name="bands"
          defaultValue={bands.join(', ')}
          placeholder="The Cure, Talking Heads,..."
          list={bandDatalistId}
        />
      </label>
      <label className="block mt-3">
        <span className="block mb-2 font-bold">Start Date</span>
        <Input type="date" name="dateFrom" defaultValue={date.from} required />
      </label>
      <label className="block mt-3">
        <span className="block mb-2 font-bold">End Date</span>
        <Input
          type="date"
          name="dateUntil"
          defaultValue={date.until}
          required
        />
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
          <NavLink to="/festivals">
            <ArrowLeft aria-hidden />
            Back to Festivals
          </NavLink>
        </li>
      </ul>
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

export default FestivalForm
