import { Steps, StepsProvider, useSteps } from 'react-step-builder'
import { Button } from '@nextui-org/button'
import { StepName } from '../components/CreateEventSteps/StepName'
import { StepType } from '../components/CreateEventSteps/StepType'
import { StepWhen } from '../components/CreateEventSteps/StepWhen'
import { StepWhere } from '../components/CreateEventSteps/StepWhere'
import { StepAssistants } from '../components/CreateEventSteps/StepAssistants'
import { StepDescription } from '../components/CreateEventSteps/StepDescription'
import { Constants } from '../constants'
import assets from '../assets'
import { ProgressBar } from '../components/ProgressBar'
import { useDispatch, useSelector } from 'react-redux'
import { StepImage } from '../components/CreateEventSteps/StepImage'
import { useState } from 'react'
import { getNewEventRequest } from '../utils/utils'
import { useNavigate } from 'react-router-dom'
import { loginSuccess } from '../redux/userSlice'
import { getUserById } from '../utils/httpUtils'

export const CreateEvent = () => {
  return (
    <>
      <StepsProvider>
        <StepsComponent />
      </StepsProvider>
    </>
  )
}

export const StepsComponent = props => {
  const [sendingEvent, setSendingEvent] = useState(false)
  const state = useSelector(state => state)
  const nextStepAvailable = useSelector(state => {
    return state.nextStep
  })
  const { prev, next, progress } = useSteps()

  const navigateTo = useNavigate()
  const dispatch = useDispatch()

  const handleSendEvent = () => {
    setSendingEvent(true)
    fetch(Constants.EVENTS_ENDPOINT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        getNewEventRequest(state.event, state.user.userInfo.id)
      )
    })
      .then(async res => {
        await getUserById(state.user.userInfo.id)
          .then(newUserData => {
            dispatch(loginSuccess(newUserData))
            navigateTo('/my-events')
          })
          .catch(error => {
            //handleError
            console.error('Error:', error.message)
          })
      })
      .catch(error => {
        console.error('Error al realizar la solicitud:', error)
      })
  }

  return (
    <div className='center flex-column mg-top-bt max-width-90'>
      <Steps>
       
          <StepName name={state.event.name} onChange={()=>{}}/>
          <StepType />
          <StepImage />
          <StepWhen />
          <StepWhere />
          <StepAssistants />
          <StepDescription />
      </Steps>
      <div className='flex bottom-20 absolute w-10/12 gap-4 flex-col'>
        <div className='flex justify-between w-full flex-row-reverse'>
          {progress > 0 && (
            <Button
              isDisabled={sendingEvent}
              color='primary'
              radius='full'
              isIconOnly
              onClick={prev}
            >
              <img src={assets.arrowLeft} />
            </Button>
          )}

          <Button
            isLoading={sendingEvent}
            isDisabled={!nextStepAvailable}
            className='order-first child-color-white'
            color='success'
            radius='full'
            isIconOnly
            onClick={() => {
              progress < 1 ? next() : handleSendEvent()
            }}
            onKeyDown={event => {
              console.log(progress)
              if (event.key === 'Enter') next()
            }}
          >
            <img src={progress < 1 ? assets.arrowRight : assets.check} />
          </Button>
        </div>
        <ProgressBar progress={progress} />
      </div>
    </div>
  )
}
