import type { FC } from 'react'
import Input from '~/components/Input'
import { ArrowLeft, Save } from 'react-bootstrap-icons'
import Button from '~/components/Button'
import NavLink from '~/components/NavLink'
import type Festival from '../entities/Festival'
import { Form, type SubmitFunction } from 'react-router'

type Props = {
  festival: Festival
  saveFestival: SubmitFunction
  method: 'post' | 'put'
}

const FestivalForm: FC<Props> = (props) => {
  const { festival, saveFestival, method } = props
  const { id, name, bands, date, companions } = festival

  return (
    <Form
      method={method}
      onSubmit={(event) => {
        saveFestival(event.currentTarget)
      }}
    >
      <input name="id" type="hidden" value={id} />
      <label className="block mt-3">
        <span className="block mb-2 font-bold">Name</span>
        <Input type="text" name="name" defaultValue={name} placeholder="Melt 2010" required />
      </label>
      <label className="block mt-3">
        <span className="block mb-2 font-bold">Bands</span>
        <Input
          name="bands"
          defaultValue={bands.join(', ')}
          placeholder="The Cure, Talking Heads,..."
        />
      </label>
      <label className="block mt-3">
        <span className="block mb-2 font-bold">Start Date</span>
        <Input type="date" name="dateFrom" defaultValue={date.from} required />
      </label>
      <label className="block mt-3">
        <span className="block mb-2 font-bold">End Date</span>
        <Input type="date" name="dateUntil" defaultValue={date.until} required />
      </label>
      <label className="block mt-3">
        <span className="block mb-2 font-bold">Companions</span>
        <Input
          name="companions"
          defaultValue={companions.join(', ')}
          placeholder="Leo, Max, Peter,..."
        />
      </label>
      <ul className="flex justify-between mt-6">
        <li>
          <Button type="submit">
            Save
            <Save />
          </Button>
        </li>
        <li>
          <NavLink to="/festivals">
            <ArrowLeft />
            Back to Festivals
          </NavLink>
        </li>
      </ul>
    </Form>
  )
}

export default FestivalForm
