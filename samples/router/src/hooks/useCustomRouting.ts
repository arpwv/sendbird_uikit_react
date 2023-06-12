import { useEffect } from "react"
import useSendbirdStateContext from "@sendbird/uikit-react/useSendbirdStateContext"
import { GroupChannelHandler } from '@sendbird/chat/groupChannel'
import { useNavigate } from 'react-router-dom'


const simpleUUID = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export function useCustomRouting({ currentChannel }) {
  const store = useSendbirdStateContext()
  const navigate = useNavigate()
  const sb = store?.stores?.sdkStore?.sdk
  const userId = store?.config?.userId
  useEffect(() => {
    const handlerId = simpleUUID()
    if (sb?.groupChannel?.addGroupChannelHandler) {
      sb.groupChannel.removeGroupChannelHandler(handlerId)
      const handler = new GroupChannelHandler({
        onUserBanned: (groupChannel, user) => {
          if (groupChannel.url === currentChannel?.url && user?.userId === userId) {
            navigate('/');
          }
        },
      })
      sb.groupChannel.addGroupChannelHandler(handlerId, handler)
    }

    return () => {
      if (sb?.groupChannel?.removeGroupChannelHandler) {
        sb.groupChannel.removeGroupChannelHandler(handlerId)
      }
    }
  }, [currentChannel, userId, sb])
}
