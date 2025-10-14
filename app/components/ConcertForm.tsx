import type { FC } from 'react'
import Input from '~/components/Input'
import { ArrowLeft, Save } from 'react-bootstrap-icons'
import Button from '~/components/Button'
import NavLink from '~/components/NavLink'
import type Concert from '../entities/Concert'
import { Form, type SubmitFunction } from 'react-router'

type Props = {
  concert: Concert
  saveConcert: SubmitFunction
  method: 'post' | 'put'
}

const ConcertForm: FC<Props> = (props) => {
  const { concert, saveConcert, method } = props
  const { id, band, supportBands, location, date, companions } = concert

  return (
    <Form
      method={method}
      onSubmit={(event) => {
        saveConcert(event.currentTarget)
      }}
    >
      <input name="id" type="hidden" value={id} />
      <label className="block mt-3">
        <span className="block mb-2 font-bold">Band</span>
        <Input type="text" name="band" defaultValue={band} placeholder="Pink Floyd" required />
      </label>
      <label className="block mt-3">
        <span className="block mb-2 font-bold">Support</span>
        <Input
          name="supportBands"
          defaultValue={supportBands.join(', ')}
          placeholder="The Cure, Talking Heads,..."
        />
      </label>
      <label className="block mt-3">
        <span className="block mb-2 font-bold">Location</span>
        <Input
          type="text"
          name="location"
          defaultValue={location}
          placeholder="Wuhlheide"
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
          <NavLink to="/concerts">
            <ArrowLeft />
            Back to Concerts
          </NavLink>
        </li>
      </ul>
    </Form>
  )
}

export default ConcertForm
