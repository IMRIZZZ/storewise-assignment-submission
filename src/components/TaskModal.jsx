import { useState } from 'react';
import { Modal, TextInput, Button, Group, Text, Badge, Select } from '@mantine/core';

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'IN PROGRESS', label: 'In Progress' },
  { value: 'COMPLETE', label: 'Complete' },
];

const STATUS_COLORS = {
  PENDING: 'yellow',
  'IN PROGRESS': 'blue',
  COMPLETE: 'green',
};

const TaskModal = ({ opened, task, onClose, onUpdate, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(task.name);
  const [status, setStatus] = useState(task.status);

  const handleSave = () => {
    if (!name.trim()) return;
    onUpdate({ ...task, name: name.trim(), status });
    setEditing(false);
  };

  const handleCancel = () => {
    setName(task.name);
    setStatus(task.status);
    setEditing(false);
  };

  const handleDelete = () => {
    onDelete(task.id);
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text size="xl" fw={700} c="dark">
          {editing ? 'Edit Task' : task.name}
        </Text>
      }
      size="md"
      centered
      overlayProps={{ backgroundOpacity: 0.4, blur: 3 }}
    >
      {editing ? (
        <div className="modal-form">
          <TextInput
            label="Task Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            mb="md"
            data-autofocus
          />
          <Select
            label="Status"
            value={status}
            onChange={setStatus}
            data={STATUS_OPTIONS}
            mb="xl"
          />
          <Group justify="flex-end">
            <Button variant="default" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!name.trim()}>
              Save Changes
            </Button>
          </Group>
        </div>
      ) : (
        <div className="modal-detail">
          <div className="detail-row">
            <Text c="dimmed" size="sm" fw={500}>
              Status
            </Text>
            <Badge color={STATUS_COLORS[task.status] || 'gray'} size="lg" variant="light">
              {task.status}
            </Badge>
          </div>

          <div className="detail-row">
            <Text c="dimmed" size="sm" fw={500}>
              Task ID
            </Text>
            <Text size="sm" c="dimmed" ff="monospace">
              #{task.id}
            </Text>
          </div>

          <Group mt="xl" justify="space-between">
            <Button color="red" variant="light" onClick={handleDelete}>
              Delete Task
            </Button>
            <Button onClick={() => setEditing(true)}>Edit Task</Button>
          </Group>
        </div>
      )}
    </Modal>
  );
};

export default TaskModal;
