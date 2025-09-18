import { NextRequest, NextResponse } from 'next/server';

interface Message {
  id: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  message: string;
  timestamp: string;
  status: 'unread' | 'read' | 'replied';
  adminReply?: string;
  replyTimestamp?: string;
}

// In a real application, this would be stored in a database
const messages: Message[] = [];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (email) {
      // Get messages for specific customer
      const customerMessages = messages.filter(msg => msg.customerEmail === email);
      return NextResponse.json({
        success: true,
        messages: customerMessages,
        count: customerMessages.length
      });
    } else {
      // Get all messages for admin
      return NextResponse.json({
        success: true,
        messages: messages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
        count: messages.length,
        unreadCount: messages.filter(msg => msg.status === 'unread').length
      });
    }
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch messages'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, customerEmail, subject, message, type = 'new' } = body;

    if (!customerName || !customerEmail || !message) {
      return NextResponse.json({
        success: false,
        error: 'Customer name, email, and message are required'
      }, { status: 400 });
    }

    if (type === 'new') {
      // Create new message
      const newMessage: Message = {
        id: Date.now().toString(),
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        subject: subject?.trim() || 'Support Request',
        message: message.trim(),
        timestamp: new Date().toISOString(),
        status: 'unread'
      };

      messages.push(newMessage);

      return NextResponse.json({
        success: true,
        message: 'Message sent successfully',
        messageId: newMessage.id
      });
    } else if (type === 'reply') {
      // Admin reply to existing message
      const { messageId, adminReply } = body;
      
      if (!messageId || !adminReply) {
        return NextResponse.json({
          success: false,
          error: 'Message ID and admin reply are required'
        }, { status: 400 });
      }

      const messageIndex = messages.findIndex(msg => msg.id === messageId);
      if (messageIndex === -1) {
        return NextResponse.json({
          success: false,
          error: 'Message not found'
        }, { status: 404 });
      }

      messages[messageIndex].adminReply = adminReply.trim();
      messages[messageIndex].replyTimestamp = new Date().toISOString();
      messages[messageIndex].status = 'replied';

      return NextResponse.json({
        success: true,
        message: 'Reply sent successfully'
      });
    }

  } catch (error) {
    console.error('Error processing message:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process message'
    }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { messageId, status } = body;

    if (!messageId || !status) {
      return NextResponse.json({
        success: false,
        error: 'Message ID and status are required'
      }, { status: 400 });
    }

    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Message not found'
      }, { status: 404 });
    }

    messages[messageIndex].status = status;

    return NextResponse.json({
      success: true,
      message: 'Message status updated successfully'
    });

  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update message'
    }, { status: 500 });
  }
}