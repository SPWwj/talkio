// import React, { useRef } from 'react';
// import { useChatService } from '@/hooks/useChatService';
// import ChatUI from './ChatUI';

// interface ChatContainerProps {
//     roomId: string;
//     token: string;
// }

// const ChatContainer: React.FC<ChatContainerProps> = ({ roomId, token }) => {
//     const {
//         messages,
//         newMessage,
//         setNewMessage,
//         handleSend,
//         receiverInfo: receiverInfo,
//         loading: isStreaming,
//         loadData,
//     } = useChatService(token, roomId);

//     const messagesEndRef = useRef<HTMLDivElement>(null);

//     React.useEffect(() => {
//         loadData();
//     }, [loadData]);

//     return (
//         <ChatUI
//             messages={messages}
//             newMessage={newMessage}
//             isLoading={isStreaming}
//             receiverInfo={receiverInfo}
//             onMessageChange={setNewMessage}
//             onSendMessage={handleSend}
//             messagesEndRef={messagesEndRef}
//         />
//     );
// };

// export default ChatContainer;
