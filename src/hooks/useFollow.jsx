import { useEffect, useState } from 'react'
import useFetch from './useFetch'

const useFollow = (user, event) => {
  const isInitiallyFollowing = user?.followingEvents.some(
    followedEvent => followedEvent.id === event?.id
  )
  const [isFollowing, setIsFollowing] = useState()
  const [followers, setFollowers] = useState()
  const [followLoading, setFollowLoading] = useState(true)
  const { updateFollowingEvents } = useFetch()

  useEffect(() => {
    if (event && user) {
      setIsFollowing(isInitiallyFollowing)
      setFollowers(event.usersFollowing.length)
      setFollowLoading(false)
    }
  }, [event, user])

  const toggleFollow = () => {
    if (isFollowing) {
      setIsFollowing(false)
      setFollowers(prev => prev - 1)
      updateFollowingEvents(user.id, event.id, 'DELETE')
    } else {
      setIsFollowing(true)
      setFollowers(prev => prev + 1)

      updateFollowingEvents(user.id, event.id, 'PUT')
    }
    setFollowLoading(false)
  }

  return { followers, isFollowing, toggleFollow, followLoading }
}

export default useFollow
