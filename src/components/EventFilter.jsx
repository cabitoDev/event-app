import { Input, Select, SelectItem, Radio, RadioGroup } from '@nextui-org/react'
import { SearchIcon } from './Navbar/SearchIcon'
import Constants from '../constants'

const EventFilter = ({
  handleSearchChange,
  handleFilterChange,
  handleFilterOtherChange,
  ownerOption
}) => {
  return (
    <div className='md:flex sm:flex-column justify-between gap-2 items-center'>
      <div className='flex-responsive gap-3'>
        <Input
          startContent={
            <div className='flex gap-1'>
              <SearchIcon />
            </div>
          }
          placeholder='Search by name...'
          onChange={e => handleSearchChange(e.target.value)}
        />
        <Select
          selectionMode='multiple'
          placeholder='Filter by type...'
          onChange={value => handleFilterChange(value)}
          className='ml-2 border rounded-md'
        >
          {Constants.EVENT_TYPES.map(type => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </Select>
      </div>
      <RadioGroup
        defaultValue='ALL'
        onChange={handleFilterOtherChange}
        orientation='horizontal'
      >
        <div className='align-start flex-responsive gap-2'>
          <Radio value='ALL'>All</Radio>
          <Radio value='FOLLOWING'>Following</Radio>
          {ownerOption ? (
            <Radio value='OWNER'>Owner</Radio>
          ) : (
            <Radio value='NOT_FOLLOWING'>Not following</Radio>
          )}
        </div>
      </RadioGroup>
    </div>
  )
}

export default EventFilter