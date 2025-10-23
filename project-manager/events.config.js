// events.config.js
export const EVENT_TYPES = [
    { key: 'documents', label: 'Documents', icon: 'file-earmark-text', orderBy: 'created_at', listFields: ['title','created_by','created_at'] },
    { key: 'estimates', label: 'Estimates', icon: 'calculator',       orderBy: 'created_at', listFields: ['version','status','created_at'] },
        {
          key: 'comments',                 // tab/hash key
          label: 'Comments',
          icon: 'chat-dots',
          // all event types that should appear on the Comments tab:
          eventTypes: ['comment.added', 'comment.edited'], 
          orderBy: 'created_at',
          listFields: ['summary','actor_id','created_at'] // or whatever you prefer
        }
  ];