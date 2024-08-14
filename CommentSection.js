import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import uuid from 'react-native-uuid';
import moment from 'moment';

const CommentSection = () => {
  const [comments, setComments] = useState([]);
  const [currentComment, setCurrentComment] = useState('');
  const [currentName, setCurrentName] = useState('');
  const [replyComment, setReplyComment] = useState({ text: '', name: '', commentId: null });
  const [editing, setEditing] = useState({ type: null, id: null, text: '' });

  const addComment = () => {
    if (currentName && currentComment) {
      const newComment = {
        id: uuid.v4(),
        name: currentName,
        comment: currentComment,
        timestamp: moment().format('LLL'),
        replies: [],
      };
      setComments([newComment, ...comments]); // Add the new comment to the beginning
      setCurrentComment('');
      setCurrentName('');
    }
  };

  const addReply = (id, replyText, replyName) => {
    const updatedComments = comments.map((comment) => {
      if (comment.id === id) {
        const newReply = {
          id: uuid.v4(),
          name: replyName,
          comment: replyText,
          timestamp: moment().format('LLL'),
        };
        return { ...comment, replies: [...comment.replies, newReply] };
      }
      return comment;
    });
    setComments(updatedComments);
    setReplyComment({ text: '', name: '', commentId: null });
  };

  const editComment = (id, newComment) => {
    const updatedComments = comments.map((comment) => {
      if (comment.id === id) {
        return { ...comment, comment: newComment };
      }
      return comment;
    });
    setComments(updatedComments);
    setEditing({ type: null, id: null, text: '' });
  };

  const editReply = (commentId, replyId, newReplyText) => {
    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        const updatedReplies = comment.replies.map((reply) => {
          if (reply.id === replyId) {
            return { ...reply, comment: newReplyText };
          }
          return reply;
        });
        return { ...comment, replies: updatedReplies };
      }
      return comment;
    });
    setComments(updatedComments);
    setEditing({ type: null, id: null, text: '' });
  };

  const renderReplyInput = (commentId) => (
    <View style={styles.replyInputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Your Name"
        value={replyComment.name}
        onChangeText={(text) => setReplyComment({ ...replyComment, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Your Reply"
        value={replyComment.text}
        onChangeText={(text) => setReplyComment({ ...replyComment, text })}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          addReply(commentId, replyComment.text, replyComment.name)
        }
      >
        <Text style={styles.buttonText}>Post Reply</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCommentItem = ({ item }) => (
    <View style={styles.commentContainer}>
      <Text style={styles.name}>{item.name}</Text>
      {editing.type === 'comment' && editing.id === item.id ? (
        <View>
          <TextInput
            style={styles.input}
            value={editing.text}
            onChangeText={(text) => setEditing({ ...editing, text })}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => editComment(item.id, editing.text)}
          >
            <Text style={styles.buttonText}>Save Comment</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.commentText}>{item.comment}</Text>
      )}
      <Text style={styles.timestamp}>{item.timestamp}</Text>
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setReplyComment({ ...replyComment, commentId: item.id })}
        >
          <Text style={styles.actionButtonText}>Reply</Text>
        </TouchableOpacity>
        {editing.type === 'comment' && editing.id === item.id ? (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => editComment(item.id, editing.text)}
          >
            <Text style={styles.actionButtonText}>Save Comment</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setEditing({ type: 'comment', id: item.id, text: item.comment })}
          >
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>
      {replyComment.commentId === item.id && renderReplyInput(item.id)}
      <FlatList
        data={item.replies}
        renderItem={({ item: replyItem }) => (
          <View style={styles.replyContainer}>
            <Text style={styles.name}>{replyItem.name}</Text>
            {editing.type === 'reply' && editing.id === replyItem.id ? (
              <View>
                <TextInput
                  style={styles.input}
                  value={editing.text}
                  onChangeText={(text) => setEditing({ ...editing, text })}
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => editReply(item.commentId, replyItem.id, editing.text)}
                >
                  <Text style={styles.buttonText}>Save Reply</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={styles.commentText}>{replyItem.comment}</Text>
            )}
            <Text style={styles.timestamp}>{replyItem.timestamp}</Text>
            <View style={styles.actionsContainer}>
              {editing.type === 'reply' && editing.id === replyItem.id ? (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => editReply(item.commentId, replyItem.id, editing.text)}
                >
                  <Text style={styles.actionButtonText}>Save Reply</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => setEditing({ type: 'reply', id: replyItem.id, text: replyItem.comment })}
                >
                  <Text style={styles.actionButtonText}>Edit Reply</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Your Name"
        value={currentName}
        onChangeText={(text) => setCurrentName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Your Comment"
        value={currentComment}
        onChangeText={(text) => setCurrentComment(text)}
      />
      <TouchableOpacity style={styles.button} onPress={addComment}>
        <Text style={styles.buttonText}>Post Comment</Text>
      </TouchableOpacity>
      <FlatList
        data={comments}
        renderItem={renderCommentItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
    backgroundColor: '#f9f9f9',
  },
  commentContainer: {
    backgroundColor: '#f1f1f1',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  replyContainer: {
    backgroundColor: '#e9e9e9',
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
    marginLeft: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  commentText: {
    fontSize: 14,
    marginTop: 5,
    marginBottom: 10,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
  },
  actionsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  actionButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  replyInputContainer: {
    marginTop: 10,
    marginLeft: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default CommentSection;
