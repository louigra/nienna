// events.config.js
export const EVENT_TYPES = [
    {
      key: 'documents',
      label: 'Documents',
      icon: 'file-earmark-text',
      orderBy: 'created_at',
      listFields: ['title','created_by','created_at'],
      eventTypes: ['document.added','document.updated','document.deleted']
    },
    {
      key: 'estimates',
      label: 'Estimates',
      icon: 'calculator',
      createLabel: 'Estimate',
      modalId: 'addEstimateModal',
      orderBy: 'created_at',
      listFields: ['version','status','created_at'],
      eventTypes: ['estimate.added','estimate.revised','estimate.approved']
    },
    {
      key: 'notes',
      label: 'Notes',
      icon: 'sticky',
      createLabel: 'Note',
      modalId: 'addNoteModal',
      orderBy: 'created_at',
      listFields: ['body','author_id','created_at'],
      eventTypes: ['note.added','note.edited','note.deleted']
    }
  ];