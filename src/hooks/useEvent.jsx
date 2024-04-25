import { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { httpGet } from '../utils'
import Constants from '../constants'
import { useParams } from 'react-router-dom'

const useEvent = () => {
  //need useState because we will use setState when event is edited
  const [event, setEvent] = useState(null)
  const eventId = useParams().id
  const { data, status } = useQuery('event', async () => {
    const eventInfo = await httpGet(Constants.EVENTS_ENDPOINT_URL, eventId)
    setEvent(eventInfo)
    return eventInfo
  })

  // need useEffect because also need setEvent
  useEffect(() => {
    if (data) {
      setEvent(data)
    }
  }, [data])

  return { event, setEvent, eventLoading: status === 'loading' }
}

export default useEvent