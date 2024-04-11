import { Input, ListboxItem, Listbox } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { addressUpated } from '../../redux/eventSlice'
import { useDispatch, useSelector } from 'react-redux'
import { nextStepAvailable } from '../../redux/nextStepSlice'
import { TransitionAnimation } from '../TransitionAnimation'
import { Constants } from '../../constants'

export const StepWhere = () => {
  const [text, setText] = useState('')
  const [coincidences, setCoincidences] = useState([])
  const [shouldSearch, setShouldSearch] = useState(false)
  const newEvent = useSelector(state => state.event)
  const dispatch = useDispatch()

  useEffect(() => {
    setText(newEvent.address)
  }, [newEvent])

  useEffect(() => {
    if (text === '') {
      dispatch(nextStepAvailable(false))
      return
    }
    dispatch(nextStepAvailable(true))
  }, [text])

  const getMatches = async () => {
    return new Promise((resolve, reject) => {
      try {
        console.log(window.google)
        new window.google.maps.places.AutocompleteService().getPlacePredictions(
          {
            input: text,
            types: ['address']
          },
          resolve
        )
      } catch (e) {
        console.log(e)
      }
    })
  }

  const doQuery = async () => {
    if (!shouldSearch) return
    const results = JSON.parse(JSON.stringify(await getMatches()))
    console.log(results)
    setCoincidences(
      results.map(result => {
        return {
          description: result.description
        }
      })
    )
  }

  useEffect(() => {
    if (text && shouldSearch) doQuery()
  }, [text, shouldSearch])

  return (
    <TransitionAnimation>
      <p className='text-3xl text-center'>{Constants.QUESTION_STEP_WHERE}</p>
    <div className='input-width'>
      <Input
        autoFocus
        placeholder='Input the event address'
        value={text}
        onChange={e => {
          setText(e.target.value)
          setShouldSearch(true)
        }}
      />
      {coincidences.length > 0 && (
        <Listbox
          aria-label='User Menu'
          onAction={description => {
            setText(description)
            setShouldSearch(false)
            setCoincidences([])
            dispatch(addressUpated(description))
            dispatch(nextStepAvailable(true))
          }}
          className='z-20 p-0 gap-0 divide-y divide-default-300/50 dark:divide-default-100/80 bg-content1 w-full overflow-visible shadow-small rounded-medium'
          itemClasses={{
            base: 'px-3 first:rounded-t-medium last:rounded-b-medium rounded-none gap-3 h-12 data-[hover=true]:bg-default-100/80'
          }}
          items={coincidences}
        >
          {item => (
            <ListboxItem key={item.description}>{item.description}</ListboxItem>
          )}
        </Listbox>
      )}
    </div>
    </TransitionAnimation>
  )
}
