import React, { useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
  type DroppableProvided,
  type DroppableStateSnapshot,
  type DraggableProvided,
  type DraggableStateSnapshot,
} from '@hello-pangea/dnd';
import type { Task, TaskStatus, KanbanColumn } from '../../types/task';
import { TaskCard } from './TaskCard';
import './KanbanBoard.css';

interface KanbanBoardProps {
  tasks: Task[];
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskClick: (task: Task) => void;
  onCreateTask: () => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onTaskUpdate,
  onTaskClick,
  onCreateTask,
}) => {
  const [columns] = useState<KanbanColumn[]>([
    {
      id: 'todo',
      title: 'To Do',
      tasks: [],
      limit: undefined,
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      tasks: [],
      limit: 5,
    },
    {
      id: 'completed',
      title: 'Completed',
      tasks: [],
    },
    {
      id: 'parked',
      title: 'Parked',
      tasks: [],
    },
  ]);

  // Helper function to get priority order
  const getPriorityOrder = (priority: string): number => {
    switch (priority) {
      case 'high':
        return 0;
      case 'medium':
        return 1;
      case 'low':
        return 2;
      default:
        return 3;
    }
  };

  // Group tasks by status and sort by priority
  const getTasksByStatus = (status: TaskStatus): Task[] => {
    return tasks
      .filter((task) => task.status === status)
      .sort((a, b) => {
        const priorityA = getPriorityOrder(a.priority);
        const priorityB = getPriorityOrder(b.priority);

        // Sort by priority first (high to low), then by created date (newest first)
        if (priorityA !== priorityB) {
          return priorityA - priorityB;
        }

        // If same priority, sort by creation date (newest first)
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
  };

  const getColumnTaskCount = (status: TaskStatus): number => {
    return getTasksByStatus(status).length;
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If no destination, return early
    if (!destination) {
      return;
    }

    // If dropped in the same position, return early
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Find the task being moved
    const task = tasks.find((t) => t.id === draggableId);
    if (!task) return;

    // Update task status
    const newStatus = destination.droppableId as TaskStatus;
    onTaskUpdate(task.id, { status: newStatus });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'yellow';
      case 'low':
        return 'blue';
      default:
        return 'gray';
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'todo':
        return '#6b7280';
      case 'in-progress':
        return '#2563eb';
      case 'completed':
        return '#059669';
      case 'parked':
        return '#d97706';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="kanban-board">
      <div className="kanban-header">
        <h1>Task Board</h1>
        <button className="create-task-btn" onClick={onCreateTask}>
          + Add Task
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="kanban-columns">
          {columns.map((column) => {
            const columnTasks = getTasksByStatus(column.id);
            const taskCount = getColumnTaskCount(column.id);
            const isOverLimit = column.limit && taskCount > column.limit;

            return (
              <div key={column.id} className="kanban-column">
                <div className="column-header">
                  <div className="column-title">
                    <span
                      className="column-indicator"
                      style={{ backgroundColor: getStatusColor(column.id) }}
                    ></span>
                    <h3>{column.title}</h3>
                    <span
                      className={`task-count ${isOverLimit ? 'over-limit' : ''}`}
                    >
                      {taskCount}
                      {column.limit && ` / ${column.limit}`}
                    </span>
                  </div>
                  {isOverLimit && (
                    <div className="limit-warning">⚠️ Over limit</div>
                  )}
                </div>

                <Droppable droppableId={column.id}>
                  {(
                    provided: DroppableProvided,
                    snapshot: DroppableStateSnapshot
                  ) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`column-content ${
                        snapshot.isDraggingOver ? 'drag-over' : ''
                      }`}
                    >
                      {columnTasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(
                            provided: DraggableProvided,
                            snapshot: DraggableStateSnapshot
                          ) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`task-card-wrapper ${
                                snapshot.isDragging ? 'dragging' : ''
                              }`}
                            >
                              <TaskCard
                                task={task}
                                onClick={() => onTaskClick(task)}
                                priorityColor={getPriorityColor(task.priority)}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}

                      {columnTasks.length === 0 && (
                        <div className="empty-column">
                          <p>No tasks yet</p>
                          {column.id === 'todo' && (
                            <button
                              className="add-task-to-column"
                              onClick={onCreateTask}
                            >
                              + Add your first task
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};
